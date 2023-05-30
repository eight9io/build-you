import { create } from 'zustand';
import httpInstance, { setAuthToken } from '../utils/http';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LoginStore {
  accessToken: string | null;
  refreshToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}

const storeAuthToken = async (value: string) => {
  try {
    await AsyncStorage.setItem('@auth_token', value);
  } catch (e) {
    // saving error
    console.error(e);
  }
};

export const useAuthStore = create<LoginStore>((set, get) => ({
  accessToken: null,
  refreshToken: null,

  setAccessToken: (accessToken) => {
    set({ accessToken });
    setAuthToken(accessToken);
    storeAuthToken(accessToken as string);
  },
  setRefreshToken: (refreshToken) => {
    set({ refreshToken });
  },
  getRefreshToken: () => get().refreshToken,

  getAccessToken: () => get().accessToken as any,
}));
