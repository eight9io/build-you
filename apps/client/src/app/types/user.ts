export interface IUserData {
  id: string;
  email: string;
  name: string;
  surname: string;
  birth: string;
  role?: string;
  occupation?: {
    id: string;
    name: string;
  };
  bio?: string;
  video?: string;
  company?: {
    id: string;
    piva: string;
    email: string;
    ragioneSociale: string;
    creditiTotali: number;
    creditiDisponibili: number;
  };
  status?: string;
  avatar?: string;
  hardSkill?: IHardSkillProps[];
  softSkill?: any[];
  cover?: string;
}

export interface IHardSkillProps {
  skill: {
    id: string;
    skill: string;
  };
}
export interface IHardSkill {
  id: string;
  skill: string;
}
