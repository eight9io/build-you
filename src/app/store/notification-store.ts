import { create } from "zustand";
import { clearAllNotifications } from "../utils/notification.util";

export interface NotificationStore {
  listenerIsReady: boolean;
  numOfNewNotifications: number;
  newestNotificationId: string | null;
  shouldDisplayNewMessageNotification: boolean; // Only display new message notification when user is not in chat screen
  increaseNumOfNewNotifications: (value?: number) => void; // default increase by 1
  refreshNumOfNewNotifications: () => void;
  setListenerIsReady: (value: boolean) => void;
  getNumOfNewNotifcations: () => number;
  setNewestNotificationId: (id: string) => void;
  getNewestNotificationId: () => string | null;
  getShouldDisplayNewMessageNotification: () => boolean;
  setShouldDisplayNewMessageNotification: (value: boolean) => void;
}

// Use persist to store data in local storage
// Zustand will handle the data sync between local storage and in-app state
export const useNotificationStore = create<NotificationStore>((set, get) => ({
  listenerIsReady: false,
  numOfNewNotifications: 0,
  newestNotificationId: null,
  shouldDisplayNewMessageNotification: true,
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
  getShouldDisplayNewMessageNotification: () =>
    get().shouldDisplayNewMessageNotification,
  setShouldDisplayNewMessageNotification: (value: boolean) =>
    set({ shouldDisplayNewMessageNotification: value }),
}));
