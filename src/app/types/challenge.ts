import { IUserData } from "./user";

export type IChallengeTouchpointStatus =
  | "init"
  | "open"
  | "in-progress"
  | "closed";

export type CheckType<N extends number> = N extends infer Num
  ? Num extends number
    ? `check-${Num}`
    : never
  : never;

export type CheckpointType = "intake" | CheckType<number> | "closing";

export interface ICreateChallenge {
  goal: string;
  benefits: string;
  reasons: string;
  achievementTime: Date;
}

export interface ICreateCompanyChallenge {
  goal: string;
  benefits: string;
  reasons: string;
  achievementTime: Date | undefined;
  maximumPeople: number | undefined;
  public: boolean;
  image?: string;
  type?: string;
  package?: string;
  softSkills?: ISoftSkill[];
  checkpoint: number;
}

export interface ISoftSkill {
  id: string;
  label: string;
}

export interface IEditChallenge {
  goal: string;
  benefits: string;
  reasons: string;
  achievementTime: string;
}

export interface IUpdateChallengeImage {
  id: string;
}

export interface IProgressChallenge {
  id: string;
  // user: string; missing from api but we can get
  challenge?: {
    id: string;
    goal: string;
  };
  caption: string;
  image: string | null;
  video: string | null;
  location: string;
  createdAt: string;
  likes?: any[];
  comments?: any[];
  first?: boolean;
  owner: IUserData | null;
}

export interface IChallengeOwner {
  id: string;
  avatar: string;
  name: string;
  surname: string;
  companyAccount?: boolean;
}

export interface IChallenge {
  id: string;
  goal: string;
  name: string;
  owner: IChallengeOwner | IChallengeOwner[];
  benefits: string;
  reasons: string;
  achievementTime: Date;
  image?: string | null;
  status?: string;
  public?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  progress?: IProgressChallenge[];
  participants?: IUserData[];
  maximumPeople?: number;
  totalCurrentParticipant?: number;
  type?: "free" | "certified";
  package?: IChallengePackage | null;
  intake?: any;
  check?: any;
  closing?: any;
  coach?: string;
  // TODO: update type when api ready
}

export interface IChallengePackage {
  id: string;
  name: string;
  caption: string;
  price: number;
  type: "videocall" | "chat";
}

export interface INumberOfCommentUpdate {
  id: string;
  numberOfComments: number;
}

export interface INumberOfLikeUpdate {
  id: string;
  numberOfLikes: number;
  isLikedByCurrentUser: boolean;
}

export interface IChallengeRatingUpdate {
  id: string;
  rating: number;
}

export interface ICreateChallengeForm
  extends Omit<ICreateChallenge, "achievementTime"> {
  achievementTime: string | Date;
  image: string;
}

export interface ICreateCretifiedChallengeForm
  extends Omit<ICreateChallenge, "achievementTime"> {
  achievementTime: string | Date;
  image: string;
  softSkills: string[];
}

export interface IChallengeState {
  numberOfChecks: number;
  currentTouchpoint: CheckpointType;
  currentTouchpointStatus: IChallengeTouchpointStatus;
  handleOpenChangeTouchpointStatusModal: () => void;
}
