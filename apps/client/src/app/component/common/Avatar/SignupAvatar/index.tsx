import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Pressable } from 'react-native';
import clsx from 'clsx';

import DefaultAvatar from './asset/default-avatar.svg';
import CameraSvg from './asset/camera.svg';

import {
  getImageFromUserDevice,
  uploadNewAvatar,
} from '../../../../utils/uploadUserImage';

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
              'absolute bottom-[-65px] right-[34px] h-[32px] w-[32px] rounded-full'
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
