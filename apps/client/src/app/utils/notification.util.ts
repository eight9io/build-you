import * as Device from 'expo-device';
import notifee, {
  AndroidImportance,
  AndroidVisibility,
  AuthorizationStatus,
  EventType,
  Notification,
} from '@notifee/react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationContainerRef, StackActions } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/navigation.type';
import {
  INotification,
  INotificationPayload,
  INotificationResponse,
} from '../types/notification';
import { NOTIFICATION_TYPES, SORT_ORDER } from '../common/enum';
import { setNotificationIsRead } from '../service/notification';
import { useNotificationStore } from '../store/notification';

export const registerForPushNotificationsAsync = async (
  setPushToken: (value: string) => Promise<void>
) => {
  let token;
  if (Device.isDevice) {
    const settings = await notifee.requestPermission();
    // Create a channel (required for Android)
    // const channelId = await notifee.createChannel({
    //   id: 'default',
    //   name: 'Default Channel',
    //   importance: AndroidImportance.HIGH,
    // });
    if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
      // Register the device with FCM
      await messaging().registerDeviceForRemoteMessages();

      // Get the device push token
      token = await messaging().getToken();
      console.log('push token: ', token);

      if (token) {
        await setPushToken(token);
      }
    } else {
      // Ignore when user doesn't grant permission
      return;
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
};

export const addNotificationListener = async (
  navigation: NavigationContainerRef<RootStackParamList>
) => {
  const onMessageReceived = async (
    message: FirebaseMessagingTypes.RemoteMessage
    ) => {
    console.log('message: ', message);
    if (message.notification)
      // Display notification on foreground
      await notifee.displayNotification({
        title: message.notification.title,
        body: message.notification.body,
        data: message.data
      });
    await notifee.incrementBadgeCount();
    useNotificationStore.getState().setHasNewNotification(true);
  };

  // Listen to messages from FCM
  messaging().onMessage(onMessageReceived);
  messaging().setBackgroundMessageHandler(onMessageReceived);

  // Listen to foreground events
  notifee.onForegroundEvent(async ({ type, detail }) => {
    console.log('detail: ', detail);
    switch (type) {
      case EventType.PRESS: // User pressed on the notification
        if (detail.notification) {
          await handleTapOnIncomingNotification(
            detail.notification,
            navigation
          );
          if (detail.notification.id)
            // Clear the notification from the notification tray and decrement the badge count
            await clearNotification(detail.notification.id);
          useNotificationStore.getState().setHasNewNotification(false); // reset the new notification flag
        }
        break;
    }
  });
};

export const notificationPermissionIsAllowed = async (): Promise<boolean> => {
  if (Device.isDevice) {
    const settings = await notifee.requestPermission();
    return settings.authorizationStatus === AuthorizationStatus.AUTHORIZED;
  } else throw new Error('Must use physical device for Push Notifications');
};

export const handleTapOnIncomingNotification = async (
  notification: Notification,
  navigation: NavigationContainerRef<RootStackParamList>
) => {
  const payload = notification.data as Record<
  string,
  any
  > as INotificationPayload;
  
  switch (payload.notification_type) {
    case NOTIFICATION_TYPES.NEW_PROGRESS_FROM_FOLLOWING:
      if (payload.post_id && payload.challenge_id)
        navigation.navigate('ProgressCommentScreen', {
          progressId: payload.post_id,
          challengeId: payload.challenge_id,
        });
      break;
    case NOTIFICATION_TYPES.NEW_COMMENT:
      if (payload.post_id && payload.challenge_id)
        navigation.navigate('ProgressCommentScreen', {
          progressId: payload.post_id,
          challengeId: payload.challenge_id,
        });
      break;
    case NOTIFICATION_TYPES.NEW_MENTION:
      if (payload.post_id && payload.challenge_id)
        navigation.navigate('ProgressCommentScreen', {
          progressId: payload.post_id,
          challengeId: payload.challenge_id,
        });
      break;
    case NOTIFICATION_TYPES.NEW_FOLLOWER:
      if (payload.new_follower_id)
      {
        navigation.navigate('OtherUserProfileScreen', {
          userId: payload.new_follower_id,
          isFollower: true,
        });
        }
      break;
  }
};

export const handleTapOnNotification = async (
  notification: INotification,
  navigation: NativeStackNavigationProp<RootStackParamList>
  ) => {
  console.log('notification: ', notification);
  const handleNavigation = async (
    screen: string,
    notification: INotification
    ) => {
    try {
      switch (screen) {
        case 'ProgressCommentScreen':
          if (notification.progressId && notification.challengeId)
            navigation.navigate('ProgressCommentScreen', {
              progressId: notification.progressId,
              challengeId: notification.challengeId,
            });
          break;
        case 'OtherUserProfileScreen':
          if (notification.user.id)
            navigation.navigate('OtherUserProfileScreen', {
              userId: notification.user.id,
              isFollower: true,
            });
          break;
      }
      if (!notification.isRead) {
        await setNotificationIsRead([notification.id.toString()]);
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  console.log('notification: ', notification);
  switch (notification.type) {
    case NOTIFICATION_TYPES.NEW_PROGRESS_FROM_FOLLOWING:
      handleNavigation('ProgressCommentScreen', notification);
      break;
    case NOTIFICATION_TYPES.NEW_COMMENT:
      handleNavigation('ProgressCommentScreen', notification);
      break;
    case NOTIFICATION_TYPES.NEW_MENTION:
      handleNavigation('ProgressCommentScreen', notification);
      break;
    case NOTIFICATION_TYPES.NEW_FOLLOWER:
      handleNavigation('OtherUserProfileScreen', notification);
      break;
  }
};

export const getNotificationContent = (
  notificationType: NOTIFICATION_TYPES,
  contentPayload?: any
) => {
  switch (notificationType) {
    case NOTIFICATION_TYPES.NEW_PROGRESS_FROM_FOLLOWING:
      return `has added a new progress in ${
        contentPayload?.challengeName || 'a challenge'
      }`;
      break;
    case NOTIFICATION_TYPES.NEW_COMMENT:
      return `commented on your update`;
      break;
    case NOTIFICATION_TYPES.NEW_MENTION:
      return `mentioned you in a comment`;
      break;
    case NOTIFICATION_TYPES.NEW_FOLLOWER:
      return `has started following you`;
      break;
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
  const transformedData = responses.map((response) => {
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
        avatar: 'https://picsum.photos/200',
      },
      createdAt: response.createdAt,
      isRead: response.isRead,
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
