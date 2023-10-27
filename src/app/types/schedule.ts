export interface IProposedScheduleTime {
  id: string;
  challenge: string;
  proposal: string | Date; // proposal time
  schedule: string;
  user: string;
  isConfirmed: number;
  votes: number;
  createdAt: string;
  updatedAt: string;
  index?: number;
}

export interface IProposingScheduleTime {
  id?: string;
  index?: number;
  proposal: Date; // proposal time
}
