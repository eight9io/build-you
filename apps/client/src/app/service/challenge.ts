import { ICreateChallenge, IUpdateChallengeImage } from '../types/challenge';
import http from '../utils/http';
import { retryRequest } from '../utils/retryRequest';

export const createChallenge = (data: ICreateChallenge) => {
  return http.post('/challenge/create', data);
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

  return retryRequest(() => {
    return http.post(`/challenge/image/${params.id}`, imageData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  });
};

export const getChallengeById = (id: string) => {
  return http.get(`/challenge/one/${id}`);
};
