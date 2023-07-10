import { NOTIFICATION_TOKEN_DEVICE_TYPE, NOTIFICATION_TOKEN_STATUS, NOTIFICATION_TYPES } from "../common/enum";
import { IUserData } from "./user";

export interface INotificationPayload { // Interface for the data that is sent from the FCM or APN
    notification_type: string;
    post_id?: string;
    new_follower_id?: string;
}

export interface INotification {
    id: string;
    user: Pick<IUserData, 'id' | 'name' | 'avatar'>;
    isRead: boolean;
    progressId?: string;
    newFollowerId?: string;
    type: NOTIFICATION_TYPES;
    createdAt: string;
    challengeName?: string
}

export interface IPushNotificationToken {
    notificationToken: string;
    status: NOTIFICATION_TOKEN_STATUS;
    deviceType: NOTIFICATION_TOKEN_DEVICE_TYPE;
}