import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Image } from "expo-image";
import Swiper from "react-native-web-swiper";

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
    <View className="flex-1">
      <Swiper
        controlsProps={{
          nextTitleStyle: {
            display: "none",
          },
          prevTitleStyle: {
            display: "none",
          },
          dotActiveStyle: {
            backgroundColor: "#FF7B1C",
          },
          dotProps: {
            badgeStyle: {
              backgroundColor: "#FFFFFF",
            },
          },
          dotsWrapperStyle: {
            shadowColor: "#0C0F39",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.1,
            shadowRadius: 1,
          },
        }}
      >
        {typeof imageSrc === "string" ? (
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
