import React, { useState, useEffect, FC } from 'react';
import { Image, View, TouchableOpacity, Text } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';

import CameraIcon from './asset/camera-icon.svg';
import { getRandomId } from '../../../utils/common';
import clsx from 'clsx';

interface IVideoPickerProps {
  isSelectedImage?: boolean | null;
  setExternalVideo?: (video: any) => void;
  setIsSelectedImage?: (isSelected: boolean) => void;
}

const VideoPicker: FC<IVideoPickerProps> = ({
  isSelectedImage = false,
  setExternalVideo,
  setIsSelectedImage,
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
      } else {
        setThumbnailImage(uri);
      }
    } catch (e) {
      console.log(e);
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

  return (
    <View className="flex flex-col">
      {pickedVideo.length > 0 && !setExternalVideo && (
        <View className="h-[108px] w-[108px]">
          <Image
            source={{ uri: thumbnailImage as any }}
            className="h-full w-full rounded-xl"
          />
        </View>
      )}
      <TouchableOpacity
        onPress={pickVideo}
        className="bg-gray-light mt-5 h-16 rounded-xl"
        disabled={!!isSelectedImage}
      >
        <View className="mt-5 flex flex-row items-center justify-center rounded-xl">
          <CameraIcon fill={(!isSelectedImage) ? '#1C1B1F' : '#C5C8D2'} />
          <Text
            className={clsx(
              'text-black-light ml-1.5 mt-1 text-sm font-semibold',
              (isSelectedImage) && 'text-gray-medium'
            )}
          >
            Upload video
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default VideoPicker;
