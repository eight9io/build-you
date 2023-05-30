import { create } from 'zustand';
import { IUserData } from '../types/user';

export interface UserProfileStore {
  userProfile: IUserData;
  setUserProfile: (profile: IUserData) => void;
  getUserProfile: () => IUserData;
}

export const useUserProfileStore = create<UserProfileStore>(
  (set, get) => ({
    userProfile: {
      id: '',
      email: '',
      name: '',
      surname: '',
      occupation: {
        id: '',
        name: '',
      },
      birth: '',
      bio: '',
      company: {
        id: '',
        piva: '',
        email: '',
        ragioneSociale: '',
        creditiTotali: 0,
        creditiDisponibili: 0,
      },
      role: '',
      status: '',
      avatar: '',
    },
    setUserProfile: (profile) => {
      set({ userProfile: profile });
    },
    getUserProfile: () => get().userProfile,
  })
);
