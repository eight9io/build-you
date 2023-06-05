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
import {
  getImageFromUserDevice,
  uploadNewAvatar,
} from '../../../../utils/getUserImage';

interface IProfileAvatarProps {
  src: string;
  onPress?: () => void;
}

const ProfileAvatar: React.FC<IProfileAvatarProps> = ({ src, onPress }) => {
  const [newAvatarUpload, setNewAvatarUpload] = useState<string | null>(null);
  const [imageSource, loading, error] = getImageFromUrl(src);

  const pickImageFunction = getImageFromUserDevice({
    allowsMultipleSelection: false,
  });

  const handlePickImage = async () => {
    const result = await pickImageFunction();
    if (result && !result.canceled) {
      const imageToUpload = result.assets[0].uri;
      setNewAvatarUpload(imageToUpload);
      uploadNewAvatar(result.assets[0].uri);
    }
  };

  return (
    <View className={clsx('relative flex flex-row items-center')}>
      <Pressable onPress={onPress}>
        <View className={clsx('rounded-full border-4 border-white')}>
          {!newAvatarUpload && (
            <Image
              className={clsx('h-[101px] w-[101px] rounded-full')}
              source={imageSource as ImageSourcePropType}
              alt="profile image"
            />
          )}
          {newAvatarUpload && (
            <Image
              className={clsx('h-[101px] w-[101px] rounded-full')}
              source={{ uri: newAvatarUpload }}
              alt="profile image"
            />
          )}
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
