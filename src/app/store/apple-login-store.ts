import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AppleLoginInfoStore {
  userAppleInfo: {
    email: string | null;
    sub: string | null;
    fullName?: string | null;
  };
  _hasHydrated: boolean;

  setUserAppleInfo: (userAppleInfor: {
    email: string | null;
    sub: string | null;
    fullName?: string | null;
  }) => void;
  getUserAppleInfo: () => {
    email: string | null;
    sub: string | null;
    fullName?: string | null;
  };
  setHasHydrated: () => void;
  getHasHydrated: () => boolean;
}

export const useAppleLoginInfoStore = create<AppleLoginInfoStore>()(
  persist(
    (set, get) => ({
      userAppleInfo: {
        email: null,
        sub: null,
        fullName: null,
      },
      _hasHydrated: false,
      setUserAppleInfo: (userAppleInfo) => {
        set({ userAppleInfo });
      },
      setHasHydrated: () => {
        set({ _hasHydrated: true });
      },
      getUserAppleInfo: () => {
        return get().userAppleInfo;
      },
      getHasHydrated: () => {
        return get()._hasHydrated;
      },
    }),
    {
      name: "appleLoginInfo",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated();
      },
    }
  )
);
