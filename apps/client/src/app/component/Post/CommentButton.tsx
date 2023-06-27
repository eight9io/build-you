import React, { FC, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { clsx } from 'clsx';

import CommentSvg from './asset/comment.svg';
import { getProgressComments } from '../../service/progress';

interface ICommentButtonProps {
  progressId: string;
  isViewOnly?: boolean;
  navigationToComment?: () => void;
  shouldRefreshComments?: boolean;
}

const CommentButton: FC<ICommentButtonProps> = ({
  progressId,
  isViewOnly = false,
  navigationToComment,
  shouldRefreshComments = false,
}) => {
  const [numberOfComments, setNumberOfComments] = useState(0);
  useEffect(() => {
    if (!progressId) return;
    (async () => {
      await loadProgressComments();
    })();
  }, [progressId]);

  useEffect(() => {
    if (!shouldRefreshComments) return;
    (async () => {
      await loadProgressComments();
    })();
  }, [shouldRefreshComments]);

  const loadProgressComments = async () => {
    try {
      const response = await getProgressComments(progressId);
      if (response.status === 200) setNumberOfComments(response.data.length);
    } catch (error) {
      console.log(error);
    }
  };
  const handleNavigationToComment = () => {
    !isViewOnly && navigationToComment && navigationToComment();
  };
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handleNavigationToComment}
      className={clsx('ml-4')}
    >
      <View className={clsx('flex-row items-center justify-center gap-2')}>
        <CommentSvg />
        <Text className={clsx('text-gray-dark text-md font-normal ')}>
          {numberOfComments} comment{numberOfComments > 1 && 's'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CommentButton;
