import { clsx } from 'clsx';
import React, { useState } from 'react';
import { View, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';
import CameraSvg from './asset/camera.svg';
import {
  getImageFromUserDevice,
  uploadNewCover,
} from '../../../utils/uploadUserImage';
import ConfirmDialog from '../../common/Dialog/ConfirmDialog';
import { useTranslation } from 'react-i18next';
import { getImageFromUrl } from '../../../hooks/getImageFromUrl';

interface ICoverImageProps {
  src: string;
  isOtherUser?: boolean;
  setIsLoadingCover?: (value: boolean) => void;
}

const CoverImage: React.FC<ICoverImageProps> = ({
  src,
  isOtherUser = false,
  setIsLoadingCover,
}) => {
  const { t } = useTranslation();
  const [isErrDialog, setIsErrDialog] = useState(false);
  const [newAvatarUpload, setNewAvatarUpload] = useState<string | null>(null);
  const [imageSource] = getImageFromUrl(src);
  const pickImageFunction = getImageFromUserDevice({
    allowsMultipleSelection: false,
  });

  const handlePickImage = async () => {
    if (setIsLoadingCover) setIsLoadingCover(true);
    const result = await pickImageFunction();
    if (result && !result.canceled) {

      const imageToUpload = result.assets[0].uri;
      const newAvatar = await uploadNewCover(result.assets[0].uri);
      if (newAvatar) {
        setNewAvatarUpload(imageToUpload);
        if (setIsLoadingCover) setIsLoadingCover(false);
      } else {
        setIsErrDialog(true);
        if (setIsLoadingCover) setIsLoadingCover(false);
      }
    }
  };
  return (
    <View className={clsx(' overflow-hidden')}>
      <ConfirmDialog
        title={t('dialog.err_title_update_img') as string}
        description={t('dialog.err_update_profile') as string}
        isVisible={isErrDialog}
        onClosed={() => setIsErrDialog(false)}
        closeButtonLabel={t('close') || ''}
      />
      <View className="relative">
        <View
          className={clsx(
            'z-100 relative rounded-full border-4 border-white bg-white'
          )}
        >
          <Image
            className={clsx('absolute left-0  top-0  h-[115px] w-full')}
            source={require('./asset/Cover-loading.png')}
            alt="profile image"
          />
          {!newAvatarUpload && !imageSource && (
            <Image
              className={clsx(' h-[115px] w-full')}
              source={require('./asset/Cover-loading.png')}
              alt="profile image"
            />
          )}
          {!newAvatarUpload && imageSource && (
            <Image
              className={clsx(' z-100 h-[115px] w-full')}
              source={imageSource as ImageSourcePropType}
              alt="profile image"
            />
          )}
          {newAvatarUpload && (
            <Image
              className={clsx(' z-100 h-[115px] w-full')}
              source={{ uri: newAvatarUpload }}
              alt="profile image"
            />
          )}

        </View>

        {!isOtherUser && (
          <TouchableOpacity activeOpacity={0.8} onPress={handlePickImage}>
            <View className={clsx('absolute bottom-[80px] right-4  ')}>
              <CameraSvg />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CoverImage;
