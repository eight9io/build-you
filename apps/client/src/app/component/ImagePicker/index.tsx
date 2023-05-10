import React, { useState, useEffect, FC } from 'react';
import {
  Button,
  Image,
  View,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';

interface IImagePickerProps {}
const ImagePicker: FC<IImagePickerProps> = () => {
  const [images, setImages] = useState<string[]>([]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      setImages(result.assets.map((asset) => asset.uri));
    }
  };

  return (
    <View>
      {images.length > 0 ? (
        <View className="relative">
          <Image source={{ uri: images[0] }} className="h-full w-full" />
          <View className="absolute h-full w-full">
            <TouchableOpacity
              onPress={pickImage}
              className="flex h-full w-full flex-col items-center justify-center"
            >
              <Image
                source={require('./asset/camera-icon.png')}
                className="h-11 w-11"
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={pickImage}
          className="flex h-full flex-col items-center justify-center"
        >
          <Image
            source={require('./asset/camera-icon.png')}
            className="h-11 w-11"
          />
          <Text className="text-primary-default mt-2 text-sm font-medium">
            Upload one or more photos
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ImagePicker;
