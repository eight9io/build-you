import React, { useState, useEffect, FC } from 'react';
import { Image, View, TouchableOpacity, Text } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';

import CameraIcon from './asset/camera-icon.svg';
import { getRandomId } from '../../../utils/common';
import clsx from 'clsx';

import PlayButton from './asset/play-button.svg';
import CloseButton from './asset/close-button.svg';

interface IVideoPickerProps {
  isSelectedImage?: boolean | null;
  useBigImage?: boolean;
  setExternalVideo?: (video: any) => void;
  setIsSelectedImage?: (isSelected: boolean) => void;
  removeVideo?: () => void;
}

const VideoPicker: FC<IVideoPickerProps> = ({
  isSelectedImage = false,
  useBigImage = false,
  setExternalVideo,
  setIsSelectedImage,
  removeVideo,
}) => {
  const [pickedVideo, setPickedVideo] = useState<string[]>([]);
  const [thumbnailImage, setThumbnailImage] = useState<string>();

  const generateThumbnail = async (video: string) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(video);
      if (setExternalVideo && setIsSelectedImage) {
        const id = getRandomId();
        setExternalVideo([{ id, uri }]);
        setIsSelectedImage(false);
        return;
      }
      if (setExternalVideo) {
        const id = getRandomId();
        setExternalVideo([{ id, uri }]);
        setThumbnailImage(uri);
        return;
      }
      setThumbnailImage(uri);
    } catch (e) {
      console.error('generateThumbnail', e);
    }
  };
  useEffect(() => {
    if (!pickedVideo.length) return;
    generateThumbnail(pickedVideo[0]);
  }, [pickedVideo]);

  const pickVideo = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      setPickedVideo(result.assets.map((asset) => asset.uri));
    }
  };

  const removeLocalVideo = () => {
    setPickedVideo([]);
    removeVideo && removeVideo();
  };

  return (
    <View className="flex flex-col">
      {useBigImage && pickedVideo.length > 0 && !setExternalVideo && (
        <View className="h-[108px] w-[108px]">
          <Image
            source={{ uri: thumbnailImage as any }}
            className="h-full w-full rounded-xl"
          />
        </View>
      )}

      {useBigImage && pickedVideo.length > 0 && (
        <View className="relative h-[138px] w-full">
          <Image
            source={{ uri: thumbnailImage as any }}
            className="h-full w-full rounded-xl"
          />
          <View className="absolute left-1/2 top-[60px] ml-[-10px]">
            <PlayButton />
          </View>
          <TouchableOpacity
            className="absolute right-4 top-4"
            onPress={removeLocalVideo}
          >
            <CloseButton />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        onPress={pickVideo}
        className="bg-gray-light mt-5 flex h-14 flex-row items-center justify-center rounded-xl "
        disabled={!!isSelectedImage}
      >
        <View className="flex flex-row items-center justify-center rounded-xl">
          <CameraIcon fill={!isSelectedImage ? '#1C1B1F' : '#C5C8D2'} />
          <Text
            className={clsx(
              'text-black-light ml-1.5 text-sm font-semibold',
              isSelectedImage && 'text-gray-medium'
            )}
          >
            Upload a video
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default VideoPicker;
