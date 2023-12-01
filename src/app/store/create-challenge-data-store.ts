import { create } from "zustand";

export interface CreateChallengeDataStore {
  formData: any;
  setCreateChallengeDataStore: (value: any) => void;
  getCreateChallengeDataStore: () => any;
}

export const useCreateChallengeDataStore = create<CreateChallengeDataStore>(
  (set, get) => ({
    formData: null,
    setCreateChallengeDataStore: (value) => {
      set({ formData: value });
    },
    getCreateChallengeDataStore: () => get().formData,
  })
);
