import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { RootStackParamList } from '../../navigation/navigation.type';
import { IProgressChallenge } from '../../types/challenge';

import { useGetOtherUserData } from '../../hooks/useGetUser';
import { getProgressComments, getProgressLikes } from '../../service/progress';

import IconDot from './asset/dot.svg';

import Card from '../common/Card';
import LikeButton from './LikeButton';
import CommentButton from './CommentButton';
import PostAvatar from '../common/Avatar/PostAvatar';
import ImageSwiper from '../common/ImageSwiper';

interface IChallengeProgressCardProps {
  progress: IProgressChallenge;
  ownerId?: string;
  shouldRefreshComments?: boolean;
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
  progress: {
    id,
    caption,
    createdAt,
    challenge,
    comments,
    image,
    video,
    location,
  },
  ownerId,
  shouldRefreshComments,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const progressOwnerData = ownerId && useGetOtherUserData(ownerId);

  const navigationToComment = () => {
    navigation.navigate('ProgressCommentScreen', {
      progressId: id,
      ownerId,
    });
  };

  return (
    <View className="mb-1 flex-1">
      <View className="bg-white p-5">
        <View className="mb-3 flex-row justify-between">
          <View className="flex-row">
            <PostAvatar src="https://picsum.photos/200/300" />
            <View className="ml-2">
              <Text className="text-h6 font-bold">
                {progressOwnerData?.name} {progressOwnerData?.surname}
              </Text>
              <View className="flex-row gap-3">
                <Text className="text-gray-dark text-xs font-light ">
                  {createdAt}
                </Text>
                <Text className="text-gray-dark text-xs font-light ">
                  <IconDot fill={'#7D7E80'} />
                  {'   '} {location || 'Address here'}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {image && (
          <View className="aspect-square w-full">
            <ImageSwiper imageSrc={image} />
          </View>
        )}
        <View className="mt-4 flex-row">
          <LikeButton progressId={id} />
          <CommentButton
            isViewOnly={true}
            navigationToComment={navigationToComment}
            progressId={id}
            shouldRefreshComments={shouldRefreshComments}
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
  progress: {
    id,
    caption,
    createdAt,
    challenge,
    comments,
    image,
    video,
    location,
  },
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const navigationToComment = () => {
    navigation.navigate('ProgressCommentScreen', {
      progressId: id,
    });
  };

  return (
    <View className="mb-1 flex-1">
      <View className="bg-gray-50 p-5">
        <View className="mb-3 flex-row justify-between">
          <View className="flex-row">
            <PostAvatar src="https://picsum.photos/200/300" />
            <View className="ml-2">
              <Text className="text-h6 font-bold">{caption}</Text>
              <Text className="text-gray-dark text-xs font-light ">
                {createdAt}
              </Text>
            </View>
          </View>
          {/* <TouchableOpacity onPress={() => console.log('press')}>
            <Text className="text-h6 font-medium ">...</Text>
          </TouchableOpacity> */}
        </View>
        {image && (
          <View className="aspect-square w-full">
            <ImageSwiper imageSrc={image} />
          </View>
        )}
        <View className="mt-4 flex-row">
          <LikeButton progressId={id} />
          <CommentButton
            navigationToComment={navigationToComment}
            progressId={id}
          />
        </View>
      </View>
      <View className="bg-gray-light h-2 w-full" />
    </View>
  );
};

export default ChallengeProgressCard;
