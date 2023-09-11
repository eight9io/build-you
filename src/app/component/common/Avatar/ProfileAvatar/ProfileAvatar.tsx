import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Pressable,
  ImageSourcePropType,
  Linking,
} from "react-native";
import clsx from "clsx";
import { Image } from "expo-image";

import {
  getImageFromUserDevice,
  uploadNewAvatar,
} from "../../../../utils/uploadUserImage";

import DefaultAvatar from "../../../asset/default-avatar.svg";
import IconUploadAvatar from "./asset/uploadAvatar.svg";
import ConfirmDialog from "../../Dialog/ConfirmDialog";
import { useTranslation } from "react-i18next";

interface IProfileAvatarProps {
  src: string;
  onPress?: () => void;
  setIsLoadingAvatar?: (value: boolean) => void;
  isOtherUser?: boolean;
}

const ProfileAvatar: React.FC<IProfileAvatarProps> = ({
  src,
  onPress,
  setIsLoadingAvatar,
  isOtherUser = false,
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
    quality: 0.7,
    showPermissionRequest: handleShowPermissionRequiredModal,
  });

  const handlePickImage = async () => {
    const result = await pickImageFunction();
    if (result && !result.canceled) {
      if (setIsLoadingAvatar) setIsLoadingAvatar(true);
      const imageToUpload = result.assets[0].uri;
      const newAvatar = await uploadNewAvatar(result.assets[0].uri);
      if (newAvatar) {
        setNewAvatarUpload(imageToUpload);
        if (setIsLoadingAvatar) setIsLoadingAvatar(false);
      } else {
        setIsErrDialog(true);
        if (setIsLoadingAvatar) setIsLoadingAvatar(false);
      }
    }
  };

  return (
    <View className={clsx("relative flex flex-row items-center")}>
      <ConfirmDialog
        title={t("dialog.err_title_update_img") as string}
        description={t("dialog.err_update_profile") as string}
        isVisible={isErrDialog}
        onClosed={() => setIsErrDialog(false)}
        closeButtonLabel={t("close") || ""}
      />
      <ConfirmDialog
        title={t("dialog.alert_title") || ""}
        description={t("image_picker.image_permission_required") || ""}
        isVisible={requirePermissionModal}
        onClosed={handleClosePermissionRequiredModal}
        closeButtonLabel={t("close") || ""}
        confirmButtonLabel={t("dialog.open_settings") || ""}
        onConfirm={handleConfirmPermissionRequiredModal}
      />
      <Pressable onPress={onPress}>
        <View className={clsx("rounded-full border-4 border-white")}>
          <Image
            className={clsx(
              "absolute left-0  top-0 h-[101px] w-[101px] rounded-full"
            )}
            source={require("./asset/avatar-load.png")}
          />
          {!newAvatarUpload && !src && (
            <View
              className={clsx(
                "z-10 h-[101px] w-[101px] rounded-full  bg-white"
              )}
            >
              <DefaultAvatar width={100} height={100} />
            </View>
          )}
          {!newAvatarUpload && src && (
            <Image
              className={clsx("h-[101px] w-[101px] rounded-full")}
              source={src}
            />
          )}
          {newAvatarUpload && (
            <Image
              className={clsx("h-[101px] w-[101px] rounded-full")}
              source={{ uri: newAvatarUpload }}
            />
          )}
        </View>
      </Pressable>
      {!isOtherUser && (
        <TouchableOpacity activeOpacity={0.8} onPress={handlePickImage}>
          <View
            className={clsx(
              "absolute bottom-[-40px] right-0 h-7 w-7 items-center justify-center rounded-full bg-primary-default"
            )}
          >
            <IconUploadAvatar />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ProfileAvatar;
