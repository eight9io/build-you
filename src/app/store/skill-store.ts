import { create } from "zustand";
import { IHardSkill } from "../types/user";

export interface SkillStore {
  selectedHardSkills: IHardSkill[];
  userAddedSkill: IHardSkill[];

  setSelectedHardSkills: (skills: IHardSkill[]) => void;
  setUserAddedSkill: (skills: IHardSkill[]) => void;

  getSelectedHardSkills: () => IHardSkill[];
  getUserAddedSkill: () => IHardSkill[];
}

export const useSkillStore = create<SkillStore>((set, get) => ({
  selectedHardSkills: [],
  userAddedSkill: [],

  setSelectedHardSkills: (skills: IHardSkill[]) => {
    set({ selectedHardSkills: skills });
  },
  setUserAddedSkill: (skills: IHardSkill[]) => {
    set({ userAddedSkill: skills });
  },

  getSelectedHardSkills: () => get().selectedHardSkills,
  getUserAddedSkill: () => get().userAddedSkill,
}));
