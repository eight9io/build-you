import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import React, { FC } from 'react';
import { clsx } from 'clsx';
import IconDot from './asset/dot.svg';
import Card from '../common/Card';
import PostAvatar from '../common/Avatar/PostAvatar';
import LikeButton from './LikeButton';
import CommentButton from './CommentButton';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/navigation.type';

interface IChallengeProgressCardProps {
  item: {
    id: string;
    name: string;
    time: string;
    stt: string;
    card: {
      image: string;
      title: string;
      builder: string;
    };
    like: number;
    comment: number;
    avatar: string;
    location: string;
  };
}

interface IChallengeImageProps {
  name: string;
  image: string;
  onPress: () => void;
}

const ChallengeImageForComment: FC<IChallengeImageProps> = ({
  name,
  image,
  onPress,
}) => {
  return (
    <View className={clsx('border-gray-80 w-full rounded-xl border bg-white')}>
      <View className={clsx('relative w-full')}>
        <Image
          className={clsx('aspect-square w-full rounded-xl')}
          source={{ uri: image }}
        />
      </View>
    </View>
  );
};

export const ChallengeProgressCardForComment: React.FC<
  IChallengeProgressCardProps
> = ({
  item: { id, name, time, stt, card, like, comment, avatar, location },
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const navigationToComment = () => {
    navigation.navigate('ChallengeDetailComment', {
      challengeId: id,
    });
  };

  return (
    <View className="mb-1 flex-1">
      <View className="bg-white p-5">
        <View className="mb-3 flex-row justify-between">
          <View className="flex-row">
            <PostAvatar src="https://picsum.photos/200/300" />
            <View className="ml-2">
              <Text className="text-h6 font-bold">{name}</Text>
              <View className="flex-row gap-3">
                <Text className="text-gray-dark text-xs font-light ">
                  {time}
                </Text>
                <Text className="text-gray-dark text-xs font-light ">
                  <IconDot fill={'#7D7E80'} /> {location}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <Text className=" text-md mb-3 font-normal leading-5">{stt}</Text>
        <ChallengeImageForComment
          name={card.title}
          image={card.image}
          onPress={navigationToComment}
        />
        <View className="mt-4 flex-row">
          <LikeButton likes={like} />
          <CommentButton
            isViewOnly={true}
            navigationToComment={navigationToComment}
          />
        </View>
      </View>
      {/* <View className="bg-gray-light h-2 w-full" /> */}
    </View>
  );
};

const ChallengeImage: FC<IChallengeImageProps> = ({ name, image, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={clsx('border-gray-80 w-full rounded-xl border bg-white')}
    >
      <View className={clsx('relative w-full')}>
        <Image
          className={clsx('aspect-square w-full rounded-xl')}
          source={{ uri: image }}
        />
      </View>
    </TouchableOpacity>
  );
};

const ChallengeProgressCard: React.FC<IChallengeProgressCardProps> = ({
  item: { id, name, time, stt, card, like, comment, avatar },
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const navigationToComment = () => {
    navigation.navigate('ChallengeDetailComment', {
      challengeId: id,
    });
  };

  return (
    <View className="mb-1 flex-1">
      <View className="bg-gray-50 p-5">
        <View className="mb-3 flex-row justify-between">
          <View className="flex-row">
            <PostAvatar src="https://picsum.photos/200/300" />
            <View className="ml-2">
              <Text className="text-h6 font-bold">{name}</Text>
              <Text className="text-gray-dark text-xs font-light ">{time}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => console.log('press')}>
            <Text className="text-h6 font-medium ">...</Text>
          </TouchableOpacity>
        </View>
        <Text className=" text-md mb-3 font-normal leading-5">{stt}</Text>
        <ChallengeImage
          name={card.title}
          image={card.image}
          onPress={navigationToComment}
        />
        <View className="mt-4 flex-row">
          <LikeButton likes={like} />
          <CommentButton navigationToComment={navigationToComment} />
        </View>
      </View>
      <View className="bg-gray-light h-2 w-full" />
    </View>
  );
};

export default ChallengeProgressCard;
