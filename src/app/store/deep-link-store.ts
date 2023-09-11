import { create } from "zustand";

export interface IDeepLinkValue {
  challengeId: string;
}

export interface DeepLinkStore {
  deepLink: IDeepLinkValue;
  setDeepLink: (value: IDeepLinkValue) => void;
  getDeepLink: () => IDeepLinkValue;
}

export const useDeepLinkStore = create<DeepLinkStore>((set, get) => ({
  deepLink: null,
  setDeepLink: (value) => {
    set({ deepLink: value });
  },
  getDeepLink: () => get().deepLink,
}));
