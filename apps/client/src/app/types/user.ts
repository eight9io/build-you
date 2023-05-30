export interface IUserData {
  id: string;
  email: string;
  name: string;
  surname: string;
  occupation?: {
    id: string;
    name: string;
  };
  birth?: string;
  bio?: string;
  company?: {
    id: string;
    piva: string;
    email: string;
    ragioneSociale: string;
    creditiTotali: number;
    creditiDisponibili: number;
  };
  role?: string;
  status?: string;
  avatar?: string;
}