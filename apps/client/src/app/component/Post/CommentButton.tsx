import React, { FC, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { clsx } from 'clsx';

import CommentSvg from './asset/comment.svg';

interface ICommentButtonProps {
  post?: any;
  numberOfComments?: number;
  isViewOnly?: boolean;
  navigationToComment: () => void;
}

const CommentButton: FC<ICommentButtonProps> = ({
  post,
  numberOfComments = 0,
  isViewOnly = false,
  navigationToComment,
}) => {
  const handleNavigationToComment = () => {
    !isViewOnly && navigationToComment();
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
