import React, { FC, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { clsx } from 'clsx';

import ThumbUp from './asset/thumb_up.svg';
import FilledThumbUP from './asset/filled_thumb_up.svg';
import { useAuthStore } from '../../store/auth-store';
import { createProgressLike, deleteProgressLike } from '../../service/progress';

interface ILikeButtonProps {
  likes: number;
  isLikedByCurrentUser?: boolean;
  setIsLikedByCurrentUser?: React.Dispatch<React.SetStateAction<boolean>>;
  progressId?: string;
  navigation?: any;
}

const LikeButton: FC<ILikeButtonProps> = ({
  likes = 0,
  isLikedByCurrentUser = false,
  setIsLikedByCurrentUser,
  navigation,
  progressId,
}) => {
  const { getAccessToken } = useAuthStore();

  const [isLiked, setIsLiked] = React.useState(false);
  const [tempLikes, setTempLikes] = React.useState(likes);
  const [shouldOptimisticUpdate, setShouldOptimisticUpdate] =
    React.useState(false);

  const isToken = getAccessToken();

  const handleLike = () => {
    if (!isToken) {
      // this is for unauthenticated user
      return navigation.navigate('LoginScreen');
    }
    if (isLikedByCurrentUser) {
      deleteProgressLike(progressId).then((res) => {
        setShouldOptimisticUpdate(true);
        setIsLikedByCurrentUser && setIsLikedByCurrentUser(false);
        setIsLiked(false);
      });
      setTempLikes((prev) => prev - 1);
      return;
    }
    createProgressLike(progressId)
      .then((res) => {
        setShouldOptimisticUpdate(true);
        setIsLikedByCurrentUser && setIsLikedByCurrentUser(true);
        setIsLiked(true);
      })
      .catch((err) => {
        console.log(err);
      });
    if (isLiked) {
      setTempLikes((prev) => prev - 1);
    } else {
      setTempLikes((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };
  useEffect(() => {
    setTempLikes(likes);
  }, [likes]);

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handleLike}>
      <View
        className={clsx('flex-1 flex-row items-center justify-center gap-2')}
      >
        {!shouldOptimisticUpdate &&
          (isLikedByCurrentUser ? <FilledThumbUP /> : <ThumbUp />)}
        {shouldOptimisticUpdate && (isLiked ? <FilledThumbUP /> : <ThumbUp />)}
        <Text className={clsx('text-gray-dark text-md font-normal ')}>
          {shouldOptimisticUpdate ? `${tempLikes} likes` : `${likes} like`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default LikeButton;
