import React, { useState, useEffect, FC } from 'react';
import { Image, View, TouchableOpacity, Text } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import CameraIcon from './asset/camera-icon.svg';

import { getRandomId } from '../../../utils/common';
import { IUploadMediaWithId } from '../../../types/media';
import clsx from 'clsx';

interface IImagePickerProps {
  allowsMultipleSelection?: boolean;
  isSelectedImage?: boolean | null;
  setExternalImages?: (images: any) => void;
  setIsSelectedImage?: (isSelected: boolean) => void;
}

const ImagePicker: FC<IImagePickerProps> = ({
  allowsMultipleSelection = false,
  isSelectedImage = false,
  setExternalImages,
  setIsSelectedImage,
}) => {
  const [images, setImages] = useState<string[]>([]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: allowsMultipleSelection,
    });

    if (!result.canceled) {
      if (setExternalImages && setIsSelectedImage) {
        // for each image in result.assets, we get the uri, generate an id and push it to the array
        result.assets.forEach((asset) => {
          const id = getRandomId();
          setExternalImages((prev: IUploadMediaWithId[]) => [
            ...prev,
            { id, uri: asset.uri },
          ]);
          setIsSelectedImage(true);
        });
      }
      setImages(result.assets.map((asset) => asset.uri));
    }
  };

  return (
    <View className="flex flex-col">
      {images.length > 0 && !setExternalImages && (
        <View className="h-36 w-full">
          <Image
            source={{ uri: images[0] }}
            className="h-full w-full rounded-xl"
          />
        </View>
      )}
      <TouchableOpacity
        onPress={pickImage}
        disabled={isSelectedImage === false}
        className="bg-gray-light mt-5 h-16 rounded-xl"
      >
        <View className=" mt-5 flex flex-row items-center justify-center rounded-xl">
          <CameraIcon
            fill={isSelectedImage || isSelectedImage == null ? '#1C1B1F' : '#C5C8D2'}
          />
          <Text
            className={clsx(
              'text-black-light ml-1.5 mt-1 text-sm font-semibold',
              isSelectedImage === false && 'text-gray-medium'
            )}
          >
            Upload image
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ImagePicker;
