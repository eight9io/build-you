import { EXPO_API_APP_DOMAIN } from "@env";
import Clipboard from "@react-native-clipboard/clipboard";
import { Alert, View, Button } from "react-native";
import Share from "react-native-share";

import GlobalDialogController from "../component/common/Dialog/GlobalDialogController";

export const onShareChallengeLink = (challengeId: string) => {
  if (!challengeId) {
    GlobalDialogController.showModal({
      title: "Error",
      message: "Error copying to clipboard!",
    });
    return;
  }
  const onShare = async () => {
    try {
      await Share.open({
        title: "Join my challenge!",
        url: `${EXPO_API_APP_DOMAIN}/challenge/${challengeId}`,
      });
    } catch (error: any) {
      if (error.message === "User did not share") {
        return;
      }
      Alert.alert(error.message);
    }
  };

  onShare();
};
