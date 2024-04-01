import httpInstance from "../utils/http";
import {
  ICreateCheckoutSessionPayload,
  IVerifyApplePurchase,
  IVerifyApplePurchaseResponse,
  IVerifyGooglePurchase,
  IVerifyGooglePurchaseResponse,
} from "../types/purchase";
import { IPackage } from "../types/package";

export const verifyGooglePurchase = (payload: IVerifyGooglePurchase) => {
  return httpInstance.post<IVerifyGooglePurchaseResponse>(
    "purchase/google",
    payload
  );
};

export const verifyApplePurchase = (payload: IVerifyApplePurchase) => {
  return httpInstance.post<IVerifyApplePurchaseResponse>(
    "purchase/apple",
    payload
  );
};

export const getBasicPackages = () => {
  return httpInstance.get<IPackage[]>("/purchase/stripe/products/basic");
};

export const getPackage = (type: "chat" | "video", numOfChecks: number) => {
  return httpInstance.get<IPackage>(
    `/purchase/stripe/products/${type}/${numOfChecks}`
  );
};

export const createCheckoutSession = (
  payload: ICreateCheckoutSessionPayload
) => {
  return httpInstance.get<string>(
    `/purchase/stripe/checkout/${payload.productId}/${payload.challengeId}`
  );
};
