import httpInstance from '../utils/http';
import { retryRequest } from '../utils/retryRequest';
import { ICreateProgress } from '../types/progress';

export const createProgress = (data: ICreateProgress) => {
  return httpInstance.post('/challenge/progress/create', data);
};

export const updateProgressImage = (progressId: string, image: FormData) => {
  return retryRequest(() => {
    return httpInstance.post(`/challenge/progress/image/${progressId}`, image, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  });
};

export const getProgressById = (id: string) => {};
