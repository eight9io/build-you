import clsx from "clsx";
import { Video } from "expo-av";
import React, { FC } from "react";
import { Image } from "expo-image";
import { InAppBrowser } from "react-native-inappbrowser-reborn";
import { View, Text, TouchableOpacity, Linking, Alert } from "react-native";

import { IAdProps } from "../../types/common";

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
        {image && (
          <Image
            source={{ uri: image }}
            className={clsx("aspect-square w-full rounded-t-xl")}
            onLoadEnd={() => {}}
          />
        )}
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
        {video && (
          <Video
            source={{ uri: video }}
            className={clsx("aspect-square w-full rounded-t-xl")}
          />
        )}
        <View className="absolute bottom-0 left-0 right-0 p-3">
          <Text className="text-lg font-bold text-white">{name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const AdCard: FC<IAdCardProps> = ({ item }) => {
  const openUrlInApp = async () => {
    try {
      const url = item?.url as string;
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: "cancel",
          preferredBarTintColor: "#FF9C54",
          preferredControlTintColor: "white",
          readerMode: false,
          animated: true,
          modalPresentationStyle: "fullScreen",
          modalTransitionStyle: "coverVertical",
          modalEnabled: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          toolbarColor: "#FF9C54",
          secondaryToolbarColor: "black",
          navigationBarColor: "black",
          navigationBarDividerColor: "white",
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
          // Specify full animation resource identifier(package:anim/name)
          // or only resource name(in case of animation bundled with app).
          animations: {
            startEnter: "slide_in_right",
            startExit: "slide_out_left",
            endEnter: "slide_in_left",
            endExit: "slide_out_right",
          },
          headers: {
            "my-custom-header": "my custom header value",
          },
        });
      } else Linking.openURL(url);
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <View className="relative w-full">
      <View className="relative mb-1">
        <View className="bg-gray-50 p-5">
          {item?.caption && (
            <Text className=" mb-3 text-lg font-semibold leading-5">
              {item?.caption}
            </Text>
          )}
          {item?.image && (
            <AdImage
              name={item?.caption}
              image={item?.image as string}
              onPress={openUrlInApp}
            />
          )}
          {item?.video && (
            <AdVideo
              name={item?.caption}
              video={item?.video as string}
              onPress={openUrlInApp}
            />
          )}
        </View>
        <View className="h-2 w-full bg-gray-light" />
      </View>
    </View>
  );
};

export default AdCard;
