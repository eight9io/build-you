import { View, Text } from 'react-native';
import React, { FC, useEffect, useState } from 'react';

import { IProgressChallenge } from '../../types/challenge';

import { useGetOtherUserData } from '../../hooks/useGetUser';
import { getProgressComments, getProgressLikes } from '../../service/progress';

import IconDot from './asset/dot.svg';

import Card from '../common/Card';
import LikeButton from './LikeButton';
import CommentButton from './CommentButton';
import PostAvatar from '../common/Avatar/PostAvatar';
import ImageSwiper from '../common/ImageSwiper';
import { getTimeDiffToNow } from '../../utils/time';
import { getSeperateImageUrls } from '../../utils/image';

interface IChallengeProgressCardProps {
  progress: IProgressChallenge;
  ownerId?: string;
  shouldRefreshComments?: boolean;
}

const ChallengeProgressCardForComment: React.FC<
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
  const [otherData, setOtherData] = useState<any>();
  ownerId && useGetOtherUserData(ownerId, setOtherData);

  return (
    <View className="mb-1 flex-1">
      <View className="bg-white p-5">
        <View className="mb-3 flex-row justify-between">
          <View className="flex-row">
            <PostAvatar src={otherData?.avatar} />
            <View className="ml-2">
              <Text className="text-h6 font-bold">
                {otherData?.name} {otherData?.surname}
              </Text>

              <View className="flex-row gap-3">
                <Text className="text-gray-dark text-xs font-light ">
                  {getTimeDiffToNow(createdAt)}
                </Text>
                {location && (
                  <Text className="text-gray-dark text-xs font-light ">
                    <IconDot fill={'#7D7E80'} />
                    {'   '} {location}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        <View className="py-2 pb-3">
          <Text className="text-md font-normal">{caption}</Text>
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
            progressId={id}
            shouldRefreshComments={shouldRefreshComments}
          />
        </View>
      </View>
      {/* <View className="bg-gray-light h-2 w-full" /> */}
    </View>
  );
};

export default ChallengeProgressCardForComment;
