import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import clsx from 'clsx';


interface INotiAvartarProps {
  size?: 'small' | 'medium' | 'large';
  src: string;
  alt?: string;
  typeOfNoti?: 'comment' | 'follow';
  onPress?: () => void;
}

const NotiAvartar:React.FC<INotiAvartarProps> = ({
  size = 'medium',
  src,
  alt,
  typeOfNoti,
  onPress,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [imageSource, setImageSource] = useState<{}>({});

  const imageSourceFromAssets = typeOfNoti === 'comment' ? require('./asset/comment.png') : require('./asset/follow.png');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(src);
        const imageData = await response.blob();
        setImageSource({ uri: URL.createObjectURL(imageData)});
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(true);
        setLoading(false);
      }
    };

    fetchImage();
  }, [src]);

  return (
    <View className={clsx('flex flex-row items-center')}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
      >
        <View className={clsx('relative')}>
          <Image
            className={clsx('h-[57px] w-[57px] rounded-full')}
            source={imageSource}
          />
          <Image 
            className={clsx('h-[28px] w-[28px] rounded-full absolute bottom-0 right-0')}
            source={imageSourceFromAssets}
          />
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default NotiAvartar