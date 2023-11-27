import { useState, useEffect, useMemo } from "react";
import { CHALLENGE_TABS_KEY } from "../common/enum";
import { useNotificationStore } from "../store/notification-store";

interface UseTabIndexProps {
  tabRoutes: any[];
  route?: any;
}

export const useTabIndex = ({ tabRoutes, route }: UseTabIndexProps) => {
  const [index, setIndex] = useState(0);

  const { setShouldDisplayNewMessageNotification } = useNotificationStore();

  const setTabIndex = (nextIndex: number) => {
    if (index === nextIndex) return;
    if (chatTabIndex === null || chatTabIndex === undefined)
      return setIndex(nextIndex);
    if (nextIndex === chatTabIndex)
      // Disable new message notification if user switch to chat tab
      setShouldDisplayNewMessageNotification(false);
    else if (index === chatTabIndex)
      // Enable new message notification if user switch to another tab from chat tab
      setShouldDisplayNewMessageNotification(true);

    setIndex(nextIndex);
  };

  const chatTabIndex = useMemo(() => {
    const index = tabRoutes.findIndex(
      (route) => route.key === CHALLENGE_TABS_KEY.CHAT
    );
    if (index === -1) return null;
    return index;
  }, [tabRoutes]);

  const coachTabIndex = useMemo(() => {
    const index = tabRoutes.findIndex(
      (route) => route.key === CHALLENGE_TABS_KEY.COACH
    );
    if (index === -1) return null;
    return index;
  }, [tabRoutes]);

  useEffect(() => {
    // Use setTimeout to wait for tab bar to be rendered at first tab (index 0) before switching to coach tab
    // This is to prevent the tab bar from move back to first tab immediately after switching to coach tab
    if (chatTabIndex && route?.params?.hasNewMessage) {
      setTimeout(() => {
        setTabIndex(chatTabIndex);
      }, 1000);
    } else if (coachTabIndex && route?.params?.hasNotificationOnCoachTab) {
      setTimeout(() => {
        setTabIndex(coachTabIndex);
      }, 1000);
    }
  }, [chatTabIndex, coachTabIndex, route]);

  return {
    index,
    setTabIndex,
  };
};
