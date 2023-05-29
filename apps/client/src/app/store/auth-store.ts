import { create } from 'zustand';

export interface LoginStore {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;

  getAccessToken: () => {
    accessToken: string | null;
  };
}

export const useLoginStore = create<LoginStore>((set, get) => ({
  accessToken: null,

  setAccessToken: (accessToken) => {
    set({ accessToken });
  },

  getAccessToken: () => get().accessToken as any,
}));
