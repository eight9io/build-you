import httpInstance from "../utils/http";
import {
  IInAppPurchaseProduct,
  IVerifyApplePurchase,
  IVerifyGooglePurchase,
} from "../types/purchase";

export const verifyGooglePurchase = (payload: IVerifyGooglePurchase) => {
  return httpInstance.post("purchase/google", payload);
};

export const verifyApplePurchase = (payload: IVerifyApplePurchase) => {
  return httpInstance.post("purchase/apple", payload);
};

export const getProducts = () => {
  return httpInstance.get<IInAppPurchaseProduct[]>("/purchase/productList");
};
