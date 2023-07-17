import { create } from 'zustand';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { createJSONStorage, persist } from 'zustand/middleware';
import { updateNotificationToken } from '../service/notification';
import {
  NOTIFICATION_TOKEN_DEVICE_TYPE,
  NOTIFICATION_TOKEN_STATUS,
} from '../common/enum';
import { clearNotifications } from '../utils/notification.util';

export interface NotificationStore {
  pushToken?: string;
  hasNewNotification: boolean;
  _hasHydrated: boolean;

  setPushToken: (value: string) => Promise<void>;
  getPushToken: () => string | undefined;
  revokePushToken: () => Promise<void>;
  setHasNewNotification: (value: boolean) => void;
  getHasNewNotification: () => boolean;
  setHasHydrated: (value: boolean) => void;
}

// Use persist to store data in local storage
// Zustand will handle the data sync between local storage and in-app state
export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      pushToken: undefined,
      hasNewNotification: false,
      _hasHydrated: false,
      setPushToken: async (value) => {
        // update notification token to server
        const res = await updateNotificationToken({
          notificationToken: value,
          status: NOTIFICATION_TOKEN_STATUS.ACTIVE,
          deviceType:
            Platform.OS === 'android'
              ? NOTIFICATION_TOKEN_DEVICE_TYPE.ANDROID
              : NOTIFICATION_TOKEN_DEVICE_TYPE.IOS,
        });
        if (res.status === 200 || res.status === 201) set({ pushToken: value });
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
        if (res.status === 200 || res.status === 201)
          set({ pushToken: undefined });
      },
      setHasNewNotification: async (value) => {
        set({ hasNewNotification: value });
        if (!value) {
          // Dismiss all notification trays and reset badge count
          await clearNotifications();
        }
      },
      getHasNewNotification: () => get().hasNewNotification,
      setHasHydrated: (value: boolean) => {
        set({
          _hasHydrated: value,
        });
      },
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage to store data
      onRehydrateStorage: () => (state) => {
        console.log('state: ', state);
        state?.setHasHydrated(true);
      },
    }
  )
);