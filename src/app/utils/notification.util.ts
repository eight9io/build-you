import * as Device from "expo-device";
import notifee, {
  AuthorizationStatus,
  Event,
  EventType,
  Notification,
} from "@notifee/react-native";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NavigationContainerRef } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/navigation.type";
import {
  INotification,
  INotificationPayload,
  INotificationResponse,
} from "../types/notification";
import { NOTIFICATION_TYPES, SORT_ORDER } from "../common/enum";
import { UseBoundStore, StoreApi } from "zustand";
import { NotificationStore } from "../store/notification-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const registerForPushNotificationsAsync = async () => {
  if (!Device.isDevice) {
    console.log("Must use physical device for Push Notifications");
    throw new Error("simulator");
  }

  const settings = await notifee.requestPermission();
  if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
    await messaging().registerDeviceForRemoteMessages();
    // Get the device push token
    const token = await messaging().getToken();
    console.log(token);

    return token;
  } else {
    // Ignore when user doesn't grant permission
    // return;
    throw new Error("user do not grant permission");
  }
};

export const unregisterForPushNotificationsAsync = async () => {
  if (!Device.isDevice) {
    console.log("Must use physical device for Push Notifications");
    throw new Error("simulator");
  }
  const token = await messaging().getToken();
  await messaging().unregisterDeviceForRemoteMessages();
  return token;
};

export const addNotificationListener = (
  navigation: NavigationContainerRef<RootStackParamList>,
  useNotificationStore: UseBoundStore<StoreApi<NotificationStore>>
) => {
  // const onMessageReceived = (message: FirebaseMessagingTypes.RemoteMessage) => {
  //   if (message.notification)
  //     // Display notification on foreground
  //     notifee.displayNotification({
  //       title: message.notification.title,
  //       body: message.notification.body,
  //       data: message.data,
  //     });

  //   useNotificationStore.getState().increaseNumOfNewNotifications();
  // };

  // // Listen to messages from FCM
  // messaging().onMessage(onMessageReceived);

  // Listen to foreground events
  const unsubscribe = notifee.onForegroundEvent(async (event: Event) => {
    useNotificationStore.getState().increaseNumOfNewNotifications();
    switch (event.type) {
      case EventType.PRESS: // User pressed on the notification
        if (event.detail.notification) {
          await handleTapOnIncomingNotification(
            event.detail.notification,
            navigation
          );
          if (event.detail.notification.id)
            // Clear the notification from the notification tray and decrement the badge count
            await clearNotification(event.detail.notification.id);
          useNotificationStore.getState().refreshNumOfNewNotifications(); // reset the new notification flag
        }
        break;
    }
  });

  return unsubscribe;
};

export const handleTapOnIncomingNotification = async (
  notification: Notification,
  navigation: NavigationContainerRef<RootStackParamList>
) => {
  const payload = notification.data as Record<
    string,
    any
  > as INotificationPayload;

  switch (payload.notificationType) {
    case NOTIFICATION_TYPES.CHALLENGE_CREATED:
      if (payload.progressId && payload.challengeId)
        navigation.navigate("ProgressCommentScreen", {
          progressId: payload.progressId,
          challengeId: payload.challengeId,
        });
      break;
    case NOTIFICATION_TYPES.PROGRESS_CREATED:
      if (payload.progressId && payload.challengeId)
        navigation.navigate("ProgressCommentScreen", {
          progressId: payload.progressId,
          challengeId: payload.challengeId,
        });
      break;
    case NOTIFICATION_TYPES.NEW_COMMENT:
      if (payload.progressId && payload.challengeId)
        navigation.navigate("ProgressCommentScreen", {
          progressId: payload.progressId,
          challengeId: payload.challengeId,
        });
      break;
    case NOTIFICATION_TYPES.NEW_MENTION:
      if (payload.progressId && payload.challengeId)
        navigation.navigate("ProgressCommentScreen", {
          progressId: payload.progressId,
          challengeId: payload.challengeId,
        });
      break;
    case NOTIFICATION_TYPES.NEW_FOLLOWER:
      if (payload.followerId) {
        navigation.navigate("OtherUserProfileScreen", {
          userId: payload.followerId,
          isFollower: true,
        });
      }
      break;
  }
};

