import { View, Text, TouchableOpacity } from 'react-native';
import React, { FC } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';

import { IFeedPostProps } from '../../types/common';
import { RootStackParamList } from '../../navigation/navigation.type';

import { useAuthStore } from '../../store/auth-store';
import { getTimeDiffToNow } from '../../utils/time';

import PostAvatar from '../common/Avatar/PostAvatar';
import LikeButton from './LikeButton';
import CommentButton from './CommentButton';
import GlobalDialogController from '../common/Dialog/GlobalDialogController';

import BackSvg from '../asset/back.svg';
import { NavigationProp, useNavigation } from '@react-navigation/native';

interface IChallengeImageProps {
  name: string;
  image: string | null;
  onPress?: () => void;
}

interface IFeedPostCardProps {
  itemFeedPostCard: IFeedPostProps;
}

const ChallengeImage: FC<IChallengeImageProps> = ({ name, image, onPress }) => {
  let newUrl = image;
  if (newUrl && !newUrl.startsWith('http')) {
    newUrl = `https://buildyou-front.stg.startegois.com${image}`;
  }
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={clsx('border-gray-80 w-full rounded-xl border bg-white')}
    >
      <View className={clsx('relative w-full')}>
        {newUrl && (
          <Image
            className={clsx('aspect-square w-full rounded-t-xl')}
            source={{ uri: newUrl }}
          />
        )}
        <View
          className={clsx(
            'relative flex  flex-row items-center justify-between px-4 py-3'
          )}
        >
          <View className={clsx('flex w-11/12 flex-row items-center')}>
            <Text className={clsx('text-h6 font-semibold leading-6')}>
              {name}
            </Text>
          </View>
          <View></View>
          <View className="">
            <BackSvg />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const FeedPostCard: React.FC<IFeedPostCardProps> = ({
  itemFeedPostCard: { id, caption, user, image, updatedAt, challenge },
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { getAccessToken } = useAuthStore();

  const isToken = getAccessToken();
  const { t } = useTranslation();

  const navigateToUserProfile = () => {
    if (!user?.id) {
      GlobalDialogController.showModal({
        title: 'Error',
        message:
          t('error_general_message') ||
          'Something went wrong. Please try again later!',
      });
      return;
    }
    navigation.navigate('OtherUserProfileScreen', { userId: user?.id });
  };

  const navigateToProgressComment = () => {
    if (!user?.id || !id) {
      GlobalDialogController.showModal({
        title: 'Error',
        message:
          t('error_general_message') ||
          'Something went wrong. Please try again later!',
      });
      return;
    }

    navigation.navigate('ProgressCommentScreen', {
      progressId: id,
      ownerId: user?.id,
      challengeName: 'Climbing Mont Blanc',
    });
  };

  const navigateToChallengeDetail = () => {
    if (!challenge?.id) {
      GlobalDialogController.showModal({
        title: 'Error',
        message:
          t('error_general_message') ||
          'Something went wrong. Please try again later!',
      });
      return;
    }
    navigation.navigate('OtherUserProfileDetailsScreen', {
      challengeId: challenge?.id,
    });
  };

  return (
    <View className="relative w-full">
      <View className="relative mb-1">
        <View className="bg-gray-50 p-5">
          <TouchableOpacity
            className="mb-3 flex-row justify-between"
            onPress={navigateToUserProfile}
          >
            <View className="flex-row">
              <PostAvatar src={user?.avatar} onPress={navigateToUserProfile} />
              <View className="ml-2">
                <Text className="text-h6 font-bold">
                  {user?.name} {user?.surname}
                </Text>
                <Text className="text-gray-dark text-xs font-light ">
                  {getTimeDiffToNow(updatedAt)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <Text className=" text-md mb-3 font-normal leading-5">{caption}</Text>
          <ChallengeImage
            name={challenge?.goal}
            image={image as string}
            onPress={navigateToChallengeDetail}
          />
          <View className="mt-4 flex-row">
            <LikeButton progressId={id} />
            <CommentButton
              navigationToComment={navigateToProgressComment}
              progressId={id}
            />
          </View>
        </View>
        <View className="bg-gray-light h-2 w-full" />
      </View>
      {!isToken && (
        <TouchableOpacity
          className=" absolute left-0 top-0 z-10 h-full w-full "
          onPress={() => navigation.navigate('LoginScreen')}
        ></TouchableOpacity>
      )}
    </View>
  );
};

export default FeedPostCard;
