export interface IUserData {
  id: string;
  email: string;
  name: string;
  surname: string;
  birth?: string;
  role?: string;
  occupation?: {
    id: string;
    name: string;
  };
  bio?: string;
  video?: string;
  employeeOf?: {
    id: string;
    piva: string;
    email: string;
    ragioneSociale: string;
    creditiTotali: number;
    creditiDisponibili: number;
    name: string;
  };
  status?: string;
  avatar?: string;
  hardSkill?: IHardSkillProps[];
  softSkill?: any[];
  cover?: string;
  companyAccount?: boolean | null;
  isShowCompany?: boolean | null;
  challengeStatus?: string;
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

export interface ISearchUserData {
  avatar: string;
  companyAccount: boolean;
  email: string;
  id: string;
  name: string;
  surname: string;
}
