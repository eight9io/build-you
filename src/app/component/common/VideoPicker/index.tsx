import { useState, useEffect, FC } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Linking,
  ActivityIndicator,
} from "react-native";
import * as ExpoImagePicker from "expo-image-picker";
import clsx from "clsx";
import { ResizeMode, Video } from "expo-av";

import { IUploadMediaWithId } from "../../../types/media";

import { getRandomId } from "../../../utils/common";

import CameraIcon from "./asset/camera-icon.svg";
import PlayButton from "./asset/play-button.svg";
import CloseButton from "./asset/close-button.svg";
import ConfirmDialog from "../Dialog/ConfirmDialog/ConfirmDialog";
import { useTranslation } from "react-i18next";
import { CrashlyticService } from "../../../service/crashlytic";
import { validateAssets } from "../../../utils/file.util";
import { ASSET_MAX_SIZE } from "../../../common/constants";
import GlobalDialogController from "../Dialog/GlobalDialog/GlobalDialogController";

interface IVideoPickerProps {
  isSelectedImage?: boolean | null;
  useBigImage?: boolean;
  setSelectedVideo?: (video: IUploadMediaWithId[]) => void;
  setExternalVideo?: (video: IUploadMediaWithId[]) => void;
  setIsSelectedImage?: (isSelected: boolean) => void;
  removeVideo?: () => void;
  loading?: boolean;
  setLoading?: (loading: boolean) => void;
}

const VideoPicker: FC<IVideoPickerProps> = ({
  isSelectedImage = false,
  useBigImage = false,
  setExternalVideo,
  setSelectedVideo,
  setIsSelectedImage,
  removeVideo,
  loading = false,
  setLoading,
}) => {
  const [pickedVideo, setPickedVideo] = useState<string[]>([]);
  const [thumbnailImage, setThumbnailImage] = useState<string>();
  const { t } = useTranslation();
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

  const generateThumbnail = async (video: string) => {
    try {
      if (setExternalVideo && setIsSelectedImage) {
        const id = getRandomId();
        setExternalVideo([{ id, uri: video }]);
        setSelectedVideo && setSelectedVideo([{ id, uri: video }]);
        setIsSelectedImage(false);
        setLoading && setLoading(false);
        return;
      }
      if (setExternalVideo) {
        const id = getRandomId();
        setExternalVideo([{ id, uri: video }]);
        setThumbnailImage(video);
        setLoading && setLoading(false);
        return;
      }
      setThumbnailImage(video);
    } catch (error) {
      setLoading && setLoading(false);
      console.error("generateThumbnail", error);
      CrashlyticService({
        errorType: "Generate thumbnail error in VideoPicker",
        error,
      });
    }
  };

  useEffect(() => {
    if (!pickedVideo.length) return;

    generateThumbnail(pickedVideo[0]);
  }, [pickedVideo]);

  const pickVideo = async () => {
    const { status } =
      await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      handleShowPermissionRequiredModal();
      return;
    }
    setTimeout(() => {
      setLoading && setLoading(true);
    }, 100);

    let result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 0.75,
      allowsMultipleSelection: false,
    });
    if (!result.canceled) {
      setLoading && setLoading(true);
      try {
        const validateResult = await validateAssets(
          result.assets,
          ASSET_MAX_SIZE
        );
        if (!validateResult.isValid) {
          GlobalDialogController.showModal({
            title: t("dialog.err_title"),
            message: validateResult.message,
          });
          setLoading && setLoading(false);
          return;
        }
        setPickedVideo(result.assets.map((asset) => asset.uri));
      } catch (error) {
        console.error("Error while validating assets size: ", error);
      }
      setLoading && setLoading(false);
    } else {
      setLoading && setLoading(false);
    }
  };

  const removeLocalVideo = () => {
    setPickedVideo([]);
    removeVideo && removeVideo();
  };

  return (
    <View className="flex flex-col">
      {loading ? <ActivityIndicator size="large" color="#C5C8D2" /> : null}
      {useBigImage && pickedVideo.length > 0 && !setExternalVideo ? (
        <View className="h-[108px] w-[108px]">
          <Video
            source={{ uri: thumbnailImage }}
            className={clsx("aspect-square h-full w-full rounded-xl")}
            resizeMode={ResizeMode.COVER}
            videoStyle={{
              width: "100%",
            }}
          />
        </View>
      ) : null}

      {useBigImage && pickedVideo.length > 0 ? (
        <View className="relative h-[138px] w-full">
          <Video
            source={{ uri: thumbnailImage }}
            className={clsx("aspect-square h-full w-full rounded-xl")}
            resizeMode={ResizeMode.CONTAIN}
            videoStyle={{
              width: "100%",
              height: "100%",
              backgroundColor: "black",
            }}
          />
          <View className="absolute left-1/2 top-[60px] ml-[-10px]">
            <PlayButton />
          </View>
          <TouchableOpacity
            className="absolute right-4 top-4 p-1"
            onPress={removeLocalVideo}
          >
            <CloseButton />
          </TouchableOpacity>
        </View>
      ) : null}

      <TouchableOpacity
        onPress={pickVideo}
        className="mt-5 flex h-14 flex-row items-center justify-center rounded-xl bg-gray-light "
        disabled={!!isSelectedImage}
        testID="video_picker_button"
      >
        <View className="flex flex-row items-center justify-center rounded-xl">
          <CameraIcon fill={!isSelectedImage ? "#1C1B1F" : "#C5C8D2"} />
          <Text
            className={clsx(
              "ml-1.5 text-sm font-semibold text-black-light",
              isSelectedImage && "text-gray-medium"
            )}
          >
            {t("upload_video") || "Upload a video"}
          </Text>
        </View>
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

export default VideoPicker;
