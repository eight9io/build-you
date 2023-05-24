import { clsx } from 'clsx';
import React, { useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import CameraSvg from './asset/camera.svg';

interface ICoverImageProps {
  src: string;
}

const CoverImage: React.FC<ICoverImageProps> = ({ src }) => {
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
    <View className={clsx('relative overflow-hidden')}>
      <Image
        className={clsx('h-[115px]')}
        source={imageSource}
      />
      <View className={clsx('absolute top-3 right-4')}>
        <CameraSvg />
      </View>
    </View>
  );
};

export default CoverImage;
