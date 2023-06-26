import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { clsx } from 'clsx';

import Card from '../common/Card';
import PostAvatar from '../common/Avatar/PostAvatar';
import LikeButton from './LikeButton';
import CommentButton from './CommentButton';
import GlobalDialogController from '../common/Dialog/GlobalDialogController';

import BackSvg from '../asset/back.svg';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/navigation.type';
import { useAuthStore } from '../../store/auth-store';
import { useTranslation } from 'react-i18next';

interface IFeedPostCardProps {
  itemFeedPostCard: {
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
  };
}

interface IChallengeImageProps {
  name: string;
  image: string;
  onPress: () => void;
}

const ChallengeImage: FC<IChallengeImageProps> = ({ name, image, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={clsx('border-gray-80 w-full rounded-xl border bg-white')}
    >
      <View className={clsx('relative w-full')}>
        <Image
          className={clsx('aspect-square w-full rounded-t-xl')}
          source={{ uri: image }}
        />
        <View
          className={clsx(
            'flex flex-row items-center justify-between px-4 py-3'
          )}
        >
          <View className={clsx('flex flex-row items-center')}>
            <Text className={clsx('text-h6 pl-2 font-semibold leading-6')}>
              {name}
            </Text>
          </View>
          <BackSvg />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const FeedPostCard: React.FC<IFeedPostCardProps> = ({
  itemFeedPostCard: { id, name, time, stt, card, like, comment, avatar },
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { getAccessToken } = useAuthStore();

  const isToken = getAccessToken();
  const { t } = useTranslation();

  const navigateToUserProfile = () => {
    if (!id) {
      GlobalDialogController.showModal(
        t('error_general_message') ||
        'Something went wrong. Please try again later!'
      );
      return;
    }
    navigation.navigate('OtherUserProfileScreen', { userId: id });
  };

  return (
    <View className="mb-1 flex-1">
      <View className="bg-gray-50 p-5">
        <TouchableOpacity
          className="mb-3 flex-row justify-between"
          onPress={navigateToUserProfile}
        >
          <View className="flex-row">
            <PostAvatar src="https://picsum.photos/200/300" onPress={navigateToUserProfile} />
            <View className="ml-2">
              <Text className="text-h6 font-bold">{name}</Text>
              <Text className="text-gray-dark text-xs font-light ">{time}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <Text className=" text-md mb-3 font-normal leading-5">{stt}</Text>
        <ChallengeImage
          name={card.title}
          image={card.image}
        // onPress={
        //   isToken
        //     ? () =>
        //         navigation.navigate('ChallengeDetailScreenViewOnly', {
        //           challengeId: '1',
        //         })
        //     : () => navigation.navigate('LoginScreen')
        // }
        />
        <View className="mt-4 flex-row">
          <LikeButton progressId={id} />
          <CommentButton
            navigationToComment={
              isToken
                ? () =>
                  navigation.navigate('ProgressCommentScreen', {
                    progressId: '1',
                  })
                : () => navigation.navigate('LoginScreen')
            }
            progressId={id}
          />
        </View>
      </View>
      <View className="bg-gray-light h-2 w-full" />
    </View>
  );
};

export default FeedPostCard;
