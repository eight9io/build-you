import { EXPO_API_APP_DOMAIN } from "@env";
import Clipboard from "@react-native-clipboard/clipboard";
import GlobalDialogController from "../component/common/Dialog/GlobalDialogController";
import GlobalToastController from "../component/common/Toast/GlobalToastController";

export const onShareChallengeLink = (challengeId: string) => {
  if (!challengeId) {
    GlobalDialogController.showModal({
      title: "Error",
      message: "Error copying to clipboard!",
    });
    return;
  }
  Clipboard.setString(`${EXPO_API_APP_DOMAIN}/challenge/${challengeId}`);
  GlobalToastController.showModal({
    message: "Copied to clipboard!",
  });
};
