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
}

export interface IHardSkillProps {
  id: string;
  skill: string;
}
