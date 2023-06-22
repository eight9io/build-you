import * as ExpoImagePicker from 'expo-image-picker';
import httpInstance from './http';
import { Platform } from 'react-native';
import { manipulateAsync } from 'expo-image-manipulator';
import { serviceUpdateAvatar, serviceUpdateCover } from '../service/profile';
import GlobalDialogController from '../component/common/Dialog/GlobalDialogController';

import { useTranslation } from 'react-i18next';

interface PickImageOptions {
  allowsMultipleSelection?: boolean;
  base64?: boolean;
  maxImages?: number;
  quality?: number;
}

export const getImageFromUserDevice = (props: PickImageOptions) => {
  const { allowsMultipleSelection, base64 } = props;
  const { t } = useTranslation();
  return async () => {
    const { status } =
      await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      GlobalDialogController.showModal(
        t('error_permission_message') ||
          'Permission denied. Please try again later.'
      );
      return;
    }

    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: props?.quality || 1,
      allowsMultipleSelection,
      selectionLimit: props.maxImages,
      base64: base64,
    });

    if (!result.canceled) {
      return result;
    }
    return null;
  };
};

export const uploadNewAvatar = async (image: string) => {
  const formData = new FormData();
  const uri = Platform.OS === 'android' ? image : image.replace('file://', '');
  formData.append('file', {
    uri,
    name: 'avatar.jpg',
    type: 'image/jpeg',
  } as any);

  const response = serviceUpdateAvatar(formData)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      return undefined;
    });
  return response;
};

export const uploadNewCover = async (image: string) => {
  const formData = new FormData();
  const uri = Platform.OS === 'android' ? image : image.replace('file://', '');
  formData.append('file', {
    uri,
    name: 'avatar.jpg',
    type: 'image/jpeg',
  } as any);

  const response = serviceUpdateCover(formData)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      return undefined;
    });
  return response;
};

export const getImageExtension = (uri: string) => {
  return uri.split('.')[1];
};

const extractPrefix = (url: string) => {
  const match = url.match(/^(https?:\/\/[^/]+)/);
  return match ? match[1] : '';
};

export const getSeperateImageUrls = (url: string | null) => {
  if (!url || url === null) return '';
  const urls = url.split(';');
  const prefix = extractPrefix(urls[0]);
  const imageUrls = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i].trim();
    if (url.startsWith('/')) {
      imageUrls.push(prefix + url);
    } else {
      imageUrls.push(url);
    }
  }
  return imageUrls.filter((url) => url !== '');
};
