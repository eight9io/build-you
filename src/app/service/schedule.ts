import http from "../utils/http";

export const creatProposalScheduleVideoCall = ({
  challengeId,
  phase,
  check,
  proposal,
}: {
  phase: "intake" | "check" | "closing";
  challengeId: string;
  check: number | null;
  proposal: string[];
}) => {
  return http.post(`/schedule/create`, {
    phase,
    check,
    proposal,
    challenge: challengeId,
  });
};

export const getAllScheduleVideoCall = (challengeId: string) => {
  return http.get(`/schedule/proposal/all/${challengeId}`);
};

export const createVoteScheduleVideoCall = (scheduleId: string) => {
  return http.post(`/schedule/proposal/vote`, {
    scheduleProposal: scheduleId,
  });
};

export const confirmProposalByCoach = ({
  scheduleId,
  meetingUrl,
}: {
  scheduleId: string;
  meetingUrl: string;
}) => {
  return http.post(`/schedule/proposal/confirm`, {
    scheduleProposal: scheduleId,
    meetingUrl: meetingUrl,
  });
};
