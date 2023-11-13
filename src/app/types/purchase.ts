import { ProductPurchase } from "react-native-iap";

export interface receiptDataAndroid {
  orderId: string;
  packageName: string;
  purchaseTime: number;
  quantity: number;
}

export interface IVerifyGooglePurchase {
  challengeId: string;
  receipt: {
    data: {
      productId: string;
      packageName: string;
      purchaseToken: string;
      orderId: string;
      purchaseState: number;
      purchaseTime: Date;
      quantity: number;
    };
  };
}

export interface IVerifyApplePurchase {
  challengeId: string;
  receipt: string;
}

export interface IInAppPurchaseProduct {
  productId: string;
  platform: "google" | "apple";
  quantity: number;
  packageType: "chat" | "video";
}
