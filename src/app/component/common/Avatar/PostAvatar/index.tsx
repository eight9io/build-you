<<<<<<< HEAD
import React from "react";
=======
import React, { useState, useEffect, useMemo } from "react";
>>>>>>> main
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
  return (
    <View className={clsx("flex flex-row items-center")}>
      {src && (
        <View className={clsx("relative")}>
          <Image
            key={`${src}`}
            className={clsx("h-[32px] w-[32px] rounded-full")}
            source={{
              uri: src,
            }}
          />
        </View>
      )}
      {!src && (
        <View className={clsx("z-10 h-[32px] w-[32px] rounded-full  bg-white")}>
          <DefaultAvatar />
        </View>
      )}
    </View>
  );
};

export default PostAvatar;
