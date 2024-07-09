import { AxiosResponse } from "axios";
import { create } from "zustand";

export interface PriceStore {
  chatPackagePrice: string | null;
  videoPackagePrice: string | null;
  setChatPackagePrice: (price: string) => void;
  setVideoPackagePrice: (price: string) => void;
  getChatPackagePrice: () => string | null;
  getVideoPackagePrice: () => string | null;
}

export const usePriceStore = create<PriceStore>((set, get) => ({
  chatPackagePrice: null,
  videoPackagePrice: null,
  setChatPackagePrice: (price) => {
    set({ chatPackagePrice: price });
  },
  setVideoPackagePrice: (price) => {
    set({ videoPackagePrice: price });
  },
  getChatPackagePrice: () => get().chatPackagePrice,
  getVideoPackagePrice: () => get().videoPackagePrice,
}));
