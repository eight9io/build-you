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
  progress: string; // progress id
  user: string; // user id
  comment: string;
}

export interface ICreateProgressComment {
  progress: string; // progress id
  comment: string;
}