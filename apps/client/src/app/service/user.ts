import httpInstance from '../utils/http';

export const getChallengeByUserId = (userId: string) => {
  return httpInstance.get(`/challenge/${userId}`);
};
