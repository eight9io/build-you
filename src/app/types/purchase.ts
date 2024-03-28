import { Product } from "react-native-iap";
import {
  APPLE_IN_APP_PURCHASE_STATUS,
  GOOGLE_IN_APP_PURCHASE_STATUS,
} from "../common/enum";
import { PACKAGE_TYPE } from "./package";

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
  price: string;
  packageType:
    | "chat_check"
    | "video_check"
    | "chat_challenge"
    | "video_challenge";
}

export interface IVerifyApplePurchaseResponse {
  purchaseStatus: APPLE_IN_APP_PURCHASE_STATUS;
  valid: boolean;
}

export interface IVerifyGooglePurchaseResponse {
  purchaseStatus: GOOGLE_IN_APP_PURCHASE_STATUS;
  valid: boolean;
}

export interface IProductFromStore extends Omit<Product, "price"> {
  price: number;
}

export interface ICreateCheckoutSessionPayload {
  productId: string;
  challengeId: string;
}
