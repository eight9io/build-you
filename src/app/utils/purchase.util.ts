import { Platform } from "react-native";
import {
  requestPurchase,
  ProductPurchase,
  RequestPurchase,
  getProducts as getProductsFromProvider,
  Purchase,
  finishTransaction,
} from "react-native-iap";
import getSymbolFromCurrency from "currency-symbol-map";
import { verifyApplePurchase, verifyGooglePurchase } from "../service/purchase";
import {
  IInAppPurchaseProduct,
  IVerifyApplePurchaseResponse,
  IVerifyGooglePurchaseResponse,
  receiptDataAndroid,
} from "../types/purchase";
import {
  APPLE_IN_APP_PURCHASE_STATUS,
  GOOGLE_IN_APP_PURCHASE_STATUS,
  PRODUCT_PACKAGE_TYPE,
  PRODUCT_PLATFORM,
} from "../common/enum";
import { IPackage, PACKAGE_TYPE } from "../types/package";
import { getLanguageLocalStorage } from "./language";
import { serviceGetAllPackages } from "../service/package";
import { ICreateChallenge } from "../types/challenge";

export const requestPurchaseChecks = (productId: string) => {
  const requestPurchaseParams: RequestPurchase = {
    sku: productId, // Required for iOS purchases
    andDangerouslyFinishTransactionAutomaticallyIOS: false,
    skus: [productId], // Required for Android purchases
  };

  return getProductsFromProvider({ skus: [productId] }).then(() => {
    return requestPurchase(requestPurchaseParams);
  });
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
        product.packageType.trim() === packageType &&
        product.quantity === numOfChecks && // 1 quantity = 1 check
        product.platform === PRODUCT_PLATFORM.GOOGLE
    );
  return products.find(
    (product) =>
      product.packageType.trim() === packageType &&
      product.quantity === numOfChecks && // 1 quantity = 1 check
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
        console.log(
          "googleVerificationResult: ",
          googleVerificationResult.data
        );
        const purchase: Purchase = {
          productId: receipt.productId,
          transactionDate: receipt.transactionDate,
          transactionReceipt: receipt.transactionReceipt,
          transactionId: receipt.transactionId,
        };
        if (
          googleVerificationResult.data.purchaseStatus &&
          googleVerificationResult.data.purchaseStatus !==
            GOOGLE_IN_APP_PURCHASE_STATUS.PENDING
        )
          finishTransaction({ purchase, isConsumable: true })
            .then(() => {
              console.log("Google transaction finished");
            })
            .catch((error) => {
              console.log("Google transaction finished with error: ", error);
            });
        return googleVerificationResult.data;
      } else {
        const appleVerificationResult = await verifyApplePurchase({
          challengeId: challengeId,
          receipt: receipt.transactionReceipt,
        });
        console.log("appleVerificationResult: ", appleVerificationResult.data);
        const purchase: Purchase = {
          productId: receipt.productId,
          transactionDate: receipt.transactionDate,
          transactionReceipt: receipt.transactionReceipt,
          transactionId: receipt.transactionId,
        };
        if (
          appleVerificationResult.data.purchaseStatus &&
          appleVerificationResult.data.purchaseStatus !==
            APPLE_IN_APP_PURCHASE_STATUS.PENDING
        )
          finishTransaction({ purchase, isConsumable: true })
            .then(() => {
              console.log("Apple transaction finished");
            })
            .catch((error) => {
              console.log("Apple transaction finished with error: ", error);
            });
        return appleVerificationResult.data;
      }
    }
  } catch (error) {
    console.log("Verify Purchase Error: ", error);
    throw error;
  }
};

// export const getProductsFromStoreToDisplay = async () => {
//   // Get product from store to display in payment screen (unit price)
//   const res = await getProducts(); // Get product list from database
//   if (res.data) {
//     const products = res.data;
//     const { chatCheck, videoCheck, chatPackage, videoPackage } =
//       extractProductWithUnitPrice(products);
//     if (!chatCheck || !videoCheck || !chatPackage || !videoPackage) return null;

//     // Fetch product from store to get localized price based on device's locale
//     const packagesFromStore = await getProductsFromProvider({
//       skus: [
//         chatCheck.productId,
//         videoCheck.productId,
//         chatPackage.productId,
//         videoPackage.productId,
//       ],
//     });

