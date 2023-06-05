import * as ExpoImagePicker from 'expo-image-picker';
import httpInstance from './http';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

interface PickImageOptions {
  allowsMultipleSelection?: boolean;
}
export const getImageFromUserDevice = (props: PickImageOptions) => {
  const { allowsMultipleSelection } = props;
  return async () => {
    const { status } =
      await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection,
    });

    if (!result.canceled) {
      return result;
    }
    return null;
  };
};

export const uploadNewAvatar = async (image: string) => {
  // set multipart/form-data as content type, on swagger only accept this type, and the field name is 'file'
  const formData = new FormData();
  console.log(image);
  formData.append('file', image);
  const response = await httpInstance.post('/user/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      boundary: '----WebKitFormBoundary7MA4YWxkTrZu0gW',
    },
  });
  console.log(response);
  return response;
};
