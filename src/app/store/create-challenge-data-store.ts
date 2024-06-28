import { use } from "i18next";
import { create } from "zustand";

export interface CreateChallengeDataStore {
  formData: any;
  setCreateChallengeDataStore: (value: any) => void;
  getCreateChallengeDataStore: () => any;
}

export const useCreateChallengeDataStore = create<CreateChallengeDataStore>(
  (set, get) => ({
    formData: {usersList :[]},
    setCreateChallengeDataStore: (value) => {
      set({ formData: value });
    },
    getCreateChallengeDataStore: () => get().formData,
  })
);
