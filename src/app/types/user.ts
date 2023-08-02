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
  emailContact?: string;
  phone?: string;
  webSite?: string;
  pIva?: string;
}

export interface IHardSkillProps {
  id: string;
  skill: any;
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
