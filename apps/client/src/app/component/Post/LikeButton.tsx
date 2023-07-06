import React, { FC, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

import ThumbUp from './asset/thumb_up.svg';
import FilledThumbUP from './asset/filled_thumb_up.svg';
import { useAuthStore } from '../../store/auth-store';
import {
  createProgressLike,
  deleteProgressLike,
  getProgressLikes,
} from '../../service/progress';

import GlobalDialogController from '../common/Dialog/GlobalDialogController';

interface ILikeButtonProps {
  navigation?: any;
  progressId?: string;
  isFocused?: boolean;
  currentUserId: string | undefined;
}

const LikeButton: FC<ILikeButtonProps> = ({
  isFocused = false,
  navigation,
  progressId,
  currentUserId,
}) => {
  const { getAccessToken } = useAuthStore();
  const { t } = useTranslation();

  const [numberOfLikes, setNumberOfLikes] = useState<number>(0);
  const [isLikedByCurrentUser, setIsLikedByCurrentUser] =
    useState<boolean>(false);

  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [tempLikes, setTempLikes] = useState(numberOfLikes);
  const [shouldOptimisticUpdate, setShouldOptimisticUpdate] =
    useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  const isToken = getAccessToken();

  const loadProgressLikes = async () => {
    if (!progressId || !currentUserId) return;
    try {
      const response = await getProgressLikes(progressId);
      if (response.status === 200) {
        setNumberOfLikes(() => response.data.length);
        const isLiked = response.data.some(
          (like) => like.user === currentUserId
        );
        setIsLikedByCurrentUser(isLiked);
      }
      setIsFirstLoad(false);
    } catch (error) {
      GlobalDialogController.showModal({
        title: 'Error',
        message:
          'Something went wrong when getting likes. Please try again later.',
      });
    }
  };

  useEffect(() => {
    if (!isFocused || isFirstLoad) return;
    if (shouldOptimisticUpdate) {
      setShouldOptimisticUpdate(false);
      return;
    }
    (async () => {
      await loadProgressLikes();
    })();
  }, [isFocused]);

  useEffect(() => {
    (async () => {
      await loadProgressLikes();
    })();
  }, [progressId, currentUserId]);

  useEffect(() => {
    setTempLikes(numberOfLikes);
  }, [numberOfLikes]);

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
        setTempLikes((prev) => prev - 1);
      });
      return;
    }
    createProgressLike(progressId)
      .then((res) => {
        setShouldOptimisticUpdate(true);
        setIsLikedByCurrentUser && setIsLikedByCurrentUser(true);
        setIsLiked(true);
        setTempLikes((prev) => prev + 1);
      })
      .catch((err) => {
        GlobalDialogController.showModal({
          title: 'Error',
          message:
            (t('error_general_message') as string) || 'Something went wrong',
          button: 'OK',
        });
      });
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handleLike}>
      <View
        className={clsx('flex-1 flex-row items-center justify-center gap-2')}
      >
        {!shouldOptimisticUpdate &&
          (isLikedByCurrentUser ? <FilledThumbUP /> : <ThumbUp />)}
        {shouldOptimisticUpdate && (isLiked ? <FilledThumbUP /> : <ThumbUp />)}
        <Text className={clsx('text-gray-dark text-md font-normal ')}>
          {shouldOptimisticUpdate
            ? `${tempLikes} ${tempLikes > 1 ? 'likes' : 'like'}`
            : `${numberOfLikes} ${numberOfLikes > 1 ? 'likes' : 'like'}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default LikeButton;
