import { AxiosResponse } from "axios";
import { create } from "zustand";

import { IUserData } from "../types/user";
import { serviceGetMe } from "../service/profile";

export interface UserProfileStore {
  userProfile: IUserData | null;

  setUserProfile: (profile: IUserData | null) => void;
  getUserProfile: () => IUserData | null;
  checkIsCompleteProfileOrCompany: () => boolean;

  onAuthStoreRehydrated: () => Promise<AxiosResponse<IUserData>>;
  onLogout: () => void;
}

export interface FollowingListStore {
  followingList: IUserData[] | null;
  setFollowingList: (profile: IUserData[] | null) => void;
  getFollowingList: () => IUserData[] | null;
}

export const useUserProfileStore = create<UserProfileStore>((set, get) => ({
  userProfile: null,

  setUserProfile: (profile) => {
    set({ userProfile: profile });
  },
  getUserProfile: () => get().userProfile,
  checkIsCompleteProfileOrCompany: () => {
    const profile = get().userProfile;
    if (profile?.companyAccount) return true;
    return !!profile?.birth;
  },

  onAuthStoreRehydrated: async () => {
    try {
      const r = await serviceGetMe();
      set({
        userProfile: r.data,
      });
      return r;
    } catch (e) {
      console.log(e);
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
