import { create } from 'zustand';
import { IUserData, IHardSkillProps } from '../types/user';

interface IUserDataUpload {
  id: string;
  avatar?: string;
  name: string;
  surname: string;
  birth: string;
  occupation?: any;
  biography?: string;
  video?: string;
  skills?: IHardSkillProps[];
  softSkills?: any[];
}

export interface CompleteProfileStore {
  profile: IUserDataUpload;
  setProfile: (profile: IUserDataUpload) => void;
  setBiography: (bio: string, video: string) => void;
  setSkills: (skills: IHardSkillProps[]) => void;
  setSoftSkills: (softSkills: any[]) => void;
  getProfile: () => IUserDataUpload;
}

export const useCompleteProfileStore = create<CompleteProfileStore>(
  (set, get) => ({
    profile: {
      id: '',
      avatar: '',
      name: '',
      surname: '',
      birth: '',
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
    setSkills: (skills: IHardSkillProps[]) => {
      set({ profile: { ...get().profile, skills: skills } });
    },
    setSoftSkills: (softSkills: any[]) => {
      set({ profile: { ...get().profile, softSkills: softSkills } });
    },
    getProfile: () => get().profile,
  })
);
