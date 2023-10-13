import * as Device from "expo-device";
import notifee, {
  AuthorizationStatus,
  Event,
  EventType,
  Notification,
} from "@notifee/react-native";
import { Platform } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackActions } from "@react-navigation/native";
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
import NavigationService from "./navigationService";
import { serviceGetOtherUserData } from "../service/user";
import i18n from "../i18n/i18n";
import { useUserProfileStore } from "../store/user-store";

let MAX_RETRY_HANDLE_TAP_ON_INCOMING_NOTIFICATION_COUNT = 10;
let RETRY_DELAY = 1000; // milliseconds
export const registerForPushNotificationsAsync = async () => {
  if (Platform.OS === "ios" && !Device.isDevice) {
    console.log("Must use physical device for Push Notifications");
    throw new Error("simulator");
  }

  const settings = await notifee.requestPermission();
  if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
    try {
      await messaging().registerDeviceForRemoteMessages();
    } catch (e) {
      console.log(e);
    }

    const token = await messaging().getToken();

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
  await messaging().deleteToken();

  return token;
};

export const addNotificationListener = (
  useNotificationStore: UseBoundStore<StoreApi<NotificationStore>>
) => {
  // Listen to foreground events
  const unsubscribe = notifee.onForegroundEvent(async (event: Event) => {
    useNotificationStore.getState().increaseNumOfNewNotifications();
    switch (event.type) {
      case EventType.PRESS: // User pressed on the notification
        if (event.detail.notification) {
          await handleTapOnIncomingNotification(
            event.detail.notification,
            useNotificationStore
          );
          if (event.detail.notification.id)
            // Clear the notification from the notification tray and decrement the badge count
            await clearNotification(event.detail.notification.id);
          useNotificationStore.getState().refreshNumOfNewNotifications(); // reset the new notification flag
        }
        break;
      case EventType.DELIVERED:
        // If the app is in foreground and the user is in chat tab => cancel the delivered notification
        const shouldDisplayNewMessageNotification =
          useNotificationStore.getState().shouldDisplayNewMessageNotification;
        if (
          event.detail.notification.data.notificationType ===
            NOTIFICATION_TYPES.NEW_MESSAGE &&
          !shouldDisplayNewMessageNotification
        ) {
          await notifee.cancelNotification(event.detail.notification.id);
        }
        break;
    }
  });
  return unsubscribe;
};

