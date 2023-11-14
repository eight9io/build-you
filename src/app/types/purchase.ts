import {
  APPLE_IN_APP_PURCHASE_STATUS,
  GOOGLE_IN_APP_PURCHASE_STATUS,
} from "../common/enum";

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

export interface IVerifyApplePurchaseResponse {
  purchaseStatus: APPLE_IN_APP_PURCHASE_STATUS;
  valid: boolean;
}

export interface IVerifyGooglePurchaseResponse {
  purchaseStatus: GOOGLE_IN_APP_PURCHASE_STATUS;
  valid: boolean;
}
