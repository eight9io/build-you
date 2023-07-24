import { AxiosResponse } from "axios";
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { persist, createJSONStorage } from "zustand/middleware";
import { ILoginResponse, LoginForm } from "../types/auth";
import { serviceLogin } from "../service/auth";
import {
  addNotificationListener,
  registerForPushNotificationsAsync,
  unregisterForPushNotificationsAsync,
} from "../utils/notification.util";
import { setAuthTokenToHttpHeader } from "../utils/refreshToken.util";
import {
  NOTIFICATION_TOKEN_DEVICE_TYPE,
  NOTIFICATION_TOKEN_STATUS,
} from "../common/enum";
import { updateNotificationToken } from "../service/notification";
import { useNotificationStore } from "./notification-store";
import NavigationService from "../utils/navigationService";

export interface LoginStore {
  accessToken: string | null;
  refreshToken: string | null;
  _hasHydrated: boolean;

  setAccessToken: (accessToken: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  setHasHydrated: () => void;

  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;

  asyncLoginEmailPassword: (
    payload: LoginForm
  ) => Promise<AxiosResponse<ILoginResponse>>;

  logout: () => void;
}

const watchLogin = (config) => (set, get, api) =>
  config(
    (args: LoginStore) => {
      if (typeof args.accessToken === "string") {
        const oldState = get();
        if (typeof oldState.accessToken === "string") {
          return;
        }
        registerForPushNotificationsAsync()
          .then((token) => {
            const navigation = NavigationService.getContainer();
            addNotificationListener(navigation, useNotificationStore);
            updateNotificationToken({
              notificationToken: token,
              status: NOTIFICATION_TOKEN_STATUS.ACTIVE,
              deviceType:
                Platform.OS === "android"
                  ? NOTIFICATION_TOKEN_DEVICE_TYPE.ANDROID
                  : NOTIFICATION_TOKEN_DEVICE_TYPE.IOS,
            });
          })
          .catch(() => {
            console.log("Ignore Push Notification");
          });
      }
      if (args.accessToken === null) {
        unregisterForPushNotificationsAsync()
          .then((token) => {
            console.log(token);
            updateNotificationToken({
              notificationToken: token,
              status: NOTIFICATION_TOKEN_STATUS.INACTIVE,
              deviceType:
                Platform.OS === "android"
                  ? NOTIFICATION_TOKEN_DEVICE_TYPE.ANDROID
                  : NOTIFICATION_TOKEN_DEVICE_TYPE.IOS,
            });
          })
          .catch(() => {
            console.log("Ignore Push Notification");
          });
      }
      set(args);
    },
    get,
    api
  );

export const useAuthStore = create<LoginStore>()(
  persist(
    watchLogin((set, get) => ({
      accessToken: null,
      refreshToken: null,
      _hasHydrated: false,

      setAccessToken: (accessToken) => {
        set({ accessToken });
      },

      setRefreshToken: (refreshToken) => {
        set({ refreshToken });
      },

      getRefreshToken: () => get().refreshToken,

      getAccessToken: () => get().accessToken,

      asyncLoginEmailPassword: async (payload) => {
        const r = await serviceLogin(payload);
        setAuthTokenToHttpHeader(r.data.authorization);

        setTimeout(
          () =>
            set({
              accessToken: r.data.authorization,
              refreshToken: r.data.refresh,
            }),
          300
        ); // Timeout used to wait for loading modal to close before navigate
        return r;
      },

      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
        });
      },
      setHasHydrated: () => {
        set({
          _hasHydrated: true,
        });
      },
    })),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated();
      },
    }
  )
);
