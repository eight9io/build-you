import httpInstance from "../utils/http";
import {
  IInAppPurchaseProduct,
  IVerifyApplePurchase,
  IVerifyApplePurchaseResponse,
  IVerifyGooglePurchase,
  IVerifyGooglePurchaseResponse,
} from "../types/purchase";

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

export const getProducts = () => {
  return httpInstance.get<IInAppPurchaseProduct[]>("/purchase/productList");
};
