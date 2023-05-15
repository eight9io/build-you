import React, { useState, useEffect, FC } from 'react';
import {
  Image,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import CameraIcon from './asset/camera-icon.svg';

interface IImagePickerProps {
  allowsMultipleSelection?: boolean;
}

const ImagePicker: FC<IImagePickerProps> = ({
  allowsMultipleSelection = false,
}) => {
  const [images, setImages] = useState<string[]>([]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: allowsMultipleSelection,
    });

    if (!result.canceled) {
      setImages(result.assets.map((asset) => asset.uri));
    }
  };

  return (
    <View className="flex flex-col">
      {images.length > 0 && (
        <View className="h-36 w-full">
          <Image
            source={{ uri: images[0] }}
            className="h-full w-full rounded-xl"
          />
        </View>
      )}
      <View className="bg-gray-light mt-5 h-16 rounded-xl">
        <TouchableOpacity
          onPress={pickImage}
          className=" mt-5 flex flex-row items-center justify-center rounded-xl"
        >
          <CameraIcon />
          <Text className="text-black-light ml-1.5 mt-1 text-sm font-semibold">
            Upload image
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ImagePicker;
