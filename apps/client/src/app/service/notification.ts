import httpInstance from '../utils/http';
import { IPushNotificationToken } from '../types/notification';

export const updateNotificationToken = async (
  payload: IPushNotificationToken
) => {
  return httpInstance.post(
    `notification/push/${payload.notificationToken}`,
    payload
  );
};
