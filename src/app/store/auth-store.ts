import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist, createJSONStorage } from "zustand/middleware";

export interface LoginStore {
  accessToken: string | null;
  refreshToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}

export const useAuthStore = create<LoginStore>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,

      setAccessToken: (accessToken) => {
        set({ accessToken });
        // setAuthTokenToHttpHeader(accessToken);
      },

      setRefreshToken: (refreshToken) => {
        set({ refreshToken });
      },

      getRefreshToken: () => get().refreshToken,

      getAccessToken: () => get().accessToken,
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
