import { AxiosResponse } from "axios";
import { create } from "zustand";

import { IUserData } from "../types/user";
import { serviceGetMe } from "../service/profile";
import { serviceGetAllUSerChallenges } from "../service/challenge";

export interface UserProfileStore {
  userProfile: IUserData | null;
  userAllChallengeIds: string[] | null;

  setUserProfile: (profile: IUserData | null) => void;
  getUserProfile: () => IUserData | null;
  getUserAllChallengeIds: () => string[] | null;
  // checkIsCompleteProfileOrCompany: () => boolean;

  getUserProfileAsync: () => Promise<AxiosResponse<IUserData>>;
  getUserAllChallengeIdsAsync: (
    userId: string
  ) => Promise<AxiosResponse<any[]>>;
  onLogout: () => void;
}

export interface FollowingListStore {
  followingList: IUserData[] | null;
  setFollowingList: (profile: IUserData[] | null) => void;
  getFollowingList: () => IUserData[] | null;
}

export const useUserProfileStore = create<UserProfileStore>((set, get) => ({
  userProfile: null,
  userAllChallengeIds: null,

  setUserProfile: (profile) => {
    set({ userProfile: profile });
  },
  setUserAllChallenges: (challenges) => {
    set({ userAllChallengeIds: challenges });
  },
  getUserProfile: () => get().userProfile,
  getUserAllChallengeIds: () => get().userAllChallengeIds,

  getUserProfileAsync: async () => {
    try {
      const r = await serviceGetMe();
      set({
        userProfile: r.data,
      });
      return r;
    } catch (e) {
      throw e;
    }
  },
  getUserAllChallengeIdsAsync: async (userId) => {
    try {
      const r = await serviceGetAllUSerChallenges(userId);
      const challengeIds = r.data.map((item) => item.id);
      set({
        userAllChallengeIds: challengeIds,
      });
      return r;
    } catch (e) {
      throw e;
    }
  },

  onLogout: () => {
    set({ userProfile: null });
  },
}));

export const useFollowingListStore = create<FollowingListStore>((set, get) => ({
  followingList: [],
  setFollowingList: (list) => {
    set({ followingList: list });
  },
  getFollowingList: () => get().followingList,
}));

export const checkIsCompleteProfileOrCompany = (profile: IUserData) => {
  if (profile?.companyAccount) return true;
  // console.log(JSON.stringify(profile, null, " "));
  return !!profile?.birth;
};

export const checkIsAccountVerified = (profile: IUserData) => {
  return !!profile?.isVerified;
};
