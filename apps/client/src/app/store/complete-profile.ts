import { create } from 'zustand';

export interface CompleteProfileStore {
  profile: {
    avatar?: string;
    firstName: string;
    lastName: string;
    birthDay: string;
    occupation: string;
    biography?: string;
    video?: string;
    skills?: string[];
    softSkills?: any[];
  };
  setProfile: (profile: {
    avatar: string;
    firstName: string;
    lastName: string;
    birthDay: string;
    occupation: string;
    biography?: string;
    video?: string;
    skills?: string[];
    softSkills?: any[];
  }) => void;
  setBiography: (bio: string, video: string) => void;
  setSkills: (skills: string[]) => void;
  setSoftSkills: (softSkills: any[]) => void;
  getProfile: () => {
    avatar?: string;
    firstName: string;
    lastName: string;
    birthDay: string;
    occupation: string;
    biography?: string;
    video?: string;
    skills?: string[];
    softSkills?: any[];
  };
}

export const useCompleteProfileStore = create<CompleteProfileStore>(
  (set, get) => ({
    profile: {
      avatar: '',
      firstName: '',
      lastName: '',
      birthDay: '',
      occupation: '',
      biography: '',
      video: '',
      skills: [],
      softSkills: [],
    },
    setProfile: (profile) => {
      set({ profile });
    },
    setBiography: (bio: string, video: string) => {
      set({ profile: { ...get().profile, biography: bio, video: video } });
    },
    setSkills: (skills: string[]) => {
      set({ profile: { ...get().profile, skills: skills } });
    },
    setSoftSkills: (softSkills: any[]) => {
      set({ profile: { ...get().profile, softSkills: softSkills } });
    },
    getProfile: () => get().profile,
  })
);
