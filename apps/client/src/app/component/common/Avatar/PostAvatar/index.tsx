import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import clsx from 'clsx';

interface IPostAvatarProps {
  src: string;
  alt?: string;
  onPress?: () => void;
}

const PostAvatar: React.FC<IPostAvatarProps> = ({
  src,
  alt,
  onPress,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [imageSource, setImageSource] = useState<{}>({});

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(src);
        const imageData = await response.blob();
        setImageSource({ uri: URL.createObjectURL(imageData) });
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
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <View className={clsx('relative')}>
          <Image
            className={clsx('h-[32px] w-[32px] rounded-full')}
            source={imageSource}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default PostAvatar;
