import React, { useState, useEffect, FC } from 'react';
import { Image, View, TouchableOpacity, Text } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import clsx from 'clsx';

import CameraIcon from './asset/camera-icon.svg';

import { getImageFromUserDevice } from '../../../utils/pickImage';
import { getRandomId } from '../../../utils/common';
import { IUploadMediaWithId } from '../../../types/media';

interface IImagePickerProps {
  allowsMultipleSelection?: boolean;
  isSelectedImage?: boolean | null;
  setExternalImages?: (images: any) => void;
  setIsSelectedImage?: (isSelected: boolean) => void;
}

const ImagePicker: FC<IImagePickerProps> = ({
  setExternalImages,
  setIsSelectedImage,
  isSelectedImage = false,
  allowsMultipleSelection = false,
}) => {
  const [images, setImages] = useState<string[]>([]);

  const pickImageFunction = getImageFromUserDevice({
    allowsMultipleSelection,
  });

  const handlePickImage = async () => {
    const result = await pickImageFunction();
    if (result && !result.canceled) {
      if (setExternalImages && setIsSelectedImage) {
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
      {images.length > 0 && setExternalImages && (
        <View className="flex flex-row flex-wrap justify-start gap-2 pt-5">
          {images.map((image: any) => (
            <View className="relative aspect-square" style={{ width: 100 }}>
              <View className="absolute right-1 top-2 z-10">
                <TouchableOpacity onPress={() => setImages([])}>
                  {/* <CloseButton fill={'white'} />

                  <Button
                    onPress={() => handleRemoveItem(media.id)}
                    Icon={<Close fill={'white'} />}
                  /> */}
                </TouchableOpacity>
              </View>
              <Image
                source={{ uri: image as any }}
                className="h-full w-full rounded-xl"
              />
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        onPress={handlePickImage}
        disabled={isSelectedImage === false}
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
