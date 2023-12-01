import { ICompanyData, ICompanyDataUser } from "./company";

export interface IUserData {
  id: string;
  email?: string;
  name: string;
  surname: string;
  birth?: string;
  role?: string;
  occupation?: IOccupation;
  // if occupation is 'ALTRO' then get occupation from occupationDetail
  occupationDetail?: string;
  bio?: string;
  video?: string;
  employeeOf?: ICompanyData | ICompanyDataUser;
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
  loginType?: ILoginType;
  isVerified?: boolean;
  city?: string;
  isCoach?: boolean;
  ratedSkill?: IRatedSkill[];
  calendly?: string;
  skills?: IUserSkills[];
}

export interface IUserSkills {
  id: string;
  isRated: boolean;
  rating: number;
  skill: string;
}

export interface IRatedSkill {
  rating: number;
  skill: {
    id: string;
    skill: string;
  };
}

export type ILoginType =
  | "standard"
  | "google"
  | "facebook"
  | "linkedin"
  | "apple";

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

export interface IOccupation {
  id: string;
  name: string;
}
