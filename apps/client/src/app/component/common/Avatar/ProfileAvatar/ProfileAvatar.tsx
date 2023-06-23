import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Pressable,
  ImageSourcePropType,
} from 'react-native';
import clsx from 'clsx';

import { getImageFromUrl } from '../../../../hooks/getImageFromUrl';
import {
  getImageFromUserDevice,
  uploadNewAvatar,
} from '../../../../utils/uploadUserImage';

import DefaultAvatar from '../../../asset/default-avatar.svg';
import ConfirmDialog from '../../Dialog/ConfirmDialog';
import { useTranslation } from 'react-i18next';

interface IProfileAvatarProps {
  src: string;
  onPress?: () => void;
  setIsLoadingAvatar?: (value: boolean) => void;
  isOtherUser?: boolean;
}

// function removeAvatarPrefix(str: string) {
//   return str.replace(/^avatar: /, '');
// }

const ProfileAvatar: React.FC<IProfileAvatarProps> = ({
  src,
  onPress,
  setIsLoadingAvatar,
  isOtherUser = false,
}) => {
  const { t } = useTranslation();
  const [isErrDialog, setIsErrDialog] = useState(false);
  const [newAvatarUpload, setNewAvatarUpload] = useState<string | null>(null);
  const [imageSource] = getImageFromUrl(src);

  const pickImageFunction = getImageFromUserDevice({
    allowsMultipleSelection: false,
    quality: 0.7,
  });

  const handlePickImage = async () => {
    const result = await pickImageFunction();
    if (result && !result.canceled) {
      if (setIsLoadingAvatar) setIsLoadingAvatar(true);
      const imageToUpload = result.assets[0].uri;
      const newAvatar = await uploadNewAvatar(result.assets[0].uri);
      if (newAvatar) {
        setNewAvatarUpload(imageToUpload);
        if (setIsLoadingAvatar) setIsLoadingAvatar(false);
      } else {
        setIsErrDialog(true);
        if (setIsLoadingAvatar) setIsLoadingAvatar(false);
      }
    }
  };

  return (
    <View className={clsx('relative flex flex-row items-center')}>
      <ConfirmDialog
        title={t('dialog.err_title_update_img') as string}
        description={t('dialog.err_update_profile') as string}
        isVisible={isErrDialog}
        onClosed={() => setIsErrDialog(false)}
        closeButtonLabel={t('close') || ''}
      />
      <Pressable onPress={onPress}>
        <View className={clsx('rounded-full border-4 border-white')}>
          <Image
            className={clsx(
              'absolute left-0  top-0 h-[101px] w-[101px] rounded-full'
            )}
            source={require('./asset/avatar-load.png')}
            alt="profile image"
          />
          {!newAvatarUpload && !imageSource && (
            <View
              className={clsx(
                'z-10 h-[101px] w-[101px] rounded-full  bg-white'
              )}
            >
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
