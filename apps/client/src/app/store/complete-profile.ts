import { create } from 'zustand';

export interface CompleteProfileStore {
  profile: {
    avatar: string;
    firstName: string;
    lastName: string;
    birthDay: string;
    occupation: string;
    bio?: string;
    skills?: string[];
    softSkills?: string[];
  };
  setProfile: (profile: {
    avatar: string;
    firstName: string;
    lastName: string;
    birthDay: string;
    occupation: string;
    bio?: string;
    skills?: string[];
    softSkills?: string[];
  }) => void;
}

export const useCompleteProfile = create<CompleteProfileStore>((set, get) => ({
  profile: {
    avatar: '',
    firstName: '',
    lastName: '',
    birthDay: '',
    occupation: '',
    bio: '',
    skills: [],
    softSkills: [],
  },
  setProfile: (profile) => {
    set({ profile });
  },
  getProfile: () => get().profile,
}));
