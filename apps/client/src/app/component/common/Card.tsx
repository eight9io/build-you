import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
interface ICardProps {
  isPost?: boolean;
  itemCard: { title: string; builder: string; image: string };
}

export default function Card({
  isPost,
  itemCard: { title, builder, image },
}: ICardProps) {
  const { t } = useTranslation();
  return (
    <View className="border-gray-light   rounded-2xl border-[1px] ">
      <Image
        source={{ uri: `${image}` }}
        // className=" h-[150px] w-full  rounded-t-2xl"
        className={clsx('h-[150px] w-full  ', isPost ? 'rounded-t-2xl' : 0)}
        resizeMode="cover"
      />
      {isPost && (
        <View className=" flex-row  items-center  justify-between rounded-b-2xl px-5 py-3">
          <View>
            <Text className="text-h6  font-[500px] leading-6 ">{title}</Text>
            <Text className="text-gray-dark  text-xs font-[500px] leading-6">
              {t('card.builder')}: {builder}
            </Text>
          </View>

          <TouchableOpacity onPress={() => console.log('press')}>
            <Svg width="10" height="18" viewBox="0 0 10 18" fill="none">
              <Path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.292893 0.292893C0.683417 -0.0976311 1.31658 -0.0976311 1.70711 0.292893L9.70711 8.29289C10.0976 8.68342 10.0976 9.31658 9.70711 9.70711L1.70711 17.7071C1.31658 18.0976 0.683417 18.0976 0.292893 17.7071C-0.0976311 17.3166 -0.0976311 16.6834 0.292893 16.2929L7.58579 9L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683417 0.292893 0.292893Z"
                fill="#FF7B1C"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
