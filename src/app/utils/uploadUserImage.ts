import * as ExpoImagePicker from "expo-image-picker";
import GlobalDialogController from "../component/common/Dialog/GlobalDialog/GlobalDialogController";
import i18n from "../i18n/i18n";
import { validateAssets } from "./file.util";
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
        const validateResult = await validateAssets(
          result.assets,
          ASSET_MAX_SIZE
        );
        if (!validateResult.isValid) {
          GlobalDialogController.showModal({
            title: i18n.t("dialog.err_title"),
            message: validateResult.message,
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

// // TODO: this one don't need utils, can stay inside service folder
// export const uploadNewAvatar = async (image: string) => {
//   const formData = new FormData();
//   const uri = Platform.OS === "android" ? image : image.replace("file://", "");
//   formData.append("file", {
//     uri,
//     name: "avatar.jpg",
//     type: "image/jpeg",
//   } as any);

//   const response = serviceUpdateAvatar(formData)
//     .then((res) => {
//       return res.data;
//     })
//     .catch((err) => {
//       return undefined;
//     });
//   return response;
// };

// export const uploadNewCover = async (image: string) => {
//   const formData = new FormData();
//   const uri = Platform.OS === "android" ? image : image.replace("file://", "");
//   formData.append("file", {
//     uri,
//     name: "avatar.jpg",
//     type: "image/jpeg",
//   } as any);

//   const response = serviceUpdateCover(formData)
//     .then((res) => {
//       return res.data;
//     })
//     .catch((_) => {
//       GlobalDialogController.showModal({
//         title: i18n.t("dialog.err_title"),
//         message:
//           i18n.t("upload_cover_failed") ||
//           "Upload cover failed. Please try again later.",
//         button: i18n.t("dialog.ok"),
//       });
//       return undefined;
//     });
//   return response;
// };

export const getImageExtension = (uri: string) => {
  const uriSplit = uri.split(".");
  return uriSplit[uriSplit.length - 1];
};
