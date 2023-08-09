import { create } from "zustand";
import {
  IChallenge,
  INumberOfCommentUpdate,
  INumberOfLikeUpdate,
  IChallengeRatingUpdate,
} from "../types/challenge";

export interface ChallengeUpdateStore {
  challengeUpdateDetails: IChallenge[];
  challengeUpdateNumberOfComment: INumberOfCommentUpdate;
  challengeUpdateNumberOfLike: INumberOfLikeUpdate;
  challengeRatingUpdate: IChallengeRatingUpdate;
  setChallengeUpdateDetails: (list: any) => void;
  getChallengeUpdateDetails: () => any;

  setChallengeUpdateComment: ({
    numberOfComments,
    id,
  }: {
    numberOfComments: number;
    id: string;
  }) => void;
  getChallengeUpdateComment: () => INumberOfCommentUpdate;
  setChallengeUpdateLike: ({
    numberOfLikes,
    id,
    isLikedByCurrentUser,
  }: {
    numberOfLikes: number;
    id: string;
    isLikedByCurrentUser: boolean;
  }) => void;
  getChallengeUpdateLike: () => INumberOfLikeUpdate;

  setChallengeRatingUpdate: ({
    id,
    rating,
  }: {
    id: string;
    rating: number;
  }) => void;
  getChallengeRatingUpdate: () => IChallengeRatingUpdate;
}

export const useChallengeUpdateStore = create<ChallengeUpdateStore>(
  (set, get) => ({
    challengeUpdateDetails: [] as IChallenge[],
    challengeUpdateNumberOfComment: {} as INumberOfCommentUpdate,
    challengeUpdateNumberOfLike: {} as INumberOfLikeUpdate,
    setChallengeUpdateDetails: (list) => {
      const newList = get().challengeUpdateDetails.concat(list);
      set({ challengeUpdateDetails: newList });
    },
    getChallengeUpdateDetails: () => get().challengeUpdateDetails,
    setChallengeUpdateComment: ({ numberOfComments, id }) => {
      const newCommentDetails = {
        id: id,
        numberOfComments: numberOfComments,
      };
      set({ challengeUpdateNumberOfComment: newCommentDetails });
    },
    getChallengeUpdateComment: () => {
      return get().challengeUpdateNumberOfComment;
    },
    setChallengeUpdateLike: ({ numberOfLikes, id, isLikedByCurrentUser }) => {
      const newLikeDetails = {
        id: id,
        numberOfLikes: numberOfLikes,
        isLikedByCurrentUser: isLikedByCurrentUser,
      };
      set({ challengeUpdateNumberOfLike: newLikeDetails });
    },
    getChallengeUpdateLike: () => {
      return get().challengeUpdateNumberOfLike;
    },
    challengeRatingUpdate: {} as IChallengeRatingUpdate,
    setChallengeRatingUpdate: ({ id, rating }) => {
      const newRatingDetails = {
        id: id,
        rating: rating,
      };
      set({ challengeRatingUpdate: newRatingDetails });
    },
    getChallengeRatingUpdate: () => {
      return get().challengeRatingUpdate;
    },
  })
);
