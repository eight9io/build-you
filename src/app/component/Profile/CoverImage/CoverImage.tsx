import { clsx } from "clsx";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  ImageSourcePropType,
  Linking,
} from "react-native";

import CameraSvg from "./asset/camera.svg";
import {
  getImageFromUserDevice,
  uploadNewCover,
} from "../../../service/upload-image";
import ConfirmDialog from "../../common/Dialog/ConfirmDialog";
import { useTranslation } from "react-i18next";

interface ICoverImageProps {
  src: string;
  isOtherUser?: boolean;
  setIsLoadingCover?: (value: boolean) => void;
}

const CoverImage: React.FC<ICoverImageProps> = ({
  src,
  isOtherUser = false,
  setIsLoadingCover,
}) => {
  const { t } = useTranslation();
  const [isErrDialog, setIsErrDialog] = useState(false);
  const [newAvatarUpload, setNewAvatarUpload] = useState<string | null>(null);
  const [requirePermissionModal, setRequirePermissionModal] = useState(false);

  const handleShowPermissionRequiredModal = () => {
    setRequirePermissionModal(true);
  };

  const handleClosePermissionRequiredModal = () => {
    setRequirePermissionModal(false);
  };
  const handleConfirmPermissionRequiredModal = () => {
    setRequirePermissionModal(false);
    Linking.openSettings();
  };

  const pickImageFunction = getImageFromUserDevice({
    allowsMultipleSelection: false,
    showPermissionRequest: handleShowPermissionRequiredModal,
  });

  const handlePickImage = async () => {
    const result = await pickImageFunction();
    if (result && !result.canceled) {
      if (setIsLoadingCover) setIsLoadingCover(true);
      const imageToUpload = result.assets[0].uri;
      const newAvatar = await uploadNewCover(result.assets[0].uri);
      if (newAvatar) {
        setNewAvatarUpload(imageToUpload);
        if (setIsLoadingCover) setIsLoadingCover(false);
      } else {
        setIsErrDialog(true);
        if (setIsLoadingCover) setIsLoadingCover(false);
      }
    }
  };
  return (
    <View className={clsx(" overflow-hidden")}>
      <ConfirmDialog
        title={t("dialog.err_title_update_img") as string}
        description={t("dialog.err_update_profile") as string}
        isVisible={isErrDialog}
        onClosed={() => setIsErrDialog(false)}
        closeButtonLabel={t("close") || ""}
      />
      <View className="relative">
        <View
          className={clsx("z-100 relative rounded-full border-white bg-white")}
        >
          <Image
            className={clsx("absolute left-0  top-0  h-[115px] w-full")}
            source={require("./asset/Cover-loading.png")}
          />
          {!newAvatarUpload && !src && (
            <Image
              className={clsx(" h-[115px] w-full")}
              source={require("./asset/Cover-loading.png")}
            />
          )}
          {!newAvatarUpload && src && (
            <Image
              className={clsx(" z-100 h-[115px] w-full")}
              source={src as ImageSourcePropType}
            />
          )}
          {newAvatarUpload && (
            <Image
              className={clsx(" z-100 h-[115px] w-full")}
              source={{ uri: newAvatarUpload }}
            />
          )}
        </View>

        {!isOtherUser && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePickImage}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <View className={clsx("absolute bottom-[80px] right-4  ")}>
              <CameraSvg />
            </View>
          </TouchableOpacity>
        )}
      </View>
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

export default CoverImage;
