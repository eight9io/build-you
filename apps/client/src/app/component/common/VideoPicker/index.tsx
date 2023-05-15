import React, { useState, useEffect, FC } from 'react';
import { Image, View, TouchableOpacity, Text } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';

import CameraIcon from './asset/camera-icon.svg';

interface IVideoPickerProps {}

const renderPickedVideo = (pickedVideo: any) => {
  return (
    <View className="h-36 w-full">
      <Image
        source={{ uri: pickedVideo[0] }}
        className="h-full w-full rounded-xl"
      />
    </View>
  );
};

const VideoPicker: FC<IVideoPickerProps> = () => {
  const [pickedVideo, setPickedVideo] = useState<string[]>([]);
  const [thumbnailImage, setThumbnailImage] = useState<string>();

  const generateThumbnail = async ( video: string ) => {
    try {
      console.log(video)
      const { uri } = await VideoThumbnails.getThumbnailAsync(video);
      setThumbnailImage(uri);
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
      {pickedVideo.length > 0 && (
        <View className="h-[108px] w-[108px]">
          <Image
            source={{ uri: thumbnailImage as any }}
            className="h-full w-full rounded-xl"
          />
        </View>
      )}
      <TouchableOpacity
          onPress={pickVideo} className="bg-gray-light mt-5 h-16 rounded-xl">
        <View
          className=" mt-5 flex flex-row items-center justify-center rounded-xl"
        >
          <CameraIcon />
          <Text className="text-black-light ml-1.5 mt-1 text-sm font-semibold">
            Upload image
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default VideoPicker;
