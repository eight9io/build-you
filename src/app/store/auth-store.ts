import { AxiosResponse } from "axios";
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist, createJSONStorage } from "zustand/middleware";
import { ILoginResponse, LoginForm } from "../types/auth";
import { serviceLogin } from "../service/auth";
// import { registerForPushNotificationsAsync } from "../utils/notification.util";
import { useUserProfileStore } from "./user-store";
import { setAuthTokenToHttpHeader } from "../utils/http";

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
    (args) => {
      // console.log("  applying", args);
      set(args);
      // console.log("  new state", get());
    },
    get,
    api
  );

export const useAuthStore = create<LoginStore>()(
  persist(
    (set, get) => ({
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
        const { onAuthStoreRehydrated } = useUserProfileStore.getState();
        await onAuthStoreRehydrated();

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
    }),
    {
      name: "auth-storage-1",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated();
      },
    }
  )
);
