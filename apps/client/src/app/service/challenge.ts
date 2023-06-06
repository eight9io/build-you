import { ICreateChallenge } from '../types/challenge';
import http from '../utils/http';

export const createChallenge = (data: ICreateChallenge) => {
  return http.post('/challenge/create', data);
};