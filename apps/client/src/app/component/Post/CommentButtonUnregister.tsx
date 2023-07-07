import React, { FC, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { clsx } from 'clsx';

import CommentSvg from './asset/comment.svg';

const CommentButtonUnregister = () => {
  const numberOfComments = Math.floor(Math.random() * 100);
  return (
    <TouchableOpacity activeOpacity={0.8} className={clsx('ml-4')}>
      <View className={clsx('flex-row items-center justify-center gap-2')}>
        <CommentSvg />
        <Text className={clsx('text-gray-dark text-md font-normal ')}>
          {numberOfComments} comment{numberOfComments > 1 && 's'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CommentButtonUnregister;
