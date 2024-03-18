import clsx from "clsx";
import { ResizeMode, Video } from "expo-av";
import { FC } from "react";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { View, Text, TouchableOpacity } from "react-native";

import { IAdProps } from "../../types/common";
import { openUrl } from "../../utils/linking.util";
import GlobalDialogController from "../common/Dialog/GlobalDialog/GlobalDialogController";

interface IAdImageProps {
  name: string;
  image: string | null;
  onPress?: () => void;
}

interface IAdVideoProps {
  name: string;
  video: string | null;
  onPress?: () => void;
}

interface IAdCardProps {
  item: IAdProps;
}

const AdImage: FC<IAdImageProps> = ({ name, image, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={clsx("w-full rounded-xl border border-gray-80 bg-white")}
    >
      <View className={clsx("relative w-full")}>
        {image ? (
          <Image
            source={{ uri: image }}
            className={clsx("aspect-square w-full rounded-t-xl")}
            onLoadEnd={() => {}}
          />
        ) : null}
        <View className="absolute bottom-0 left-0 right-0 p-3">
          <Text className="text-lg font-bold text-white">{name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const AdVideo = ({ name, video, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={clsx("w-full rounded-xl border border-gray-80 bg-white")}
    >
      <View className={clsx("relative w-full")}>
        {video ? (
          <Video
            source={{ uri: video }}
            className={clsx("aspect-square w-full rounded-t-xl")}
            resizeMode={ResizeMode.CONTAIN}
            videoStyle={{
              width: "100%",
              height: "100%",
              backgroundColor: "black",
            }}
          />
        ) : null}
        <View className="absolute bottom-0 left-0 right-0 p-3">
          <Text className="text-lg font-bold text-white">{name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const AdCard: FC<IAdCardProps> = ({ item }) => {
  const { t } = useTranslation();

  const handleOpenLink = async (url: string) => {
    if (!url) {
      GlobalDialogController.showModal({
        title: t("error"),
        message: t("error_general_message"),
      });
      return;
    }
    try {
      await openUrl(url);
    } catch (error) {
      GlobalDialogController.showModal({
        title: t("error"),
        message: t("error_general_message"),
      });
    }
  };
  return (
    <View className="relative w-full">
      <View className="relative mb-1">
        <View className="bg-gray-50 p-5">
          {item?.caption ? (
            <Text className=" mb-3 text-lg font-semibold leading-5">
              {item?.caption}
            </Text>
          ) : null}
          {item?.image ? (
            <AdImage
              name={item?.caption}
              image={item?.image as string}
              onPress={() => handleOpenLink(item?.url)}
            />
          ) : null}
          {item?.video ? (
            <AdVideo
              name={item?.caption}
              video={item?.video as string}
              onPress={() => handleOpenLink(item?.url)}
            />
          ) : null}
        </View>
        <View className="h-2 w-full bg-gray-light" />
      </View>
    </View>
  );
};

export default AdCard;
