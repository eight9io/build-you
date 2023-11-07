import codePush from "react-native-code-push";
import RootNavigation from "./navigation";
import { MenuProvider } from "react-native-popup-menu";
import {
  initConnection,
  endConnection,
} from "react-native-iap";
import {
  useFonts,
  OpenSans_300Light,
  OpenSans_400Regular,
  OpenSans_500Medium,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
} from "@expo-google-fonts/open-sans";
import { isDevice } from "expo-device";
import { useEffect, useState } from "react";
import { Alert, EmitterSubscription, StatusBar } from "react-native";
import { EventProvider } from "react-native-outside-press";

import "./i18n/i18n";
import Toast from "./component/common/Toast/Toast";
import { addNotificationListener } from "./utils/notification.util";
import { useNotificationStore } from "./store/notification-store";
import {
  registerIAPListeners,
  requestPurchaseChecks,
} from "./utils/purchase.util";

export const App = () => {
  const [purchaseUpdateSubscription, setPurchaseUpdateSubscription] =
    useState<EmitterSubscription>(null);
  const [purchaseErrorSubscription, setPurchaseErrorSubscription] =
    useState<EmitterSubscription>(null);

  useEffect(() => {
    let notificationSubscription = null;
    if (isDevice)
      notificationSubscription = addNotificationListener(useNotificationStore);

    // Init IAP connection
    initConnection().then(() => {
      registerIAPListeners()
        .then(({ updateSubscription, errorSubscription }) => {
          setPurchaseUpdateSubscription(updateSubscription);
          setPurchaseErrorSubscription(errorSubscription);
          console.log("IAP listeners registered");
          // crashlytics().crash();
          // TODO: Remove this after testing
          requestPurchaseChecks(2).then((res) => {
            console.log("requestPurchaseChecks", res);
            Alert.alert("res", JSON.stringify(res[0]));
            Alert.alert(
              "quantity",
              JSON.parse(res[0].dataAndroid).quantity.toString()
            );
          });
        })
        .catch((err) => {
          console.error("IAP listeners registration error", err);
        });
    });

    return () => {
      notificationSubscription();
      endConnection()
        .then(() => {
          console.log(" IAP Connection ended");
        })
        .catch((err) => {
          console.error(" IAP Connection ended error", err);
        });
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
        setPurchaseUpdateSubscription(null);
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
        setPurchaseErrorSubscription(null);
      }
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

export default codePush(App);
