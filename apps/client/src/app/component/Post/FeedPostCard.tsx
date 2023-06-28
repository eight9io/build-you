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
import { IFeedPostProps } from '../../types/common';
import { getTimeDiffToNow } from '../../utils/time';

interface IChallengeImageProps {
  name: string;
  image: string | string[] | null;
  onPress?: () => void;
}

interface IFeedPostCardProps {
  itemFeedPostCard: IFeedPostProps;
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
          source={{
            uri: image as string,
          }}
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
  itemFeedPostCard: { id, caption, user, image, updatedAt },
}) => {
  console.log("🚀 ~ file: FeedPostCard.tsx:69 ~ user:", user)
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
  return (
    <View className="relative w-full">
      <View className="relative mb-1">
        <View className="bg-gray-50 p-5">
          <TouchableOpacity
            className="mb-3 flex-row justify-between"
            onPress={navigateToUserProfile}
          >
            <View className="flex-row">
              <PostAvatar
                src="https://picsum.photos/200/300"
                onPress={navigateToUserProfile}
              />
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
            name={caption}
            image={image}
            onPress={() =>
              navigation.navigate('ProgressCommentScreen', {
                progressId: id,
                challengeName: caption,
              })
            }
          />
          <View className="mt-4 flex-row">
            <LikeButton progressId={id} />
            <CommentButton
              navigationToComment={() =>
                navigation.navigate('ProgressCommentScreen', {
                  progressId: '0bcfa0c4-c847-41f4-859b-df4fbdf3617a',
                  ownerId: '95ba5302-950c-4c7b-ab61-1da316ff0617',
                  challengeName: 'Climbing Mont Blanc',
                })
              }
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
