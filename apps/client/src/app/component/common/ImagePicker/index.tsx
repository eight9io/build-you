import { useState, FC, useEffect } from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import clsx from 'clsx';

import CameraIcon from './asset/camera-icon.svg';
import {
  getImageExtension,
  getImageFromUserDevice,
} from '../../../utils/uploadUserImage';
import Close from '../../asset/close.svg';
import Button from '../Buttons/Button';
import { ImagePickerAsset } from 'expo-image-picker';
interface IImagePickerProps {
  images?: string[];
  allowsMultipleSelection?: boolean;
  isSelectedImage?: boolean | null;
  onImagesSelected: (images: string[]) => void;
  onRemoveSelectedImage?: (index: number) => void;
  setIsSelectedImage?: (isSelected: boolean) => void;
  base64?: boolean;
}

const ImagePicker: FC<IImagePickerProps> = ({
  images,
  onImagesSelected,
  onRemoveSelectedImage,
  setIsSelectedImage,
  isSelectedImage,
  allowsMultipleSelection = false,
  base64,
}) => {
  const pickImageFunction = getImageFromUserDevice({
    allowsMultipleSelection,
    base64,
  });

  const handlePickImage = async () => {
    const result = await pickImageFunction();
    if (result && !result.canceled) {
      const imagesPicked = result.assets.map((asset) => asset.uri);
      onImagesSelected(imagesPicked);
      if (setIsSelectedImage) setIsSelectedImage(true);
    }
  };

  const handleRemoveSelectedImage = (index: number) => {
    if (onRemoveSelectedImage) {
      onRemoveSelectedImage(index);
    }
  };
  return (
    <View className="flex flex-col">
      {/* {images && images.length === 1 && (
        <View className="h-36 w-full">
          <Image
            source={{ uri: images[0] }}
            className="h-full w-full rounded-xl"
          />
        </View>
      )} */}
      {images && images.length > 0 && (
        <View className="flex flex-row flex-wrap justify-start gap-2 pt-5">
          {images.map((uri, index) => (
            <View
              key={index}
              className="relative aspect-square"
              style={{ width: 100 }}
            >
              {onRemoveSelectedImage && (
                <View className="absolute right-1 top-2 z-10">
                  <Button
                    onPress={() => handleRemoveSelectedImage(index)}
                    Icon={<Close fill={'white'} />}
                  />
                </View>
              )}
              <Image
                source={{
                  uri,
                }}
                className="h-full w-full rounded-xl"
              />
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        onPress={handlePickImage}
        disabled={
          isSelectedImage !== undefined && isSelectedImage === false
            ? true
            : false
        }
        className="bg-gray-light mt-5 h-16 rounded-xl"
      >
        <View className=" mt-5 flex flex-row items-center justify-center rounded-xl">
          <CameraIcon
            fill={
              isSelectedImage || isSelectedImage == null ? '#1C1B1F' : '#C5C8D2'
            }
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
