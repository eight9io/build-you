import { registerRootComponent } from "expo";
import { LogBox } from "react-native";
import messaging from "@react-native-firebase/messaging";
import notifee from "@notifee/react-native";
import { H } from "highlight.run";

import App from "./src/app/App";
import { expo } from "./app.json";
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately

const onMessageReceived = async (message) => {
  // await notifee.getBadgeCount();
  await notifee.displayNotification({
    title: message.notification.title,
    body: message.notification.body,
    data: message.data,
  });

  await notifee.incrementBadgeCount();
};

messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);

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
