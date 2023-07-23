import { IUserData } from "./user";

export interface ICreateProgress {
  user: string; // user id
  challenge: string; // challenge id
  caption: string;
  location: string;
}

export interface IProgressLike {
  progress: string; // progress id
  user: string; // user id
}

export interface ICreateProgressLike {
  progress: string; // progress id
}

export interface IProgressComment {
  id: string;
  progress: string; // progress id
  user: string; // user id
  userName: string;
  surName?: string;
  avatar: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateProgressComment {
  progress: string; // progress id
  comment: string;
}

export interface IUpdateProgress {
  caption: string;
}

export interface IProgressLikeData {
  id: string;
  progress: string; //progressId
  user: string; //userId
  userName: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}
