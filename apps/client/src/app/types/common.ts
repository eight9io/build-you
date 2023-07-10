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
