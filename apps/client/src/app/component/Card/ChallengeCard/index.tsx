import React from 'react';
import {
  View,
  Text,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
} from 'react-native';
import clsx from 'clsx';
import { getImageFromUrl } from 'apps/client/src/app/hooks/getImageFromUrl';

import BackSvg from './asset/back.svg';
import Button from '../../common/Buttons/Button';

interface IChallengeCardProps {
  name: string;
  description: string;
  imageSrc: string;
  authorName: string;
  navigation?: any;
}

const ChallengeCard: React.FC<IChallengeCardProps> = ({
  name,
  description,
  imageSrc,
  authorName,
  navigation,
}) => {
  const [imageSource, loading, error] = getImageFromUrl(imageSrc);

  const onPress = () => {
    if (navigation) navigation.navigate('PersonalChallengeDetailScreen');
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={clsx('border-gray-80 mb-5 w-full rounded-xl border bg-white')}
    >
      <Image
        className={clsx('h-[138px] w-full rounded-t-xl')}
        source={imageSource as ImageSourcePropType}
      />
      <View
        className={clsx('flex flex-row items-center justify-between px-4 py-3')}
      >
        <View className={clsx('')}>
          <Text className={clsx('text-h6 font-semibold leading-6')}>
            {name}
          </Text>
          <Text className={clsx('text-gray-dark text-sm')}>{description}</Text>
        </View>
        <BackSvg />
      </View>
    </TouchableOpacity>
  );
};

export default ChallengeCard;
