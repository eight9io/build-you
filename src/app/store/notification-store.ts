import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { clearAllNotifications } from "../utils/notification.util";

export interface NotificationStore {
  listenerIsReady: boolean;
  numOfNewNotifications: number;
  newestNotificationId: string | null;
  increaseNumOfNewNotifications: (value?: number) => void; // default increase by 1
  refreshNumOfNewNotifications: () => void;
  setListenerIsReady: (value: boolean) => void;
  getNumOfNewNotifcations: () => number;
  setNewestNotificationId: (id: string) => void;
  getNewestNotificationId: () => string | null;
}

// Use persist to store data in local storage
// Zustand will handle the data sync between local storage and in-app state
export const useNotificationStore = create<NotificationStore>((set, get) => ({
  listenerIsReady: false,
  numOfNewNotifications: 0,
  newestNotificationId: null,
  increaseNumOfNewNotifications: async (value = 1) => {
    if (value <= 0) return;
    set((state) => ({
      numOfNewNotifications: state.numOfNewNotifications + value,
    }));
  },
  refreshNumOfNewNotifications: async () => {
    set({ numOfNewNotifications: 0 });
    await clearAllNotifications();
  },
  setListenerIsReady: (value: boolean) => set({ listenerIsReady: value }),
  getNumOfNewNotifcations: () => get().numOfNewNotifications,
  setNewestNotificationId: (id: string) => set({ newestNotificationId: id }),
  getNewestNotificationId: () => get().newestNotificationId,
}));
