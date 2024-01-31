import { registerRootComponent } from "expo";
import { LogBox, Platform } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { H } from "highlight.run";

import App from "./src/app/App";
import { expo } from "./app.json";
import {
  displayNotificationOnForeground,
  handleAppOpenOnNotificationPressed,
} from "./src/app/utils/notification.util";
import { useNotificationStore } from "./src/app/store/notification-store";
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately

const onMessageReceived = async (message) => {
  console.log("message: ", message);
  displayNotificationOnForeground(message, useNotificationStore);
};

if (Platform.OS === "android" || Platform.OS === "ios") {
  messaging().onMessage(onMessageReceived);
  messaging().onNotificationOpenedApp(() => {
    handleAppOpenOnNotificationPressed(useNotificationStore);
  }); // For Android when app is in background
  // messaging().setBackgroundMessageHandler(onMessageReceived(message)); // Comment this because it will send notification twice in Android (one from FCM and one from notifee)
}

registerRootComponent(App);
if (!__DEV__) {
  H.init("jgo8z9el", {
    // Get your project ID from https://app.highlight.io/setup
    environment: "production",
    version: `version:${expo.version}`,
    networkRecording: {
      enabled: true,
      recordHeadersAndBody: true,
    },
  });
} else {
  LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
  LogBox.ignoreAllLogs(); //Ignore all log notifications
}
