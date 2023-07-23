export interface ISelectOption {
  key: number;
  label: string;
}

export interface IFeedPostProps {
  id: string;
  caption: string;
  image: string | string[] | null;
  video: string | null;
  location: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    surname: string;
    avatar: string;
    companyAccount?: boolean;
  };
  challenge: {
    id: string;
    goal: string;
  };
  first: boolean;
}

export interface IEmployeeDataProps {
  avatar: string;
  bio: string;
  companyAccount: boolean;
  cover: string;
  email: string;
  employeeof: {
    id: string;
    name: string;
  };
  id: string;
  isShowCompany: boolean;
  name: string;
  role: string;
  surname: string;
  video: string;
}
