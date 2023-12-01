import { EXPO_APP_DOMAIN } from "@env";
import { Alert, View, Button } from "react-native";
import Share from "react-native-share";
import Clipboard from "@react-native-clipboard/clipboard";

import GlobalDialogController from "../component/common/Dialog/GlobalDialogController";
import i18n from "../i18n/i18n";
import GlobalToastController from "../component/common/Toast/GlobalToastController";

export const onShareChallengeLink = (challengeId: string) => {
  if (!challengeId) {
    GlobalDialogController.showModal({
      title: i18n.t("dialog.err_title"),
      message:
        i18n.t("share_link.copying_to_clipboard_error") ||
        "Something went wrong",
      button: i18n.t("dialog.ok"),
    });
    return;
  }
  const onShare = async () => {
    try {
      await Share.open({
        title: i18n.t("share_link.join_my_challenge") || "Join my challenge!",
        url: `${EXPO_APP_DOMAIN}/challenge/${challengeId}`,
      });
    } catch (error: any) {
      if (
        error.message === i18n.t("share_link.user_did_not_share_link") ||
        "User did not share"
      ) {
        return;
      }
      Alert.alert(error.message);
    }
  };

  onShare();
};

export const onCopyLink = (link: string) => {
  if (!link) {
    GlobalDialogController.showModal({
      title: i18n.t("dialog.err_title"),
      message:
        i18n.t("share_link.copying_to_clipboard_error") ||
        "Something went wrong",
      button: i18n.t("dialog.ok"),
    });
    return;
  }
  Clipboard.setString(link);
  GlobalToastController.showModal({
    message: i18n.t("share_link.copied_to_clipboard") || "Copied to clipboard",
  });
};
