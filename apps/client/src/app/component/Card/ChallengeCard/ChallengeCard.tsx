import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
} from 'react-native';
import clsx from 'clsx';

import { IChallenge } from '../../../types/challenge';
import { getImageFromUrl } from '../../../hooks/getImageFromUrl';
import { getChallengeStatusColor } from '../../../utils/common';

import CheckCircle from '../../asset/check_circle.svg';
import BackSvg from '../../asset/back.svg';

interface IChallengeCardProps {
  item: IChallenge;
  isCompany?: boolean;
  imageSrc: string | null | undefined;
  navigation?: any;
  handlePress?: () => void;
}

const CompanyTag = () => {
  return (
    <View className="bg-primary-default flex h-8 w-1/3 flex-row items-center rounded-l-md">
      <View className="mx-2 h-[20px] w-[20px] rounded-full bg-gray-200 py-1"></View>
      <Text className="text-md font-normal text-white">Company</Text>
    </View>
  );
};

const ChallengeCard: React.FC<IChallengeCardProps> = ({
  item,
  imageSrc,
  isCompany,
  navigation,
  handlePress,
}) => {

  const [loading, setLoading] = useState<boolean>(true);
  const [imageLoadingError, setImageLoadingError] = useState<boolean>(false);
  const onPress = () => {
    // handlePress or navigation
    if (navigation) {
      if (isCompany) navigation.navigate('CompanyChallengeDetailScreen');
      else
        navigation.navigate('PersonalChallengeDetailScreen', {
          challengeId: item.id,
        });
      return;
    }
    if (handlePress) handlePress();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={clsx('border-gray-80 mb-5 w-full rounded-xl border bg-white')}
    >
      <View className={clsx('relative w-full')}>
        {isCompany && (
          <View className={clsx('absolute top-6 z-10 flex w-full items-end')}>
            <CompanyTag />
          </View>
        )}
        {imageSrc && !imageLoadingError && (
          <Image
            className={clsx('aspect-square w-full rounded-t-xl')}
            source={{ uri: imageSrc }}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onError={(err) => {
              setLoading(false);
              setImageLoadingError(true);
            }}
          />
        )}
        {imageLoadingError && (
          <View className={clsx('aspect-square w-full rounded-t-xl')}>
            <Image
              className={clsx('aspect-square w-full rounded-t-xl')}
              source={{
                uri: `https://picsum.photos/200/300.webp?random=${item.id}`,
              }}
            />
          </View>
        )}
        <View
          className={clsx(
            'flex flex-row items-center justify-between px-4 py-3'
          )}
        >
          <View className={clsx('flex flex-row items-center')}>
            <CheckCircle fill={getChallengeStatusColor(item.status)} />
            <Text className={clsx('text-h6 pl-2 font-semibold leading-6')}>
              {item?.goal}
            </Text>
          </View>
          <BackSvg />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChallengeCard;
