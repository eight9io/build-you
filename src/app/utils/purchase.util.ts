import { EmitterSubscription, Platform } from "react-native";
import {
  requestPurchase,
  flushFailedPurchasesCachedAsPendingAndroid,
  ProductPurchase,
  purchaseErrorListener,
  PurchaseError,
  RequestPurchase,
  RequestPurchaseIOS,
  getProducts as getProductsFromProvider,
} from "react-native-iap";
import {
  getProducts,
  verifyApplePurchase,
  verifyGooglePurchase,
} from "../service/purchase";
import {
  IInAppPurchaseProduct,
  IVerifyApplePurchaseResponse,
  IVerifyGooglePurchaseResponse,
  receiptDataAndroid,
} from "../types/purchase";
import { PRODUCT_PLATFORM } from "../common/enum";

export const registerIAPListeners = async (): Promise<{
  updateSubscription: EmitterSubscription;
  errorSubscription: EmitterSubscription;
}> => {
  if (Platform.OS === "android") {
    try {
      // we make sure that "ghost" pending payment are removed
      // (ghost = failed pending payment that are still marked as pending in Google's native Vending module cache)
      await flushFailedPurchasesCachedAsPendingAndroid();
    } catch (error) {
      console.log("error: ", error);
      // exception can happen here if:
      // - there are pending purchases that are still pending (we can't consume a pending purchase)
      // in any case, you might not want to do anything special with the error
    }
  }

  // NOTE: Not using purchaseUpdatedListener for now since backend will handle the "finishTransaction" part
  const updateSubscription = null;

  // This listener will receive unfinished purchase payload every app launch until it is finished
  // User cannot request for new purchases if there is an unfinished purchase
  // const updateSubscription = purchaseUpdatedListener(
  //   (purchase: SubscriptionPurchase | ProductPurchase) => {
  //     console.log(
  //       "purchaseUpdatedListener",
  //       JSON.stringify(purchase, null, "\t")
  //     );
  //     // TODO: Check if purchase persisted in backend before calling finishTransaction()

  //     finishTransaction({ purchase, isConsumable: true }).then((isFinished) => {
  //       console.log("isFinished: ", isFinished);
  //     });
  //   }
  // );

  const errorSubscription = purchaseErrorListener((error: PurchaseError) => {
    console.warn("purchaseErrorListener", error);
  });
  return { updateSubscription, errorSubscription };
};

export const requestPurchaseChecks = (
  productId: string,
  numOfChecks: number
) => {
  const requestPurchaseParams: RequestPurchase = {
    sku: productId, // Required for iOS purchases
    andDangerouslyFinishTransactionAutomaticallyIOS: false,
    skus: [productId], // Required for Android purchases
  };

  // Quantity can only used for iOS purchases, no support for Android at the moment
  if (Platform.OS === "ios")
    (requestPurchaseParams as RequestPurchaseIOS).quantity = numOfChecks;

  return getProductsFromProvider({ skus: [productId] }).then(() => {
    return requestPurchase(requestPurchaseParams);
  });
};

export const getProductFromDatabase = async (
  packageType: string,
  numOfChecks: number
) => {
  const res = await getProducts(); // Get product list from database
  if (res.data) {
    const products = res.data;
    const productToBeFetched = extractProductByPlatform(
      products,
      packageType === "videocall" ? "video" : "chat", // TODO: Unify packageType in database
      numOfChecks,
      Platform.OS
    );
    return productToBeFetched;
  }
  return null;
};

export const extractProductByPlatform = (
  products: IInAppPurchaseProduct[],
  packageType: string,
  numOfChecks: number,
  platform: string
) => {
  if (platform === "android")
    return products.find(
      (product) =>
        product.packageType === packageType &&
        product.quantity === numOfChecks && // Google not supporting quantity for consumable products at the moment
        product.platform === PRODUCT_PLATFORM.GOOGLE
    );
  return products.find(
    (product) =>
      product.packageType === packageType &&
      product.platform === PRODUCT_PLATFORM.APPLE
  );
};

export const verifyPurchase = async (
  receipt: ProductPurchase,
  challengeId: string
): Promise<IVerifyGooglePurchaseResponse | IVerifyApplePurchaseResponse> => {
  try {
    if (receipt) {
      if (Platform.OS === "android") {
        const dataAndroid: receiptDataAndroid = receipt.dataAndroid
          ? JSON.parse(receipt.dataAndroid)
          : null;
        if (!dataAndroid) throw new Error("No dataAndroid found in receipt");
        const googleVerificationResult = await verifyGooglePurchase({
          challengeId: challengeId,
          receipt: {
            data: {
              productId: receipt.productId,
              packageName: receipt.packageNameAndroid,
              purchaseToken: receipt.purchaseToken,
              purchaseTime: new Date(dataAndroid.purchaseTime),
              orderId: dataAndroid.orderId,
              purchaseState: receipt.purchaseStateAndroid,
              quantity: dataAndroid.quantity,
            },
          },
        });
        return googleVerificationResult.data;
      } else {
        const appleVerificationResult = await verifyApplePurchase({
          challengeId: challengeId,
          receipt: receipt.transactionReceipt,
        });
        return appleVerificationResult.data;
      }
    }
  } catch (error) {
    console.log("Verify Purchase Error: ", error);
    // If there is an error in verification, need to ignore it => close the payment screen => prevent user accidentally paying twice
  }
};