import { clsx } from 'clsx';
import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import CameraSvg from './asset/camera.svg';
import {
  getImageFromUserDevice,
  uploadNewCover,
} from '../../../utils/uploadUserImage';
import ConfirmDialog from '../../common/Dialog/ConfirmDialog';
import { useTranslation } from 'react-i18next';

interface ICoverImageProps {
  src: string;
  isOtherUser?: boolean;
  setIsLoading?: (value: boolean) => void;
}

const CoverImage: React.FC<ICoverImageProps> = ({
  src,
  isOtherUser = false,
  setIsLoading,
}) => {
  const { t } = useTranslation();
  const [isErrDialog, setIsErrDialog] = useState(false);
  const pickImageFunction = getImageFromUserDevice({
    allowsMultipleSelection: false,
  });

  const handlePickImage = async () => {
    const result = await pickImageFunction();
    if (result && !result.canceled) {
      const imageToUpload = result.assets[0].uri;
      setIsLoading && setIsLoading(true);
      const res = await uploadNewCover(imageToUpload);
      if (res) {
        setTimeout(() => {
          setIsLoading && setIsLoading(false);
        }, 3000);
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
          {src && (
            <>
              <Image
                className={clsx('absolute left-0  top-0  h-[115px] w-full')}
                source={require('./asset/Cover-loading.png')}
                alt="profile image"
              />
              <Image
                className={clsx(' z-100 h-[115px] w-full')}
                source={{ uri: src + '?' + new Date() }}
                alt="profile image"
              />
            </>
          )}
          {!src && (
            <Image
              className={clsx(' h-[115px] w-full')}
              source={require('./asset/Cover-loading.png')}
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
