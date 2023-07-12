import {
  IChallenge,
  ICreateChallenge,
  IEditChallenge,
  ICreateCompanyChallenge,
  IUpdateChallengeImage,
} from '../types/challenge';
import http from '../utils/http';
import { retryRequest } from '../utils/retryRequest';

export const createChallenge = (data: ICreateChallenge) => {
  return http.post('/challenge/create', data);
};

export const createCompanyChallenge = (data: ICreateCompanyChallenge) => {
  return http.post('/challenge/company/create', data);
};

export const updateChallengeImage = (
  params: IUpdateChallengeImage,
  image: string
) => {
  const imageData = new FormData();
  const extension = image.split('.').pop();
  imageData.append('file', {
    uri: image,
    name: `${params.id}.${extension}`,
    type: `image/${extension}`,
  } as any);

  return http.post(`/challenge/image/${params.id}`, imageData, {
    headers: {
      'Content-Type': 'multipart/form-data',
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
  return http.put(`/challenge/update/${challengeId}`, {
    status: 'closed',
  });
};

export const deleteChallenge = (id: string) => {
  return http.delete(`/challenge/delete/${id}`);
};
export const getChallengeByUserId = (userId: string) => {
  return http.get(`/challenge/all/${userId}`);
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
