import { ICreateChallenge, IUpdateChallengeImage } from '../types/challenge';
import http from '../utils/http';

export const createChallenge = (data: ICreateChallenge) => {
  return http.post('/challenge/create', data);
};

export const updateChallengeImage = (
  params: IUpdateChallengeImage,
  image: FormData
) => {
  return http.post(`/challenge/image/${params.id}`, image, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getChallengeById = (id: string) => {
  return http.get(`/challenge/one/${id}`);
};
