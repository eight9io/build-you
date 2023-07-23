import httpInstance from "../utils/http";
import { INotification, IPushNotificationToken } from "../types/notification";
import { mapNotificationResponses } from "../utils/notification.util";

export const updateNotificationToken = async (
  payload: IPushNotificationToken
) => {
  return httpInstance.post(
    `notification/push/${payload.notificationToken}`,
    payload
  );
};

export const getNotifications = async (): Promise<INotification[]> => {
  const res = await httpInstance.get("/notification/all");
  return mapNotificationResponses(res.data);
};

export const setNotificationIsRead = (notificationIds: string[]) => {
  return httpInstance.put("/notification/isRead", {
    id: notificationIds,
  });
};
