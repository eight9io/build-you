import { create } from "zustand";
import { DEEP_LINK_PATH_NAME } from "../common/enum";
import {
  getParamFromDeepLinkPath,
  getPathNameFromDeepLinkPath,
} from "../utils/linking.util";

export interface IDeepLinkValue {
  param: string;
  pathName: DEEP_LINK_PATH_NAME;
}

export interface DeepLinkStore {
  deepLink: IDeepLinkValue;
  setDeepLink: (path: string) => void;
  getDeepLink: () => IDeepLinkValue;
}

export const useDeepLinkStore = create<DeepLinkStore>((set, get) => ({
  deepLink: null,
  setDeepLink: (path: string) => {
    if (!path) return set({ deepLink: null });
    const pathName = getPathNameFromDeepLinkPath(path) as DEEP_LINK_PATH_NAME;
    const param = getParamFromDeepLinkPath(path);
    set({ deepLink: { param, pathName } });
  },
  getDeepLink: () => get().deepLink,
}));
