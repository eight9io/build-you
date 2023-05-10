import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import clsx from 'clsx';

interface IProfileAvartarProps {
  src: string;
  onPress?: () => void;
}

const ProfileAvartar:React.FC<IProfileAvartarProps> = ({
  src,
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
            className={clsx('h-[101px] w-[101px] rounded-full border-4 border-white')}
            source={imageSource}
            alt='profile image'
          />
          <Image 
            className={clsx('h-[28px] w-[28px] rounded-full absolute bottom-1 right-[-5px]')}
            source={require('./asset/camera.png')}
          />
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default ProfileAvartar