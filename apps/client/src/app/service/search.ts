import { AxiosResponse } from 'axios';
import httpInstance from '../utils/http';

export const servieGetUserOnSearch = async (searchKey: string) => {
  const response: AxiosResponse = await httpInstance.get(
    `user/search/${searchKey}`
  );
  return response.data;
};
