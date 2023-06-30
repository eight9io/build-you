import { AxiosResponse } from 'axios';
import * as Device from 'expo-device';
import httpInstance from '../utils/http';

export const serviceRegisterNotifiForDevice = async (deviceToken: string) => {
  const response: AxiosResponse = await httpInstance.post(
    `notification/push/${deviceToken}`
  );
  return response.data;
};
