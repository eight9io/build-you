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
    if (chatTabIndex && route?.params?.hasNewMessage) {
      setTabIndex(chatTabIndex);
    } else if (coachTabIndex && route?.params?.hasNotificationOnCoachTab) {
      setTabIndex(coachTabIndex);
    }
  }, [chatTabIndex, coachTabIndex, route]);

  return {
    index,
    setTabIndex,
  };
};
