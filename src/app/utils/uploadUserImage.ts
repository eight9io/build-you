import * as ExpoImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import { serviceUpdateAvatar, serviceUpdateCover } from "../service/profile";
import GlobalDialogController from "../component/common/Dialog/GlobalDialogController";
import i18n from "../i18n/i18n";
interface PickImageOptions {
  allowsMultipleSelection?: boolean;
  base64?: boolean;
  maxImages?: number;
  quality?: number;
  showPermissionRequest: () => void;
}

export const getImageFromUserDevice = (props: PickImageOptions) => {
  const { allowsMultipleSelection, base64, showPermissionRequest } = props;
  return async () => {
    const { status } =
      await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      showPermissionRequest();
      return;
    }

    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: allowsMultipleSelection ? false : true,
      aspect: [4, 3],
      quality: props?.quality || 1,
      allowsMultipleSelection,
      selectionLimit: props.maxImages,
      base64: base64,
    });

    if (!result.canceled) {
      return result;
    }
    return null;
  };
};

// TODO: this one don't need utils, can stay inside service folder
export const uploadNewAvatar = async (image: string) => {
  const formData = new FormData();
  const uri = Platform.OS === "android" ? image : image.replace("file://", "");
  formData.append("file", {
    uri,
    name: "avatar.jpg",
    type: "image/jpeg",
  } as any);

  const response = serviceUpdateAvatar(formData)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return undefined;
    });
  return response;
};

export const uploadNewCover = async (image: string) => {
  const formData = new FormData();
  const uri = Platform.OS === "android" ? image : image.replace("file://", "");
  formData.append("file", {
    uri,
    name: "avatar.jpg",
    type: "image/jpeg",
  } as any);

  const response = serviceUpdateCover(formData)
    .then((res) => {
      return res.data;
    })
    .catch((_) => {
      GlobalDialogController.showModal({
        title: i18n.t("dialog.err_title"),
        message:
          i18n.t("upload_cover_failed") ||
          "Upload cover failed. Please try again later.",
        button: i18n.t("dialog.ok"),
      });
      return undefined;
    });
  return response;
};

export const getImageExtension = (uri: string) => {
  const uriSplit = uri.split(".");
  return uriSplit[uriSplit.length - 1];
};
