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
  onImagesSelected?: (images: string[]) => void;
  onRemoveSelectedImage?: (index: number) => void;
  setIsSelectedImage?: (isSelected: boolean) => void;
  base64?: boolean;
  isDisabled?: boolean;
}

const ImagePicker: FC<IImagePickerProps> = ({
  images,
  onImagesSelected,
  onRemoveSelectedImage,
  setIsSelectedImage,
  isSelectedImage,
  allowsMultipleSelection = false,
  base64,
  isDisabled = false,
}) => {
  const pickImageFunction = getImageFromUserDevice({
    allowsMultipleSelection,
    base64,
    maxImages: 3,
  });

  const handlePickImage = async () => {
    const result = await pickImageFunction();
    if (result && !result.canceled) {
      const imagesPicked = result.assets.map((asset) => asset.uri);
      onImagesSelected && onImagesSelected(imagesPicked);
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
      {images && images.length > 0 && (
        <View className="flex flex-row flex-wrap justify-start gap-2 pt-5">
          {images.map((uri, index) => (
            <View
              key={index}
              className="relative aspect-square"
              style={{ width: 100 }}
            >
              {onRemoveSelectedImage && (
                <View className="absolute right-0 top-0 z-10">
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
          (isSelectedImage !== undefined && isSelectedImage === false) ||
          isDisabled
            ? true
            : false
        }
        className="bg-gray-light mt-5 flex h-14 flex-row items-center justify-center rounded-xl"
      >
        <CameraIcon
          fill={
            (isSelectedImage || isSelectedImage == null) && !isDisabled
              ? '#1C1B1F'
              : '#C5C8D2'
          }
        />
        <Text
          className={clsx(
            'text-black-light ml-1.5 mt-1 text-sm font-semibold',
            (isSelectedImage === false || isDisabled) && 'text-gray-medium'
          )}
        >
          Upload image
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ImagePicker;
