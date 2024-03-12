import Clipboard from "@react-native-clipboard/clipboard";
import { createURL } from "expo-linking";
import GlobalDialogController from "../component/common/Dialog/GlobalDialog/GlobalDialogController";
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
  const urlToBeShared = createURL(`challenge/${challengeId}`);
  onCopyLink(urlToBeShared);
};

export const onShareUserLink = (userId: string) => {
  if (!userId) {
    GlobalDialogController.showModal({
      title: i18n.t("dialog.err_title"),
      message:
        i18n.t("share_link.copying_to_clipboard_error") ||
        "Something went wrong",
      button: i18n.t("dialog.ok"),
    });
    return;
  }
  const urlToBeShared = createURL(`user/${userId}`);
  onCopyLink(urlToBeShared);
};

export const onCopyLink = (link: string) => {
  console.log("link: ", link);
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
