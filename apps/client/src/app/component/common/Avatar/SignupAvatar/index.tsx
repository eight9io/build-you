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
import { getImageFromUrl } from '../../../../hooks/getImageFromUrl';

import DefaultAvatar from './asset/default-avatar.svg';
import CameraSvg from './asset/camera.svg';

interface ISignupAvatarProps {
  control: any;
  src?: string;
  onPress?: () => void;
}

const SignupAvatar: React.FC<ISignupAvatarProps> = ({
  control,
  src,
  onPress,
}) => {
  let imageSrc;
  if (src) {
    const [imageSource, loading, error] = getImageFromUrl(src);
    imageSrc = imageSource;
  }

  return (
    <View className={clsx('relative flex flex-row items-center')}>
      <Pressable onPress={onPress}>
        <View className={clsx('rounded-full')}>
          {src && (
            <Image
              className={clsx('h-[101px] w-[101px] rounded-full')}
              source={imageSrc as ImageSourcePropType}
              alt="profile image"
            />
          )}
          {!src && <DefaultAvatar />}
        </View>
      </Pressable>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <View
          className={clsx(
            'absolute bottom-[-60px] right-[38px] h-[28px] w-[28px] rounded-full'
          )}
        >
          <CameraSvg />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SignupAvatar;
