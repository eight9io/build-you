import { AxiosResponse } from "axios";
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

  logout: (currentUserI?: string) => void;
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
        registerForPushNotificationsAsync(args.accessToken)
          .then((token) => {
            // const navigation = NavigationService.getContainer();
            // addNotificationListener(navigation, useNotificationStore);
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
        unregisterForPushNotificationsAsync(args.accessToken)
          .then((token) => {
            console.log("push token revoked", token);
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
          console.log("error: ", error);
          throw error;
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

      logout: async (currentUserId: string) => {
        if (currentUserId) {
          const messagingToken = await messaging().getToken({
            appName: "build-you",
            senderId: currentUserId,
          });
          await deletePushNotificatoinToken(messagingToken);
        }

        set({
          accessToken: null,
          refreshToken: null,
        });
        useNotificationStore.getState().setListenerIsReady(false);
        delete httpInstance.defaults.headers.common["Authorization"];

        const googleSignOut = async () => {
          try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
          } catch (error) {
            console.error(error);
          }
        };
        googleSignOut();
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
