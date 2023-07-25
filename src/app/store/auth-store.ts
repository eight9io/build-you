import { AxiosResponse } from "axios";
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { persist, createJSONStorage } from "zustand/middleware";
import { ILoginResponse, ISocialLoginForm, LoginForm } from "../types/auth";
import { appleLogin, googleLogin, linkedInLogin, serviceLogin } from "../service/auth";
import {
  addNotificationListener,
  registerForPushNotificationsAsync,
  unregisterForPushNotificationsAsync,
} from "../utils/notification.util";
import { setAuthTokenToHttpHeader } from "../utils/refreshToken.util";
import {
  NOTIFICATION_TOKEN_DEVICE_TYPE,
  NOTIFICATION_TOKEN_STATUS,
  LOGIN_TYPE,
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

  asyncLogin: (
    loginForm: LoginForm | ISocialLoginForm,
    type: LOGIN_TYPE
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

      asyncLogin: async (loginForm: ISocialLoginForm | LoginForm, type: LOGIN_TYPE) => {
        let res = null;
        let payload = null;
        if (type === LOGIN_TYPE.EMAIL_PASSWORD) {
          payload = loginForm as LoginForm;
        } else {
          payload = loginForm as ISocialLoginForm;
        }

        switch (type) {
          case LOGIN_TYPE.GOOGLE:
            res = await googleLogin(payload.token);
            break;
          case LOGIN_TYPE.LINKEDIN:
            res = await linkedInLogin(payload.token);
            break;
          case LOGIN_TYPE.APPLE:
            res = await appleLogin(payload.token);
            break;
          case LOGIN_TYPE.EMAIL_PASSWORD:
            res = await serviceLogin(payload);
            break;
        }
        setAuthTokenToHttpHeader(res.data.authorization);

        setTimeout(
          () =>
            set({
              accessToken: res.data.authorization,
              refreshToken: res.data.refresh,
            }),
          300
        ); // Timeout used to wait for loading modal to close before navigate
        return res;
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
