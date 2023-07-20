import React, { FC, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight } from 'react-native';
import { clsx } from 'clsx';

import CommentSvg from './asset/comment.svg';
import { getProgressComments } from '../../service/progress';
import GlobalDialogController from '../common/Dialog/GlobalDialogController';
import { debounce } from '../../hooks/useDebounce';

interface ICommentButtonProps {
  progressId: string;
  isFocused?: boolean;
  isViewOnly?: boolean;
  navigationToComment?: () => void;
  shouldRefreshComments?: boolean;
}

const CommentButton: FC<ICommentButtonProps> = ({
  progressId,
  isFocused = false,
  isViewOnly = false,
  navigationToComment,
  shouldRefreshComments = false,
}) => {
  const [numberOfComments, setNumberOfComments] = useState(0);
  useEffect(() => {
    if (!isFocused) return;
    (async () => {
      await loadProgressComments();
    })();
  }, [isFocused]);

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
    } catch (_) {
      GlobalDialogController.showModal({
        title: 'Error',
        message: 'Something went wrong. Please try again later.',
      });
    }
  };
  const handleNavigationToComment = debounce(() => {
    !isViewOnly && navigationToComment && navigationToComment();
  }, 300);

  return (
    <TouchableHighlight
      activeOpacity={0.8}
      underlayColor="#C5C8D2"
      onPress={handleNavigationToComment}
      className="ml-2 h-8 px-2 rounded-md"
    >
      <View
        className={clsx('flex-1 flex-row items-center justify-center gap-2')}
      >
        <CommentSvg />
        <Text className={clsx('text-gray-dark text-md font-normal ')}>
          {numberOfComments} comment{numberOfComments > 1 && 's'}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

export default CommentButton;
