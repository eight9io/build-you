import { AxiosResponse } from "axios";
import * as Device from "expo-device";
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { persist, createJSONStorage } from "zustand/middleware";
import messaging from "@react-native-firebase/messaging";

import { ILoginResponse, ISocialLoginForm, LoginForm } from "../types/auth";
import {
  appleLogin,
  googleLogin,
  linkedInLogin,
  serviceLogin,
} from "../service/auth";
import {
  registerForPushNotificationsAsync,
  unregisterForPushNotificationsAsync,
} from "../utils/notification.util";
import { setAuthTokenToHttpHeader } from "../utils/refreshToken.util";
import {
  NOTIFICATION_TOKEN_DEVICE_TYPE,
  NOTIFICATION_TOKEN_STATUS,
  LOGIN_TYPE,
} from "../common/enum";
import {
  updateNotificationToken,
  deletePushNotificatoinToken,
} from "../service/notification";
import { useNotificationStore } from "./notification-store";
import httpInstance from "../utils/http";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

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
          set(args);
          return;
        }
        registerForPushNotificationsAsync()
          .then((token) => {
            updateNotificationToken({
              notificationToken: token,
              status: NOTIFICATION_TOKEN_STATUS.ACTIVE,
              deviceType:
                Platform.OS === "android"
                  ? NOTIFICATION_TOKEN_DEVICE_TYPE.ANDROID
                  : NOTIFICATION_TOKEN_DEVICE_TYPE.IOS,
            });
          })
          .catch((e) => {
            console.log("Ignore Push Notification", e);
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

      asyncLogin: async (
        loginForm: ISocialLoginForm | LoginForm,
        type: LOGIN_TYPE
      ) => {
        let res = null;
        let payload = null;
        if (type === LOGIN_TYPE.EMAIL_PASSWORD) {
          payload = loginForm as LoginForm;
        } else {
          payload = loginForm as ISocialLoginForm;
        }

        try {
          switch (type) {
            case LOGIN_TYPE.GOOGLE:
              res = await googleLogin(payload.token);
              break;
            case LOGIN_TYPE.LINKEDIN:
              res = await linkedInLogin(payload.token);
              break;
            case LOGIN_TYPE.APPLE:
              res = await appleLogin(payload);
              break;
            case LOGIN_TYPE.EMAIL_PASSWORD:
              res = await serviceLogin(payload);
              break;
          }
        } catch (error) {
          throw error;
        }
        setAuthTokenToHttpHeader(res.data.authorization);
        set({
          accessToken: res.data.authorization,
          refreshToken: res.data.refresh,
        });
        // setTimeout(
        //   () =>

        //   300
        // ); // Timeout used to wait for loading modal to close before navigate
        return res;
      },

      logout: async () => {
        set({
          accessToken: null,
          refreshToken: null,
        });
        if (Device.isDevice) {
          const messagingToken = await messaging().getToken();
          await deletePushNotificatoinToken(messagingToken);
          useNotificationStore.getState().setListenerIsReady(false);
        }
        delete httpInstance.defaults.headers.common["Authorization"];
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
