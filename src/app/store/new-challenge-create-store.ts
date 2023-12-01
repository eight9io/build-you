import { create } from "zustand";

export interface INewChallengeStore {
  newChallengeId: string;
  setNewChallengeId: (id: string) => void;
  getNewChallengeId: () => string;
  deletedChallengeId: string;
  setDeletedChallengeId: (id: string) => void;
  getDeletedChallengeId: () => string;
}

export const useNewCreateOrDeleteChallengeStore = create<INewChallengeStore>((set, get) => ({
  newChallengeId: null,
  deletedChallengeId: null,
  setNewChallengeId: (id) => {
    set({ newChallengeId: id });
  },
  getNewChallengeId: () => get().newChallengeId,
  setDeletedChallengeId: (id) => {
    set({ deletedChallengeId: id });
  },
  getDeletedChallengeId: () => get().deletedChallengeId,
}));
