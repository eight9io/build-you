export interface IProposingScheduleTime {
  id?: string;
  proposal: string | Date; // proposal time
  index?: number;
  meetingUrl?: string;
  schedule?: string;
}

export interface IScheduleProposal {
  id: string;
  challenge: string;
  status: string;
  proposals: IProposalTime[];
  phase: string;
  check: number;
}

export interface IProposalTime {
  id: string;
  schedule: string;
  user: string;
  proposal: string;
  isConfirmed: number;
  isVotedByCurrentUser: boolean;
  votes: number;
  meetingUrl: string;
  votedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProposedScheduleTime {
  schedule: {
    check: null | number;
    createdAt: string;
    id: string;
    meetingUrl: null;
    phase: "intake" | "check" | "closing";
    stato: string;
    updatedAt: string;
  };
  proposals: IProposalTime[];
}
