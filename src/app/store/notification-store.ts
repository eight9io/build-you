import { create } from "zustand";
import { clearAllNotifications } from "../utils/notification.util";

export interface NotificationStore {
  hasNewNotification: boolean;

  setHasNewNotification: (value: boolean) => void;
  getHasNewNotification: () => boolean;
}

// Use persist to store data in local storage
// Zustand will handle the data sync between local storage and in-app state
export const useNotificationStore = create<NotificationStore>((set, get) => ({
  hasNewNotification: false,

  setHasNewNotification: async (value) => {
    set({ hasNewNotification: value });
    if (!value) {
      // Dismiss all notification trays and reset badge count
      await clearAllNotifications();
    }
  },
  getHasNewNotification: () => get().hasNewNotification,
}));
