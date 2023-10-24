import { Alert, Linking } from "react-native";
import InAppBrowser from "react-native-inappbrowser-reborn";

export const openUrlInApp = async (url: string) => {
  try {
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(url, {
        // iOS Properties
        dismissButtonStyle: "cancel",
        preferredBarTintColor: "white",
        preferredControlTintColor: "black",
        readerMode: false,
        animated: true,
        modalPresentationStyle: "fullScreen",
        modalTransitionStyle: "coverVertical",
        modalEnabled: true,
        enableBarCollapsing: false,
        // Android Properties
        showTitle: true,
        toolbarColor: "white",
        secondaryToolbarColor: "black",
        navigationBarColor: "black",
        navigationBarDividerColor: "white",
        enableUrlBarHiding: true,
        enableDefaultShare: true,
        forceCloseOnRedirection: false,
        // Specify full animation resource identifier(package:anim/name)
        // or only resource name(in case of animation bundled with app).
        animations: {
          startEnter: "slide_in_right",
          startExit: "slide_out_left",
          endEnter: "slide_in_left",
          endExit: "slide_out_right",
        },
        headers: {
          "my-custom-header": "my custom header value",
        },
      });
    } else Linking.openURL(url);
  } catch (error) {
    Alert.alert(error.message);
  }
};
