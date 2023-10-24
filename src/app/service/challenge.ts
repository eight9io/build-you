import {
  IChallenge,
  ICreateChallenge,
  IEditChallenge,
  ICreateCompanyChallenge,
  IUpdateChallengeImage,
} from "../types/challenge";
import http from "../utils/http";

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

export const getCertifiedChallengeParticipants = (challengeId: string) => {
  return http.get(`/challenge/certified/participant/all/${challengeId}`);
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

export const serviceGetCertifiedChallengeStatus = (challengeId: string) => {
  return http.get(`/challenge/status/${challengeId}`);
};

export const serviceOpenTouchpoint = (challengeId: string) => {
  // only challenge creator can open touchpoint
  return http.put(`challenge/touchpoint/open/${challengeId}`);
};

export const serviceCloseTouchpoint = (challengeId: string) => {
  // only challenge coach can close touchpoint
  return http.put(`challenge/touchpoint/close/${challengeId}`);
};

export const serviceRateSoftSkillCertifiedChallenge = (
  challengeId: string,
  userId: string,
  skill: {
    id: string;
    rating: number;
  }[]
) => {
  // change id in skill to skillId
  const skillToSend = skill.map((item) => {
    return {
      skillId: item.id,
      rating: item.rating,
    };
  });
  return http.post(`/challenge/skills/rate`, {
    challenge: challengeId,
    user: userId,
    skillsRating: skillToSend,
  });
};

export const serviceGetRatedSoftSkillCertifiedChallenge = (
  challengeId: string
) => {
  return http.get(`/challenge/skills/rating/${challengeId}`);
};

export const serviceGetAllUSerChallenges = (userId: string) => {
  if (!userId) return null;
  return http.get(`/challenge/participant/${userId}`);
};
