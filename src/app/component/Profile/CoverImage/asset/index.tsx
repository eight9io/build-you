import React, { useState } from "react";
import { View, TouchableOpacity, Pressable, Linking } from "react-native";
import clsx from "clsx";
import { Image } from "expo-image";

import {
  getImageFromUserDevice,
  uploadNewAvatar,
} from "../../../../utils/uploadUserImage";

import DefaultAvatar from "./asset/default-avatar.svg";
import ConfirmDialog from "../../../common/Dialog/ConfirmDialog";
import { useTranslation } from "react-i18next";
interface IProfileAvatarProps {
  src: string;
  onPress?: () => void;
  setIsLoadingAvatar?: (value: boolean) => void;
}

const ProfileAvatar: React.FC<IProfileAvatarProps> = ({
  src,
  onPress,
  setIsLoadingAvatar,
}) => {
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
    showPermissionRequest: handleShowPermissionRequiredModal,
  });

  const handlePickImage = async () => {
    const result = await pickImageFunction();
    if (result && !result.canceled) {
      const imageToUpload = result.assets[0].uri;
      setIsLoadingAvatar && setIsLoadingAvatar(true);
      const res = await uploadNewAvatar(imageToUpload);
      if (res) {
        setTimeout(() => {
          setIsLoadingAvatar && setIsLoadingAvatar(false);
        }, 3000);
      }
    }
  };
  return (
    <View className={clsx("relative flex flex-row items-center")}>
      <Pressable onPress={onPress}>
        <View
          className={clsx(
            "z-100 relative rounded-full border-4 border-white bg-white"
          )}
        >
          {src && (
            <>
              <Image
                className={clsx(
                  "absolute left-0  top-0 h-[101px] w-[101px] rounded-full"
                )}
                source={require("./asset/avatar-load.png")}
              />
              <Image
                className={clsx(" z-100 h-[101px] w-[101px] rounded-full")}
                source={{ uri: src + "?" + new Date() }}
              />
            </>
          )}
          {!src && <DefaultAvatar />}
        </View>
      </Pressable>

      <TouchableOpacity activeOpacity={0.8} onPress={handlePickImage}>
        <Image
          className={clsx(
            "absolute bottom-[-40px] right-0 h-[28px] w-[28px] rounded-full"
          )}
          source={require("./asset/camera.png")}
        />
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

export default ProfileAvatar;
