export interface ICompanyData {
  id: string;
  partitaIva: string | null;
  email: string;
  phone: string | null;
  ragioneSociale: string | null; // business name
  webSite: string | null;
  user: ICompanyDataUser;
}

export interface ICompanyDataUser {
  id: string;
  email: string;
  name: string;
}
