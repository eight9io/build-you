import httpInstance from "../utils/http";
import { INotification, IPushNotificationToken } from "../types/notification";
import {
  decrementBadgeCount,
  mapNotificationResponses,
  setBadgeCount,
} from "../utils/notification.util";

export const updateNotificationToken = async (
  payload: IPushNotificationToken
) => {
  return await httpInstance.post(
    `notification/push/${payload.notificationToken}`,
    payload
  );
};

export const getNotifications = async (): Promise<INotification[]> => {
  const res = await httpInstance.get("/notification/all");

  const [badgeCountData, ...notificationData] = res.data;
  // Update the badge count based on the unread notifications
  setBadgeCount(badgeCountData.unread);

  return mapNotificationResponses(notificationData[0].notifications);
};

export const setNotificationIsRead = async (notificationIds: string[]) => {
  try {
    const res = await httpInstance.put("/notification/isRead", {
      id: notificationIds,
    });

    decrementBadgeCount();
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const deletePushNotificatoinToken = async (token: string) => {
  return await httpInstance.delete(`/notification/push/delete/${token}`);
};
