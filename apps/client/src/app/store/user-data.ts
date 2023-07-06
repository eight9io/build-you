import { create } from 'zustand';
import { IUserData } from '../types/user';

export interface UserProfileStore {
  userProfile: IUserData | null;
  setUserProfile: (profile: IUserData | null) => void;
  getUserProfile: () => IUserData | null;
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
}));

export const useFollowingListStore = create<FollowingListStore>((set, get) => ({
  followingList: [],
  setFollowingList: (list) => {
    set({ followingList: list });
  },
  getFollowingList: () => get().followingList,
}));
