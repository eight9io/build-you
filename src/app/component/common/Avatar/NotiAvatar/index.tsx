import React, { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import clsx from "clsx";
import { Image } from "expo-image";
import { NOTIFICATION_TYPES } from "../../../../common/enum";
import DefaultAvatar from "../../../asset/default-avatar.svg";

interface INotiAvatarProps {
  size?: "small" | "medium" | "large";
  src?: string;
  alt?: string;
  typeOfNoti?: NOTIFICATION_TYPES;
  onPress?: () => void;
}

const NotiAvatar: React.FC<INotiAvatarProps> = ({
  size = "medium",
  src,
  alt,
  typeOfNoti,
  onPress,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const imageSourceFromAssets =
    typeOfNoti === NOTIFICATION_TYPES.NEW_COMMENT ||
    typeOfNoti === NOTIFICATION_TYPES.NEW_MENTION
      ? require("./asset/comment.png")
      : require("./asset/follow.png");

  return (
    <View className={clsx("flex flex-row items-center")}>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <View className={clsx("relative")}>
          {src ? (
            <Image
              className="h-[57px] w-[57px] rounded-full"
              source={{
                uri: src,
              }}
            />
          ) : (
            <DefaultAvatar className="h-[57px] w-[57px] rounded-full" />
          )}
          {typeOfNoti && (
            <Image
              className={clsx(
                "absolute bottom-0 right-0 h-[28px] w-[28px] rounded-full"
              )}
              source={imageSourceFromAssets}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default NotiAvatar;
