import "@expo/metro-runtime"; // Required for hot reload when developing on web platform
import { MenuProvider } from "react-native-popup-menu";
import { NativeWindStyleSheet } from "nativewind";
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
import { Platform, StatusBar } from "react-native";
import { EventProvider } from "react-native-outside-press";
import { FirebaseOptions, getApps, initializeApp } from "firebase/app";
import RootNavigation from "./navigation";
import "./i18n/i18n";
import Toast from "./component/common/Toast/Toast";
import GlobalDialog from "./component/common/Dialog/GlobalDialog/GlobalDialog";

import { addNotificationListener } from "./utils/notification.util";
import { useNotificationStore } from "./store/notification-store";

// ------------
// Need this config to make sure native wind stylesheet is working on web platform
// Ref: https://github.com/marklawlor/nativewind/issues/470
NativeWindStyleSheet.setOutput({
  default: "native",
});
// ------------

// Initialize Firebase
if (getApps().length === 0) {
  const firebaseConfig: FirebaseOptions = JSON.parse(
    process.env.EXPO_FIREBASE_CONFIG 
  );
  initializeApp(firebaseConfig);
}

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
        <RootNavigation />
        <Toast />
        <GlobalDialog />
      </EventProvider>
    </MenuProvider>
  );
};

export default App;
