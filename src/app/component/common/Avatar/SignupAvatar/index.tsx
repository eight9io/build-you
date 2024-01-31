import React, { useState } from "react";
import { View, TouchableOpacity, Pressable, Linking } from "react-native";
import clsx from "clsx";
import { Image } from "expo-image";

import DefaultAvatar from "../../../asset/default-avatar.svg";
import CameraSvg from "./asset/camera.svg";

import {
  getImageFromUserDevice,
  uploadNewAvatar,
} from "../../../../service/upload-image";
import ConfirmDialog from "../../Dialog/ConfirmDialog/ConfirmDialog";
import { useTranslation } from "react-i18next";

interface ISignupAvatarProps {}

const SignupAvatar: React.FC<ISignupAvatarProps> = () => {
  const [newAvatarUpload, setNewAvatarUpload] = useState<string | null>(null);
  const [requirePermissionModal, setRequirePermissionModal] = useState(false);
  const { t } = useTranslation();

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
    quality: 0.7,
    showPermissionRequest: handleShowPermissionRequiredModal,
  });

  const handlePickImage = async () => {
    const result = await pickImageFunction();
    if (result && !result.canceled) {
      const imageToUpload = result.assets[0].uri;
      setNewAvatarUpload(imageToUpload);
      uploadNewAvatar(imageToUpload);
    }
  };

  return (
    <View className="flex flex-col items-center">
      <View className={clsx("relative flex flex-row items-center")}>
        <Pressable onPress={handlePickImage}>
          <View className={clsx("rounded-full")}>
            {newAvatarUpload && (
              <Image
                className={clsx("h-[101px] w-[101px] rounded-full")}
                source={{ uri: newAvatarUpload }}
              />
            )}
            {!newAvatarUpload && <DefaultAvatar width={100} height={100} />}
          </View>
        </Pressable>
        <TouchableOpacity activeOpacity={0.8} onPress={handlePickImage}>
          <View
            className={clsx(
              "absolute bottom-[-65px] right-[34px] h-[32px] w-[32px] rounded-full"
            )}
          >
            <CameraSvg />
          </View>
        </TouchableOpacity>
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

export default SignupAvatar;