//     const result: {
//       chatPackage: IProductFromStore;
//       videoPackage: IProductFromStore;
//       chatCheck: IProductFromStore;
//       videoCheck: IProductFromStore;
//     } = {
//       chatPackage: null,
//       videoPackage: null,
//       chatCheck: null,
//       videoCheck: null,
//     };

//     if (packagesFromStore.length === 0) return null;

//     packagesFromStore.forEach((packageFromStore) => {
//       const price =
//         Platform.OS === "ios"
//           ? Number(packageFromStore.price)
//           : priceMicrosToPrice(
//               Number(
//                 Number(
//                   packageFromStore.oneTimePurchaseOfferDetails.priceAmountMicros
//                 ).toFixed(2)
//               )
//             );
//       switch (packageFromStore.productId) {
//         case chatCheck.productId:
//           result.chatCheck = {
//             ...packageFromStore,
//             price: price || 0,
//           };
//           break;
//         case videoCheck.productId:
//           result.videoCheck = {
//             ...packageFromStore,
//             price: price || 0,
//           };
//           break;
//         case chatPackage.productId:
//           result.chatPackage = {
//             ...packageFromStore,
//             price: price || 0,
//           };
//           break;
//         case videoPackage.productId:
//           result.videoPackage = {
//             ...packageFromStore,
//             price: price || 0,
//           };
//           break;
//       }
//     });
//     return result;
//   }
//   return null;
// };

// export const getAllProductsFromStore = async () => {
//   try {
//     const res = await getProducts(); // Get product list from database
//     return res?.data;
//   } catch (error) {
//     console.error("Failed to get products:", error);
//     throw error;
//   }
// };

const extractProductWithUnitPrice = (products: IInAppPurchaseProduct[]) => {
  let chatCheck = null;
  let videoCheck = null;
  let chatPackage = null;
  let videoPackage = null;
  const platform = Platform.select({
    ios: PRODUCT_PLATFORM.APPLE,
    android: PRODUCT_PLATFORM.GOOGLE,
  });
  products.forEach((product) => {
    if (product.platform !== platform) return; // Only get product with the same platform as device (Apple or Google
    switch (product.packageType.trim()) {
      case PRODUCT_PACKAGE_TYPE.CHAT_CHECK: // Chat Check is expected to have only 1 product
        chatCheck = product;
        break;
      case PRODUCT_PACKAGE_TYPE.VIDEO_CHECK: // Video Check is expected to have only 1 product
        videoCheck = product;
        break;
      case PRODUCT_PACKAGE_TYPE.CHAT_CHALLENGE:
        // Chat Package is expected to have many products => get the one with quantity = 1 to display unit price
        // 1 quantity = 1 check
        if (product.quantity === 1) chatPackage = product;
        break;
      case PRODUCT_PACKAGE_TYPE.VIDEO_CHALLENGE:
        // Video Package is expected to have many products => get the one with quantity = 1 to display unit price
        // 1 quantity = 1 check
        if (product.quantity === 1) videoPackage = product;
        break;
    }
  });
  return { chatCheck, videoCheck, chatPackage, videoPackage };
};

export const getCurrencySymbol = (currency: string) => {
  // Get currency symbol based on currency code
  // Example: USD => $

  return getSymbolFromCurrency(currency);
};

export const priceMicrosToPrice = (priceMicros: number) => {
  if (isNaN(Number(priceMicros))) return 0;
  return Number(priceMicros) / 1000000;
};

export const getTranslatedBasicPackages = async () => {
  const currentLanguage = await getLanguageLocalStorage();
  let chatPackage: IPackage = null;
  let videoPackage: IPackage = null;
  try {
    const res = await serviceGetAllPackages(currentLanguage);
    chatPackage = res.data.packages.find(
      (item) => item.type === PACKAGE_TYPE.CHAT
    );
    videoPackage = res.data.packages.find(
      (item) => item.type === PACKAGE_TYPE.VIDEO_CALL
    );
  } catch (error) {
    console.error("get packages error", error);
  }
  return { chatPackage, videoPackage };
};

export const getPurchasingChallengeData = () => {
  const challengeData = localStorage.getItem("purchasingChallengeData");
  if (!challengeData) return null;
  return JSON.parse(challengeData);
};

export const setPurchasingChallengeData = (
  challengeData?: ICreateChallenge
) => {
  if (!challengeData) return localStorage.removeItem("purchasingChallengeData");
  return localStorage.setItem(
    "purchasingChallengeData",
    JSON.stringify(challengeData)
  );
};
