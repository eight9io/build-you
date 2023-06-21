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
} from '../../../../utils/uploadUserImage';
import { useUserProfileStore } from '../../../../store/user-data';
import { IUserData } from '../../../../types/user';

import DefaultAvatar from '../../../asset/default-avatar.svg';

interface IProfileAvatarProps {
  src: string;
  onPress?: () => void;
  isOtherUser?: boolean;
  setIsLoadingAvatar?: (value: boolean) => void;
}

function removeAvatarPrefix(str: string) {
  return str.replace(/^avatar: /, '');
}

const ProfileAvatar: React.FC<IProfileAvatarProps> = ({
  src,
  onPress,
  isOtherUser = false,
}) => {
  const [newAvatarUpload, setNewAvatarUpload] = useState<string | null>(null);
  const [imageSource, loading, error] = getImageFromUrl(src);
  const { setUserProfile, getUserProfile } = useUserProfileStore();
  const userProfile = getUserProfile();
  const pickImageFunction = getImageFromUserDevice({
    allowsMultipleSelection: false,
  });

  const handlePickImage = async () => {
    const result = await pickImageFunction();
    if (result && !result.canceled) {
      const imageToUpload = result.assets[0].uri;
      uploadNewAvatar(result.assets[0].uri);
      const newAvatar = await uploadNewAvatar(result.assets[0].uri);
      console.log(newAvatar);
      if (newAvatar) {
        setUserProfile({
          ...userProfile,
          avatar: removeAvatarPrefix(newAvatar),
        } as IUserData);
        setNewAvatarUpload(imageToUpload);
      }
    }
  };

  return (
    <View className={clsx('relative flex flex-row items-center')}>
      <Pressable onPress={onPress}>
        <View className={clsx('rounded-full border-4 border-white')}>
          {!newAvatarUpload && !imageSource && (
            <View className={clsx('h-[101px] w-[101px] rounded-full bg-white')}>
              <DefaultAvatar />
            </View>
          )}
          {!newAvatarUpload && imageSource && (
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
      {!isOtherUser && (
        <TouchableOpacity activeOpacity={0.8} onPress={handlePickImage}>
          <Image
            className={clsx(
              'absolute bottom-[-40px] right-0 h-[28px] w-[28px] rounded-full'
            )}
            source={require('./asset/camera.png')}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ProfileAvatar;
