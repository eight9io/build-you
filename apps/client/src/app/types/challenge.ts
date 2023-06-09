export interface ICreateChallenge {
  goal: string;
  benefits: string;
  reasons: string;
  achievementTime: Date;
}

export interface IEditChallenge {
  goal: string;
  benefits: string;
  reasons: string;
  achievementTime: Date;
}

export interface IUpdateChallengeImage {
  id: string;
}

export interface IProgressChallenge {
  id: string;
  // user: string; missing from api but we can get 
  challenge: string;
  caption: string;
  image: string | null;
  video: string | null;
  location: string;
}

export interface IChallenge {
  id: string;
  goal: string;
  name: string;
  benefits: string;
  reasons: string;
  achievementTime: Date;
  image?: string | null;
  status?: string;
  progress?: IProgressChallenge[];
}