export const handleTapOnIncomingNotification = async (
  notification: Notification,
  useNotificationStore: UseBoundStore<StoreApi<NotificationStore>>
) => {
  const navigation = NavigationService.getContainer();

  // When the app is launched by tapping on the notification from killed state => notification event will be triggered before navigation is ready
  // => Keep calling handleTapOnIncomingNotification until navigation is ready
  // When the app is launched from killed state => the current route is IntroScreen (cannot navigate to other screens) => wait until the app done checking the user's authentication state
  if (
    !navigation ||
    (navigation && navigation.getCurrentRoute().name === "IntroScreen")
  ) {
    if (MAX_RETRY_HANDLE_TAP_ON_INCOMING_NOTIFICATION_COUNT === 0) {
      MAX_RETRY_HANDLE_TAP_ON_INCOMING_NOTIFICATION_COUNT = 10; // Reset the retry count
      return; // Stop retrying
    }
    MAX_RETRY_HANDLE_TAP_ON_INCOMING_NOTIFICATION_COUNT--;
    return setTimeout(
      () => handleTapOnIncomingNotification(notification, useNotificationStore),
      RETRY_DELAY
    ); // retry after a delay (prevent stack overflow)
  } else {
    const payload = notification.data as Record<
      string,
      any
    > as INotificationPayload;

    switch (payload.notificationType) {
      case NOTIFICATION_TYPES.CHALLENGE_CREATED:
        if (payload.commentUserId && payload.challengeId) {
          try {
            const userCreateChallengeId = payload.commentUserId;
            const userCreateChallengeData = await serviceGetOtherUserData(
              userCreateChallengeId
            );
            const pushAction = StackActions.push(
              "OtherUserProfileChallengeDetailsScreen",
              {
                challengeId: payload.challengeId,
                isCompany: userCreateChallengeData.data.companyAccount,
              }
            );
            navigation.dispatch(pushAction);
          } catch (error) {
            console.log("error: ", error);
          }
        }
        break;
      case NOTIFICATION_TYPES.PROGRESS_CREATED:
        if (payload.progressId && payload.challengeId) {
          // navigation.navigate("ProgressCommentScreen", {
          //   progressId: payload.progressId,
          //   challengeId: payload.challengeId,
          // });
          const pushAction = StackActions.push("ProgressCommentScreen", {
            progressId: payload.progressId,
            challengeId: payload.challengeId,
          });
          navigation.dispatch(pushAction);
        }
        break;
      case NOTIFICATION_TYPES.NEW_COMMENT:
        if (payload.progressId && payload.challengeId) {
          // navigation.navigate("ProgressCommentScreen", {
          //   progressId: payload.progressId,
          //   challengeId: payload.challengeId,
          // });
          const currentRouteParams = navigation.getCurrentRoute().params as {
            progressId: string;
            challengeId: string;
          };
          // If the current screen is ProgressCommentScreen and the progressId is the same as the incoming notification => do nothing
          if (
            currentRouteParams &&
            currentRouteParams.progressId === payload.progressId
          )
            return;
          const pushAction = StackActions.push("ProgressCommentScreen", {
            progressId: payload.progressId,
            challengeId: payload.challengeId,
          });
          navigation.dispatch(pushAction);
        }
        break;
      case NOTIFICATION_TYPES.NEW_MENTION:
        const currentRouteParams = navigation.getCurrentRoute().params as {
          progressId: string;
          challengeId: string;
        };
        // If the current screen is ProgressCommentScreen and the progressId is the same as the incoming notification => do nothing
        if (
          currentRouteParams &&
          currentRouteParams.progressId === payload.progressId
        )
          return;
        if (payload.progressId && payload.challengeId) {
          // navigation.navigate("ProgressCommentScreen", {
          //   progressId: payload.progressId,
          //   challengeId: payload.challengeId,
          // });
          const pushAction = StackActions.push("ProgressCommentScreen", {
            progressId: payload.progressId,
            challengeId: payload.challengeId,
          });
          navigation.dispatch(pushAction);
        }
        break;
      case NOTIFICATION_TYPES.NEW_FOLLOWER:
        if (payload.followerId) {
          // navigation.navigate("OtherUserProfileScreen", {
          //   userId: payload.followerId,
          //   isFollower: true,
          // });
          const pushAction = StackActions.push("OtherUserProfileScreen", {
            userId: payload.followerId,
            isFollower: true,
          });
          navigation.dispatch(pushAction);
        }
        break;
      case NOTIFICATION_TYPES.ADDEDASEMPLOYEE:
        if (payload.companyId) {
          // navigation.navigate("OtherUserProfileScreen", {
          //   userId: payload.companyId,
          // });
          const pushAction = StackActions.push("OtherUserProfileScreen", {
            userId: payload.companyId,
          });
          navigation.dispatch(pushAction);
        }
        break;
      case NOTIFICATION_TYPES.NEW_MESSAGE: {
        // TODO: Handle navigation with company account
        const currentRouteName = navigation.getCurrentRoute().name;
        const currentRouteParams = navigation.getCurrentRoute().params as {
          challengeId: string;
        };
        const shouldDisplayNewMessageNotification =
          useNotificationStore.getState().shouldDisplayNewMessageNotification;
        // If the current screen is PersonalChallengeDetailScreen or PersonalCoachChallengeDetailScreen
        // and the challengeId is the same as the incoming notification
        // => navigate to chat tab if the user is not in chat tab
        // => do nothing if the user is in chat tab
        if (
          currentRouteParams &&
          (currentRouteName === "PersonalChallengeDetailScreen" ||
            currentRouteName === "PersonalCoachChallengeDetailScreen") &&
          currentRouteParams.challengeId === payload.challengeId
        ) {
          if (shouldDisplayNewMessageNotification) {
            // user is not in chat tab
            // Trigger the navigation to chat tab
            navigation.setParams({
              hasNewMessage: true,
            });
          }
          return;
        }
        if (payload.challengeId && payload.coachId) {
          try {
            const { id: currentUserId } =
              useUserProfileStore.getState().userProfile;
            const pushAction = StackActions.push(
              payload.coachId === currentUserId
                ? "PersonalCoachChallengeDetailScreen"
                : "PersonalChallengeDetailScreen",
              {
                challengeId: payload.challengeId,
                hasNewMessage: true,
              }
            );
            navigation.dispatch(pushAction);
          } catch (error) {
            console.log("error: ", error);
          }
        }
        break;
      }
    }
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
        case "OtherUserProfileChallengeDetailsScreen":
          if (notification.challengeId)
            navigation.navigate("OtherUserProfileChallengeDetailsScreen", {
              challengeId: notification.challengeId,
            });
          break;
        case "PersonalCoachChallengeDetailScreen":
          if (notification.challengeId)
            navigation.navigate("PersonalCoachChallengeDetailScreen", {
              challengeId: notification.challengeId,
              hasNewMessage: true,
            });
          break;
        case "PersonalChallengeDetailScreen":
          if (notification.challengeId)
            navigation.navigate("PersonalChallengeDetailScreen", {
              challengeId: notification.challengeId,
              hasNewMessage: true,
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
      handleNavigation("OtherUserProfileChallengeDetailsScreen", notification);
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
    case NOTIFICATION_TYPES.ADDEDASEMPLOYEE:
      handleNavigation("OtherUserProfileScreen", notification);
      break;
    case NOTIFICATION_TYPES.NEW_MESSAGE:
      // TODO: Handle navigation with company account
      const { id: currentUserId } = useUserProfileStore.getState().userProfile;
      handleNavigation(
        currentUserId === notification.challengeCoachId
          ? "PersonalCoachChallengeDetailScreen"
          : "PersonalChallengeDetailScreen",
        notification
      );
      break;
  }
};

export const getNotificationContent = (
  notificationType: NOTIFICATION_TYPES,
  contentPayload?: any
) => {
  switch (notificationType) {
    case NOTIFICATION_TYPES.CHALLENGE_CREATED:
      return i18n.t("notification.new_challenge");
    case NOTIFICATION_TYPES.PROGRESS_CREATED:
      return i18n.t("notification.new_progress", {
        challengeGoal: contentPayload.challengeGoal,
      });
    case NOTIFICATION_TYPES.NEW_COMMENT:
      return i18n.t("notification.new_comment");
    case NOTIFICATION_TYPES.NEW_MENTION:
      return i18n.t("notification.new_mention");
    case NOTIFICATION_TYPES.NEW_FOLLOWER:
      return i18n.t("notification.new_follower");
    case NOTIFICATION_TYPES.ADDEDASEMPLOYEE:
      return i18n.t("notification.new_employee");
    case NOTIFICATION_TYPES.NEW_MESSAGE:
      return i18n.t("notification.new_message");
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
      challengeCoachId: response.challenge?.coach?.id,
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

export const handleAppOpenOnNotificationPressed = async (
  useNotificationStore: UseBoundStore<StoreApi<NotificationStore>>
) => {
  if (Platform.OS === "android") {
    const initialNotification = await messaging().getInitialNotification();
    if (initialNotification)
      handleTapOnIncomingNotification(
        initialNotification,
        useNotificationStore
      );
  }
};

export const displayNotificationOnForeground = async (
  message,
  useNotificationStore: UseBoundStore<StoreApi<NotificationStore>>
) => {
  const channelId = await notifee.createChannel({
    id: "default",
    name: "Default Channel",
  });

  // If the app is in foreground and the user is in chat tab => do not display the notification
  const shouldDisplayNewMessageNotification =
    useNotificationStore.getState().shouldDisplayNewMessageNotification;
  if (
    message.data.notificationType === NOTIFICATION_TYPES.NEW_MESSAGE &&
    !shouldDisplayNewMessageNotification
  )
    return;

  await notifee.displayNotification({
    title: message.notification.title,
    body: message.notification.body,
    data: message.data,
    android: {
      channelId, // Required for Android to display the notification
    },
  });
  await notifee.incrementBadgeCount();
};

export const setBadgeCount = (count: number) => {
  if (isNaN(count)) return;
  return notifee.setBadgeCount(count);
};

export const decrementBadgeCount = () => {
  return notifee.decrementBadgeCount();
};
