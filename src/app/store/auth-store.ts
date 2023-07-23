import { create } from "zustand";
import { setAuthTokenToHttpHeader } from "../utils/http";

export interface LoginStore {
  accessToken: string | null;
  refreshToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}

export const useAuthStore = create<LoginStore>((set, get) => ({
  accessToken: null,
  refreshToken: null,

  setAccessToken: (accessToken) => {
    set({ accessToken });
    setAuthTokenToHttpHeader(accessToken);
  },

  setRefreshToken: (refreshToken) => {
    set({ refreshToken });
  },

  getRefreshToken: () => get().refreshToken as any,

  getAccessToken: () => get().accessToken as any,
}));
