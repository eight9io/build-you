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

export interface IChallenge {
  id: string;
  goal: string;
  benefits: string;
  reasons: string;
  achievementTime: Date;
  image: string;
}