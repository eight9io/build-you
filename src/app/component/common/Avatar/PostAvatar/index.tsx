import React, { useState, useEffect, useMemo } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import clsx from "clsx";
import DefaultAvatar from "../../../asset/default-avatar.svg";

interface IPostAvatarProps {
  src: string | null | undefined;
  alt?: string;
  onPress?: () => void;
}

const PostAvatar: React.FC<IPostAvatarProps> = ({ src }) => {
  const newAvatarUrl = useMemo(() => {
    let url: string | null | undefined;
    if (src && !src.startsWith("http")) {
      url = `https://buildyou-front.stg.startegois.com${src}`;
    } else {
      url = src;
    }
    return url;
  }, [src]);

  return (
    <View className={clsx("flex flex-row items-center")}>
      {newAvatarUrl && (
        <View className={clsx("relative")}>
          <Image
            key={`${newAvatarUrl}`}
            className={clsx("h-[32px] w-[32px] rounded-full")}
            source={{
              uri: newAvatarUrl,
            }}
          />
        </View>
      )}
      {!newAvatarUrl && (
        <View className={clsx("z-10 h-[32px] w-[32px] rounded-full  bg-white")}>
          <DefaultAvatar />
        </View>
      )}
    </View>
  );
};

export default PostAvatar;
