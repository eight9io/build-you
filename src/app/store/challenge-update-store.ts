import { create } from "zustand";
import { IChallenge } from "../types/challenge";

export interface ChallengeUpdateStore {
  challengeUpdateDetails: IChallenge[];
  setChallengeUpdateDetails: (list: any) => void;
  getChallengeUpdateDetails: () => any;
}

export const useChallengeUpdateStore = create<ChallengeUpdateStore>(
  (set, get) => ({
    challengeUpdateDetails: [] as IChallenge[],
    setChallengeUpdateDetails: (list) => {
      const newList = get().challengeUpdateDetails.concat(list);
      set({ challengeUpdateDetails: newList });
    },
    getChallengeUpdateDetails: () => get().challengeUpdateDetails,
  })
);
