import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import Swiper from 'react-native-swiper';

interface IImageSwiperProps {
  imageSrc: string[] | string | null;
}

const ImageItem = ({ imageSrc }: { imageSrc: string }) => {
  return (
    <View className="">
      <Image
        source={{ uri: imageSrc }}
        className="aspect-square w-full rounded-xl"
      />
    </View>
  );
};

const ImageSwiper: React.FC<IImageSwiperProps> = ({ imageSrc }) => {
  if (!imageSrc) return null;
  return (
    <View className="flex-1 ">
      <Swiper
        loop={false}
        showsButtons={false}
        showsPagination={true}
        autoplay={false}
        dotColor="white"
        activeDotColor="#FF7B1C"
        snapToAlignment="center"
        containerStyle={{ width: '100%', height: '100%' }}
      >
        {typeof imageSrc === 'string' ? (
          <ImageItem imageSrc={imageSrc} />
        ) : (
          imageSrc.map((item, index) => (
            <ImageItem imageSrc={item.trim()} key={index} />
          ))
        )}
      </Swiper>
    </View>
  );
};

export default ImageSwiper;
