import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { updateNotificationToken } from '../service/notification';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NOTIFICATION_TOKEN_DEVICE_TYPE,
  NOTIFICATION_TOKEN_STATUS,
} from '../common/enum';

export interface NotificationStore {
  pushToken?: string;
  hasNewNotification: boolean;

  setPushToken: (value: string) => Promise<void>;
  getPushToken: () => string | undefined;
  revokePushToken: () => Promise<void>;
  setHasNewNotification: (value: boolean) => void;
  getHasNewNotification: () => boolean;
}

// Use persist to store data in local storage
// Zustand will handle the data sync between local storage and in-app state
export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      pushToken: undefined,
      hasNewNotification: false,
      setPushToken: async (value) => {
        set({ pushToken: value });
        // update notification token to server
        const res = await updateNotificationToken({
          notificationToken: value,
          status: NOTIFICATION_TOKEN_STATUS.ACTIVE,
          deviceType:
            Platform.OS === 'android'
              ? NOTIFICATION_TOKEN_DEVICE_TYPE.ANDROID
              : NOTIFICATION_TOKEN_DEVICE_TYPE.IOS,
        });
      },
      getPushToken: () => get().pushToken,
      revokePushToken: async () => {
        const { pushToken } = get();
        if (!pushToken) return;
        // Revoke notification token
        const res = await updateNotificationToken({
          notificationToken: pushToken,
          status: NOTIFICATION_TOKEN_STATUS.INACTIVE,
          deviceType:
            Platform.OS === 'android'
              ? NOTIFICATION_TOKEN_DEVICE_TYPE.ANDROID
              : NOTIFICATION_TOKEN_DEVICE_TYPE.IOS,
        });
        set({ pushToken: undefined });
      },
      setHasNewNotification: (value) => {
        set({ hasNewNotification: value });
      },
      getHasNewNotification: () => get().hasNewNotification,
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage to store data
    }
  )
);