import { ImagePickerAsset } from "expo-image-picker";
import { createFileFromUri } from "./image";

export const exceedsMaxFileSize = (file: File, maxSize: number) => {
  return file.size > maxSize;
};

export const validateAssetsSize = async (
  assets: ImagePickerAsset[],
  maxSize: number
) => {
  const isValid = await Promise.all(
    assets.map(async (asset) => {
      const file = await createFileFromUri(asset.uri);
      return exceedsMaxFileSize(file, maxSize);
    })
  );
  return isValid.every((value) => !value);
};
