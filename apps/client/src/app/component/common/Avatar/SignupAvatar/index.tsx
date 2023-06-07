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

import { getImageFromUserDevice } from '../../../../utils/uploadUserImage';

import DefaultAvatar from './asset/default-avatar.svg';
import CameraSvg from './asset/camera.svg';
import { Controller } from 'react-hook-form';

import Warning from '../../../../component/asset/warning.svg';

interface ISignupAvatarProps {
  control: any;
  errors?: any;
}

const SignupAvatar: React.FC<ISignupAvatarProps> = ({ control, errors }) => {
  const [newAvatarUpload, setNewAvatarUpload] = useState<string | null>(null);

  const pickImageFunction = getImageFromUserDevice({
    allowsMultipleSelection: false,
  });

  const handlePickImage = async (onChange: any) => {
    const result = await pickImageFunction();
    if (result && !result.canceled) {
      const imageToUpload = result.assets[0].uri;
      setNewAvatarUpload(imageToUpload);
      onChange(imageToUpload);
    }
  };

  return (
    <Controller
      control={control}
      name="avatar"
      render={({ field: { onChange, onBlur, value } }) => (
        <View className="flex flex-col items-center">
          <View className={clsx('relative flex flex-row items-center')}>
            <Pressable onPress={() => handlePickImage(onChange)}>
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
          {errors.avatar && (
            <View className="flex flex-row pt-2">
              <Warning />
              <Text className="pl-1 text-sm font-normal text-red-500">
                {errors.avatar.message}
              </Text>
            </View>
          )}
        </View>
      )}
    />
  );
};

export default SignupAvatar;
