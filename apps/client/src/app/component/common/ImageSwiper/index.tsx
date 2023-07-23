import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Image } from 'expo-image';
import Swiper from 'react-native-swiper';

interface IImageSwiperProps {
  imageSrc: string[] | string | null;
}

const ImageItem = ({ imageSrc }: { imageSrc: string }) => {
  const [isImageLoading, setIsImageLoading] = React.useState<boolean>(true);

  const onLoadEnd = () => {
    setTimeout(() => {
      setIsImageLoading(false);
    }, 300);
  };

  return (
    <View className="relative w-full">
      <Image
        source={{ uri: imageSrc }}
        className="aspect-square w-full rounded-xl"
        onLoadEnd={onLoadEnd}
      />
      {isImageLoading && (
        <View className="absolute left-0 top-0 h-full w-full flex-row items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      )}
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
          <ImageItem imageSrc={imageSrc.trim()} />
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
