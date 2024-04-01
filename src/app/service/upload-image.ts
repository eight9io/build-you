import * as ExpoImagePicker from "expo-image-picker";
import { serviceUpdateAvatar, serviceUpdateCover } from "./profile";
import GlobalDialogController from "../component/common/Dialog/GlobalDialog/GlobalDialogController";
import i18n from "../i18n/i18n";
import { createFileFromUri } from "../utils/image";
import { validateAssetsSize } from "../utils/file.util";
import { ASSET_MAX_SIZE, ASSET_MAX_SIZE_TO_DISPLAY } from "../common/constants";

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
      try {
        const isValidAssets = await validateAssetsSize(
          result.assets,
          ASSET_MAX_SIZE
        );
        if (!isValidAssets) {
          GlobalDialogController.showModal({
            title: i18n.t("dialog.err_title"),
            message: i18n.t("exceed_asset_max_size", {
              maxSize: ASSET_MAX_SIZE_TO_DISPLAY,
            }),
          });
          return null;
        }
        return result;
      } catch (error) {
        console.error("Error while validating assets size: ", error);
        return null;
      }
    }
    return null;
  };
};

export const uploadNewAvatar = async (image: string) => {
  const formData = new FormData();
  const imageFile = await createFileFromUri(image);
  formData.append("file", imageFile);

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
  const imageFile = await createFileFromUri(image);
  formData.append("file", imageFile);

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
