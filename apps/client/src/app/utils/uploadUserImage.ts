import * as ExpoImagePicker from 'expo-image-picker';
import httpInstance from './http';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

interface PickImageOptions {
  allowsMultipleSelection?: boolean;
  base64?: boolean;
}
export const getImageFromUserDevice = (props: PickImageOptions) => {
  const { allowsMultipleSelection, base64 } = props;
  return async () => {
    const { status } =
      await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: allowsMultipleSelection ? false : true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection,
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

export const getImageExtension = (uri: string) => {
  return uri.split('.')[1];
}