import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  ImageStyle,
  ImageSourcePropType,
} from 'react-native';
import clsx from 'clsx';
import { getImageFromUrl } from 'apps/client/src/app/hooks/getImageFromUrl';

interface IProfileAvatarProps {
  src: string;
  onPress?: () => void;
}

const ProfileAvatar: React.FC<IProfileAvatarProps> = ({ src, onPress }) => {
  const [imageSource, loading, error] = getImageFromUrl(src);

  return (
    <View className={clsx('relative flex flex-row items-center')}>
      <Pressable onPress={onPress}>
        <View className={clsx('rounded-full border-4 border-white')}>
          <Image
            className={clsx('h-[101px] w-[101px] rounded-full')}
            source={imageSource as ImageSourcePropType}
            alt="profile image"
          />
        </View>
      </Pressable>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <Image
          className={clsx(
            'absolute bottom-[-40px] right-0 h-[28px] w-[28px] rounded-full'
          )}
          source={require('./asset/camera.png')}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ProfileAvatar;
