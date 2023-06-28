import { create } from 'zustand';

export interface NotificationStore {
  pushToken?: string;
  hasNewNotification: boolean;

  setPushToken: (value: string) => void;
  getPushToken: () => string | undefined;
  setHasNewNotification: (value: boolean) => void;
  getHasNewNotification: () => boolean;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  pushToken: undefined,
  hasNewNotification: false,
  setPushToken: (value) => {
    set({ pushToken: value });
    // TO DO: send the token to the server to save it for later use
  },
  getPushToken: () => get().pushToken,
  setHasNewNotification: (value) => {
    set({ hasNewNotification: value });
  },
  getHasNewNotification: () => get().hasNewNotification,
}));
