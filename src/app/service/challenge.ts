import { AxiosResponse } from "axios";
import {
  ICreateChallenge,
  IEditChallenge,
  ICreateCompanyChallenge,
  IUpdateChallengeImage,
  IChallenge,
} from "../types/challenge";
import http from "../utils/http";
import { ISkillProps } from "../screen/OnboardingScreens/CompleteProfile/CompleteProfileStep4";

export const createChallenge = (data: ICreateChallenge) => {
  return http.post("/challenge/create", data);
};

export const createCompanyChallenge = (data: ICreateCompanyChallenge) => {
  return http.post("/challenge/company/create", data);
};

export const updateChallengeImage = (
  params: IUpdateChallengeImage,
  image: string
) => {
  const imageData = new FormData();
  const extension = image.split(".").pop();
  imageData.append("file", {
    uri: image,
    name: `${params.id}.${extension}`,
    type: `image/${extension}`,
  } as any);

  return http.post(`/challenge/image/${params.id}`, imageData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getChallengeById = (id: string) => {
  return http.get(`/challenge/one/${id}`);
};

export const updateChallenge = (id: string, data: IEditChallenge) => {
  return http.put(`/challenge/update/${id}`, data);
};

export const completeChallenge = (challengeId: string) => {
  return http.put(`/challenge/done/${challengeId}`);
};

export const deleteChallenge = (id: string) => {
  return http.delete(`/challenge/delete/${id}`);
};

export const getChallengeByUserId = (userId: string) => {
  return http.get<IChallenge[]>(`/challenge/all/${userId}`);
};

export const getCertifiedChallengeOfCurrentUser = () => {
  return http.get<IChallenge[]>(`/challenge/certified/all`);
};

export const getChallengeParticipants = (challengeId: string) => {
  return http.get(`/challenge/participant/all/${challengeId}`);
};

export const getChallengeParticipantsByChallengeId = (challengeId: string) => {
  return http.get(`/challenge/participant/all/${challengeId}`);
};

export const serviceAddChallengeParticipant = (challengeId: string) => {
  return http.post(`/challenge/participant/add`, {
    challenge: challengeId,
  });
};

export const serviceRemoveChallengeParticipant = (challengeId: string) => {
  return http.delete(`/challenge/participant/remove/${challengeId}`);
};

export const serviceRateChallenge = (challengeID: string, rate: number) => {
  return http.post(`/challenge/rate`, {
    challenge: challengeID,
    rating: rate,
    review: "",
  });
};

export const serviceGetChallengeRating = (challengeId: string) => {
  return http.get(`/challenge/rating/${challengeId}`);
};

export const serviceGetAllChallengeByCoachId = (coachId: string) => {
  return http.get(`/challenge/coach/all/${coachId}`);
};

export const serviceGetSkillsToRate = (challengeId: string) => {
  return http.get(`/challenge/skills/rating/${challengeId}`);
};

export const servicePostRatingSkills = (
  challengeId: string,
  skills: {
    skillId: string;
    rate: number;
  }[],
  userId: string
) => {
  return http.post(`/challenge/skills/rate`, {
    challenge: challengeId,
    skillsRating: skills,
    user: userId,
  });
};