export const handleTapOnNotification = async (
  notification: any,
  navigation: NativeStackNavigationProp<RootStackParamList>,
  setNotificationIsRead: any
) => {
  const handleNavigation = async (
    screen: string,
    notification: INotification
  ) => {
    try {
      switch (screen) {
        case "ProgressCommentScreen":
          if (notification.progressId && notification.challengeId)
            navigation.navigate("ProgressCommentScreen", {
              progressId: notification.progressId,
              challengeId: notification.challengeId,
            });
          break;
        case "OtherUserProfileScreen":
          if (notification.user.id)
            navigation.navigate("OtherUserProfileScreen", {
              userId: notification.user.id,
              isFollower: true,
            });
          break;
      }
      if (!notification.isRead) {
        await setNotificationIsRead([notification.id.toString()]);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  switch (notification.type) {
    case NOTIFICATION_TYPES.CHALLENGE_CREATED:
      handleNavigation("ProgressCommentScreen", notification);
      break;
    case NOTIFICATION_TYPES.PROGRESS_CREATED:
      handleNavigation("ProgressCommentScreen", notification);
      break;
    case NOTIFICATION_TYPES.NEW_COMMENT:
      handleNavigation("ProgressCommentScreen", notification);
      break;
    case NOTIFICATION_TYPES.NEW_MENTION:
      handleNavigation("ProgressCommentScreen", notification);
      break;
    case NOTIFICATION_TYPES.NEW_FOLLOWER:
      handleNavigation("OtherUserProfileScreen", notification);
      break;
  }
};

export const getNotificationContent = (
  notificationType: NOTIFICATION_TYPES,
  contentPayload?: any
) => {
  switch (notificationType) {
    case NOTIFICATION_TYPES.CHALLENGE_CREATED:
      return `has added a new progress in ${
        contentPayload?.challengeGoal || "a challenge"
      }`;
    case NOTIFICATION_TYPES.PROGRESS_CREATED:
      return `has added a new progress in ${
        contentPayload?.challengeGoal || "a challenge"
      }`;
    case NOTIFICATION_TYPES.NEW_COMMENT:
      return `commented on your update`;
    case NOTIFICATION_TYPES.NEW_MENTION:
      return `mentioned you in a comment`;
    case NOTIFICATION_TYPES.NEW_FOLLOWER:
      return `has started following you`;
  }
};

export const clearAllNotifications = async () => {
  // Dismiss all notification trays and reset badge count
  await notifee.cancelAllNotifications();
  await notifee.setBadgeCount(0);
};

export const clearNotification = async (notificationId: string) => {
  await notifee.decrementBadgeCount();
  await notifee.cancelNotification(notificationId);
};

export const mapNotificationResponses = (
  responses: INotificationResponse[]
): INotification[] => {
  const transformedData: INotification[] = responses.map((response) => {
    // const extractUserInfoRegex = /@\[([^\(]+)\(([^)]+)\)/;
    // const match = response.body.match(extractUserInfoRegex);
    // let username = '';
    // let userId = '';
    // if (match) {
    //   username = match[1];
    //   userId = match[2];
    // } else {
    //   console.log('No match found');
    //   throw new Error('Something went wrong');
    // }
    return {
      id: response.id,
      type: response.title,
      user: {
        id: response.user.id,
        name: `${response.user.name} ${response.user.surname}`,
        avatar: response.user.avatar,
      },
      createdAt: response.createdAt,
      isRead: response.isRead,
      challengeId: response.challenge?.id,
      challengeGoal: response.challenge?.goal,
      progressId: response.progress?.id,
    };
  });

  return sortNotificationsByDate(transformedData, SORT_ORDER.DESC);
};

export const sortNotificationsByDate = (
  notifications: INotification[],
  order: SORT_ORDER
) => {
  if (order === SORT_ORDER.ASC)
    return notifications.sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  return notifications.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

export const getLastNotiIdFromLocalStorage = async () => {
  const data = await AsyncStorage.getItem("lastNotiId");
  return data;
};

export const setLastNotiIdToLocalStorage = async (lastNotiId: string) => {
  if (!lastNotiId) return;
  await AsyncStorage.setItem("lastNotiId", lastNotiId);
};
