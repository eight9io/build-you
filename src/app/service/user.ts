import httpInstance from "../utils/http";

export const getChallengeByUserId = (userId: string) => {
  return httpInstance.get(`/challenge/${userId}`);
};
export const serviceGetOtherUserData = (userId: string) => {
  return httpInstance.get(`/user/${userId}`);
};
