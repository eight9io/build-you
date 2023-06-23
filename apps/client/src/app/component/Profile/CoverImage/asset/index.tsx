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

import {
  getImageFromUserDevice,
  uploadNewAvatar,
} from '../../../../utils/uploadUserImage';

import DefaultAvatar from './asset/default-avatar.svg';
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
  const pickImageFunction = getImageFromUserDevice({
    allowsMultipleSelection: false,
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
    <View className={clsx('relative flex flex-row items-center')}>
      <Pressable onPress={onPress}>
        <View
          className={clsx(
            'z-100 relative rounded-full border-4 border-white bg-white'
          )}
        >
          {src && (
            <>
              <Image
                className={clsx(
                  'absolute left-0  top-0 h-[101px] w-[101px] rounded-full'
                )}
                source={require('./asset/avatar-load.png')}
                alt="profile image"
              />
              <Image
                className={clsx(' z-100 h-[101px] w-[101px] rounded-full')}
                source={{ uri: src + '?' + new Date() }}
                alt="profile image"
              />
            </>
          )}
          {!src && <DefaultAvatar />}
        </View>
      </Pressable>

      <TouchableOpacity activeOpacity={0.8} onPress={handlePickImage}>
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
