import { ImagePickerAsset } from "expo-image-picker";
import mime from "react-native-mime-types";
import { createFileFromUri } from "./image";
import i18n from "../i18n/i18n";
import {
  ASSET_MAX_SIZE_TO_DISPLAY,
  VALID_IMAGE_EXTENSIONS,
  VALID_VIDEO_EXTENSIONS,
} from "../common/constants";

export const exceedsMaxFileSize = (file: File, maxSize: number) => {
  return file.size > maxSize;
};

export const validateAssets = async (
  assets: ImagePickerAsset[],
  maxSize: number
) => {
  for (const asset of assets) {
    const file = await createFileFromUri(asset.uri);
    const isExceedMaxFileSize = exceedsMaxFileSize(file, maxSize);
    if (isExceedMaxFileSize) {
      return {
        isValid: false,
        message: i18n.t("exceed_asset_max_size", {
          maxSize: ASSET_MAX_SIZE_TO_DISPLAY,
        }),
      };
    }
    let extension = mime.extension(file.type);

    if (!extension) {
      console.error(
        `Failed to get file extension from mime type: ${file.type}`
      );
      return {
        isValid: false,
        message: i18n.t("error_general_message"),
      };
    }
    if (extension === "qt") extension = "mov"; // mov is the official extension for QuickTime files
    const validExtensions = [
      ...VALID_IMAGE_EXTENSIONS,
      ...VALID_VIDEO_EXTENSIONS,
    ];
    if (!validExtensions.includes(extension)) {
      return {
        isValid: false,
        message: i18n.t("invalid_extension"),
      };
    }
    return { isValid: true, message: "" }; // Return valid object if all checks pass
  }
};
