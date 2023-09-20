import httpInstance from "../utils/http";

export const serviceGetOtherUserData = (userId: string) => {
  return httpInstance.get(`/user/${userId}`);
};
