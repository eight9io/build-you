import React from "react";
import { ActivityIndicator, Text, View, Image } from "react-native";
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
    <View className="relative h-full w-full">
      <Image
        source={{ uri: imageSrc }}
        className="aspect-square h-full w-full rounded-xl"
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
            containerStyle: {
              shadowColor: "rgba(12, 15, 57, 0.16)",
              shadowOffset: {
                width: 0,
                height: 0.5,
              },
              shadowOpacity: 3,
              shadowRadius: 2,
              elevation: 1,
              borderRadius: 100,
            },
          },
          // dotsWrapperStyle: {
          //   shadowColor: "rgba(12, 15, 57, 0.16)",
          //   shadowOffset: {
          //     width: 0,
          //     height: 0.5,
          //   },
          //   shadowOpacity: 1,
          //   shadowRadius: 2,
          //   elevation: 1,
          // },
        }}
        controlsEnabled={Array.isArray(imageSrc) && imageSrc.length > 1}
        gesturesEnabled={() => Array.isArray(imageSrc) && imageSrc.length > 1}
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
