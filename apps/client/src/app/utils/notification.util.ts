import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { NOTIFICATION_TYPES } from '../common/constants';
import { RootStackParamList } from '../navigation/navigation.type';
import { NavigationContainerRef } from '@react-navigation/native';
import { INotificationPayload } from '../types/notification';

export const registerForPushNotificationsAsync = async () => {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      // TO DO: handle when user doesn't grant permission
      alert('Failed to get push token for push notification!');
      return;
    }

    // This token is used to send notifications to the device through Expo Notification Service.
    token = (await Notifications.getExpoPushTokenAsync()).data;
    // TO DO: send the token to the server to save it for later use

    // This token is used to send notifications to the device directly through APNS or FCM
    // token = (await Notifications.getDevicePushTokenAsync()).data;
    console.log('Expo Push Token: ', token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
};

export const handleNewNotification = async (notificationObject: any) => {
  try {
    const newNotification = {
      id: notificationObject.messageId,
      date: notificationObject.sentTime,
      title: notificationObject.data.title,
      body: notificationObject.data.message,
      data: JSON.parse(notificationObject.data.body),
    };
    // add the code to do what you need with the received notification  and, e.g., set badge number on app icon
    console.log(newNotification);
    await Notifications.setBadgeCountAsync(1);
  } catch (error) {
    console.error(error);
  }
};

export const handleUserTapOnNotification = async (
  notificationResponse: Notifications.NotificationResponse,
  navigation: NavigationContainerRef<RootStackParamList>
) => {
  const { notification } = notificationResponse;
  const payload = notification.request.content.data as INotificationPayload;

  switch (payload.notification_type) {
    case NOTIFICATION_TYPES.NEW_CHALLENGE_FROM_FOLLOWING:
      if (payload.post_id)
        // ProgressCommentScreen is a screen inside a nested stack navigator
        navigation.navigate('ProgressCommentScreen', {
          progressId: payload.post_id,
        });
      break;
    case NOTIFICATION_TYPES.NEW_COMMENT:
      if (payload.post_id)
        // ProgressCommentScreen is a screen inside a nested stack navigator
        navigation.navigate('ProgressCommentScreen', {
          progressId: payload.post_id,
        });
      break;
    case NOTIFICATION_TYPES.NEW_MENTION:
      if (payload.post_id)
        // ProgressCommentScreen is a screen inside a nested stack navigator
        navigation.navigate('ProgressCommentScreen', {
          progressId: payload.post_id,
        });
      break;
    case NOTIFICATION_TYPES.NEW_FOLLOWER:
      if (payload.new_follower_id)
        // ProgressCommentScreen is a screen inside a nested stack navigator
        navigation.navigate('OtherUserProfileScreen', {
          userId: payload.new_follower_id,
          isFollower: true,
        });
      break;
  }
};