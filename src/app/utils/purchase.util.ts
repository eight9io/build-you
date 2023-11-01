import { EmitterSubscription, Platform } from "react-native";
import {
  requestPurchase,
  getProducts,
  flushFailedPurchasesCachedAsPendingAndroid,
  purchaseUpdatedListener,
  SubscriptionPurchase,
  ProductPurchase,
  finishTransaction,
  purchaseErrorListener,
  PurchaseError,
} from "react-native-iap";

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

  // This listener will receive unfinished purchase payload every app launch until it is finished
  // User cannot request for new purchases if there is an unfinished purchase
  const updateSubscription = purchaseUpdatedListener(
    (purchase: SubscriptionPurchase | ProductPurchase) => {
      console.log(
        "purchaseUpdatedListener",
        JSON.stringify(purchase, null, "\t")
      );
      // TODO: Check if purchase persisted in backend before calling finishTransaction()

      finishTransaction({ purchase, isConsumable: true }).then((isFinished) => {
        console.log("isFinished: ", isFinished);
      });
    }
  );

  const errorSubscription = purchaseErrorListener((error: PurchaseError) => {
    console.warn("purchaseErrorListener", error);
  });
  return { updateSubscription, errorSubscription };
};

export const requestPurchaseChecks = () => {
  // TODO: Remove these test ids and replace them with your own
  const consumableProductId = "test_consumable_product";
  const nonConsumableProductId = "test_non_consumable_product";
  const androidProductId = "android.test.purchased";

  // Must fetch products before purchase
  getProducts({ skus: [consumableProductId] }).then((products) => {
    console.log("product: ", JSON.stringify(products, null, "\t"));
    requestPurchase({
      sku: consumableProductId, // Required for iOS purchases
      andDangerouslyFinishTransactionAutomaticallyIOS: false,
      quantity: 1,
      skus: [consumableProductId], // Required for Android purchases
    }).catch((err) => {
      console.log("err: ", err);
    });
  });
};
