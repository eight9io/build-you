import {
  NOTIFICATION_TOKEN_DEVICE_TYPE,
  NOTIFICATION_TOKEN_STATUS,
  NOTIFICATION_TYPES,
} from "../common/enum";
import { IChallenge, IProgressChallenge } from "./challenge";
import { IUserData } from "./user";

export interface INotificationPayload {
  // Interface for the data that is sent from the FCM or APN
  notificationType: string;
  progressId?: string;
  followerId?: string;
  challengeId?: string;
  commentUserId?: string;
  companyId?: string;
  coachId?: string;
}

export interface INotification {
  id: string;
  user: Pick<IUserData, "id" | "name" | "avatar">;
  isRead: boolean;
  progressId?: string;
  challengeId?: string;
  type: NOTIFICATION_TYPES;
  createdAt: Date;
  challengeGoal?: string;
  challengeCoachId?: string;
}

export interface IPushNotificationToken {
  notificationToken: string;
  status: NOTIFICATION_TOKEN_STATUS;
  deviceType: NOTIFICATION_TOKEN_DEVICE_TYPE;
}

export interface INotificationResponse {
  // Raw payload response from API
  id: string;
  user: Pick<IUserData, "id" | "name" | "surname" | "avatar">;
  title: NOTIFICATION_TYPES;
  body: string;
  createdAt: Date;
  createdBy: string;
  isRead: boolean;
  challenge?: Pick<IChallenge, "id" | "goal"> & {
    owner?: Pick<IUserData, "id">;
    coach?: Pick<IUserData, "id">;
  };
  progress?: Pick<IProgressChallenge, "id">;
}
