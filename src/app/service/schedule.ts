import { AxiosResponse } from "axios";

import { IProposedScheduleTime, IScheduleProposal } from "../types/schedule";
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

export const getAllScheduleVideoCall = (
  challengeId: string
): Promise<AxiosResponse<IProposedScheduleTime[]>> => {
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
  note,
}: {
  scheduleId: string;
  meetingUrl: string;
  note: string;
}) => {
  return http.post(`/schedule/proposal/confirm`, {
    scheduleProposal: scheduleId,
    meetingUrl: meetingUrl,
    note: note,
  });
};

export const resetScheduledVideoCall = (scheduleId: string) => {
  return http.get(`/schedule/reset/${scheduleId}`);
};

export const createScheduleForIndividualCertifiedChallenge = ({
  challengeId,
  schedule,
  meetingUrl,
  note,
}: {
  challengeId: string;
  schedule: string;
  meetingUrl: string;
  note: string;
}) => {
  return http.post(`/schedule/single/create`, {
    challenge: challengeId,
    schedule: schedule,
    meetingUrl: meetingUrl,
    note: note,
  });
};

export const getAllScheduleByChallengeId = (challengeId: string) => {
  return http.get(`/schedule/single/all/${challengeId}`);
};

export const editScheduleForIndividualCertifiedChallenge = ({
  scheduleId,
  schedule,
  meetingUrl,
  note,
}: {
  scheduleId: string;
  schedule: string;
  meetingUrl: string;
  note: string;
}) => {
  return http.put(`/schedule/single/update`, {
    scheduleId: scheduleId,
    schedule: schedule,
    meetingUrl: meetingUrl,
    note: note,
  });
};

export const deleteScheduleForIndividualCertifiedChallenge = (
  scheduleId: string
) => {
  return http.put(`/schedule/delete/${scheduleId}`);
};
