import * as ExpoImagePicker from 'expo-image-picker';
import httpInstance from './http';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

interface PickImageOptions {
  allowsMultipleSelection?: boolean;
  base64?: boolean;
  maxImages?: number;
}
export const getImageFromUserDevice = (props: PickImageOptions) => {
  const { allowsMultipleSelection, base64 } = props;
  return async () => {
    const { status } =
      await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      // TODO: add to global dialog
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: allowsMultipleSelection ? false : true,
      aspect: [4, 3],
      quality: 1,
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

  const response = await httpInstance.post('/user/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadNewCover = async (image: string) => {
  const formData = new FormData();
  const uri = Platform.OS === 'android' ? image : image.replace('file://', '');
  formData.append('file', {
    uri,
    name: 'avatar.jpg',
    type: 'image/jpeg',
  } as any);

  const response = await httpInstance.post('/user/cover', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
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
