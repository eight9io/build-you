import { create } from "zustand";

export interface IsCompleteProfileStore {
  isCompleteProfileStore: boolean | null;
  setIsCompleteProfileStore: (isCompleteProfileStore: boolean | null) => void;
  getIsCompleteProfileStore: () => boolean | null;
}

export const useIsCompleteProfileStore = create<IsCompleteProfileStore>(
  (set, get) => ({
    isCompleteProfileStore: null,
    setIsCompleteProfileStore: (isCompleteProfileStore) => {
      set({ isCompleteProfileStore });
    },
    getIsCompleteProfileStore: () => get().isCompleteProfileStore,
  })
);
