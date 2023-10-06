import { useState, FC } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Linking,
  ActivityIndicator,
} from "react-native";
import clsx from "clsx";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";

import CameraIcon from "./asset/camera-icon.svg";
<<<<<<< HEAD
import { getImageFromUserDevice } from "../../../service/upload-image";
=======
import { getImageFromUserDevice } from "../../../utils/uploadUserImage";
>>>>>>> main
import Close from "../../asset/close.svg";
import Button from "../Buttons/Button";
import ConfirmDialog from "../Dialog/ConfirmDialog";

interface IImagePickerProps {
  images?: string[];
  allowsMultipleSelection?: boolean;
  isSelectedImage?: boolean | null;
  onImagesSelected?: (images: string[]) => void;
  onRemoveSelectedImage?: (index: number) => void;
  setIsSelectedImage?: (isSelected: boolean) => void;
  base64?: boolean;
  isDisabled?: boolean;
  loading?: boolean;
  setLoading?: (loading: boolean) => void;
}

const ImagePicker: FC<IImagePickerProps> = ({
  images,
  onImagesSelected,
  onRemoveSelectedImage,
  setIsSelectedImage,
  isSelectedImage,
  allowsMultipleSelection = false,
  base64,
  isDisabled = false,
  loading = false,
  setLoading,
}) => {
  const { t } = useTranslation();
  const [requirePermissionModal, setRequirePermissionModal] = useState(false);

  const handleShowPermissionRequiredModal = () => {
    setRequirePermissionModal(true);
  };

  const pickImageFunction = getImageFromUserDevice({
    allowsMultipleSelection,
    base64,
    maxImages: 3,
    quality: 0.8,
    showPermissionRequest: handleShowPermissionRequiredModal,
  });

  const handlePickImage = async () => {
    setTimeout(() => {
      setLoading && setLoading(true);
    }, 300);
    const result = await pickImageFunction();
    if (result && !result.canceled) {
      const imagesPicked = result.assets.map((asset) => asset.uri);
      onImagesSelected && onImagesSelected(imagesPicked);
      if (setIsSelectedImage) setIsSelectedImage(true);
    }
    setLoading && setLoading(false);
  };

  const handleRemoveSelectedImage = (index: number) => {
    if (onRemoveSelectedImage) {
      onRemoveSelectedImage(index);
    }
  };

  const handleClosePermissionRequiredModal = () => {
    setRequirePermissionModal(false);
  };
  const handleConfirmPermissionRequiredModal = () => {
    setRequirePermissionModal(false);
    Linking.openSettings();
  };
  return (
    <View className="flex flex-col">
      {loading && <ActivityIndicator size="large" color="#C5C8D2" />}

      {images && images.length > 0 && (
        <View className="flex flex-row flex-wrap justify-start gap-2 pt-5">
          {images.map((uri, index) => (
            <View
              key={index}
              className="relative aspect-square"
              style={{ width: 100 }}
            >
              {onRemoveSelectedImage && (
                <View className="absolute right-0 top-0 z-10">
                  <Button
                    onPress={() => handleRemoveSelectedImage(index)}
                    Icon={<Close fill={"white"} />}
                  />
                </View>
              )}
              <Image
                source={{
                  uri,
                }}
                className="h-full w-full rounded-xl"
              />
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        onPress={handlePickImage}
        disabled={
          (isSelectedImage !== undefined && isSelectedImage === false) ||
          isDisabled
            ? true
            : false
        }
        className="mt-5 flex h-14 flex-row items-center justify-center rounded-xl bg-gray-light"
      >
        <CameraIcon
          fill={
            (isSelectedImage || isSelectedImage == null) && !isDisabled
              ? "#1C1B1F"
              : "#C5C8D2"
          }
        />
        <Text
          className={clsx(
            "ml-1.5 mt-1 text-sm font-semibold text-black-light",
            (isSelectedImage === false || isDisabled) && "text-gray-medium"
          )}
        >
          {t("upload_image") || "Upload image"}
        </Text>
      </TouchableOpacity>
      <ConfirmDialog
        title={t("dialog.alert_title") || ""}
        description={t("image_picker.image_permission_required") || ""}
        isVisible={requirePermissionModal}
        onClosed={handleClosePermissionRequiredModal}
        closeButtonLabel={t("close") || ""}
        confirmButtonLabel={t("dialog.open_settings") || ""}
        onConfirm={handleConfirmPermissionRequiredModal}
      />
    </View>
  );
};

export default ImagePicker;
