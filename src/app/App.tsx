import RootNavigation from "./navigation";
import { MenuProvider } from "react-native-popup-menu";
import {
  useFonts,
  OpenSans_300Light,
  OpenSans_400Regular,
  OpenSans_500Medium,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
} from "@expo-google-fonts/open-sans";
import { isDevice } from "expo-device";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { EventProvider } from "react-native-outside-press";

import "./i18n/i18n";
import Toast from "./component/common/Toast/Toast";
import { addNotificationListener } from "./utils/notification.util";
import { useNotificationStore } from "./store/notification-store";

export const App = () => {
  useEffect(() => {
    let notificationSubscription = null;
    if (isDevice)
      notificationSubscription = addNotificationListener(useNotificationStore);

    return () => {
      notificationSubscription();
    };
  }, []);
  
  const [fontLoaded] = useFonts({
    OpenSans_300Light,
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
  });

  if (!fontLoaded) {
    return null;
  }
  StatusBar.setBarStyle("dark-content", true);

  

  return (
    <MenuProvider>
      <EventProvider>
        <Toast />
        <RootNavigation />
      </EventProvider>
    </MenuProvider>
  );
};

export default App;
