import React from 'react';
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
  imageSrc: string;
  navigation?: any;
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
}) => {
  const [imageSource, loading, error] = getImageFromUrl(imageSrc);

  const onPress = () => {
    if (navigation) {
      if (isCompany) navigation.navigate('CompanyChallengeDetailScreen');
      else
        navigation.navigate('PersonalChallengeDetailScreen', {
          challengeId: item.id,
        });
    }
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
        <Image
          className={clsx('aspect-square w-full rounded-t-xl')}
          source={imageSource as ImageSourcePropType}
        />
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
