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

import { getImageFromUserDevice, uploadNewAvatar } from '../../../../utils/uploadUserImage';

import DefaultAvatar from './asset/default-avatar.svg';
import CameraSvg from './asset/camera.svg';
import { Controller } from 'react-hook-form';

import Warning from '../../../../component/asset/warning.svg';

interface ISignupAvatarProps {}

const SignupAvatar: React.FC<ISignupAvatarProps> = () => {
  const [newAvatarUpload, setNewAvatarUpload] = useState<string | null>(null);

  const pickImageFunction = getImageFromUserDevice({
    allowsMultipleSelection: false,
  });

  const handlePickImage = async () => {
    const result = await pickImageFunction();
    if (result && !result.canceled) {
      const imageToUpload = result.assets[0].uri;
      setNewAvatarUpload(imageToUpload);
      uploadNewAvatar(imageToUpload);
    }
  };

  return (
    <View className="flex flex-col items-center">
      <View className={clsx('relative flex flex-row items-center')}>
        <Pressable onPress={handlePickImage}>
          <View className={clsx('rounded-full')}>
            {newAvatarUpload && (
              <Image
                className={clsx('h-[101px] w-[101px] rounded-full')}
                source={{ uri: newAvatarUpload }}
                alt="profile image"
              />
            )}
            {!newAvatarUpload && <DefaultAvatar />}
          </View>
        </Pressable>
        <TouchableOpacity activeOpacity={0.8} onPress={handlePickImage}>
          <View
            className={clsx(
              'absolute bottom-[-60px] right-[38px] h-[28px] w-[28px] rounded-full'
            )}
          >
            <CameraSvg />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignupAvatar;
