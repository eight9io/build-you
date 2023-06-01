import { create } from 'zustand';

export interface IsCompleteProfileStore {
  isCompleteProfileStore: boolean;
  setIsCompleteProfileStore: (isCompleteProfileStore: boolean) => void;
  getIsCompleteProfileStore: () => boolean;
}

export const useIsCompleteProfileStore = create<IsCompleteProfileStore>(
  (set, get) => ({
    isCompleteProfileStore: false,
    setIsCompleteProfileStore: (isCompleteProfileStore) => {
      set({ isCompleteProfileStore });
    },
    getIsCompleteProfileStore: () => get().isCompleteProfileStore,
  })
);
