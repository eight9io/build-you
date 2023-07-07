import React, { FC, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { clsx } from 'clsx';

import ThumbUp from './asset/thumb_up.svg';

const LikeButtonUnregister = () => {
  const numberOfLikes = Math.floor(Math.random() * 100);

  return (
    <TouchableOpacity activeOpacity={0.8}>
      <View
        className={clsx('flex-1 flex-row items-center justify-center gap-2')}
      >
        <ThumbUp />
        <Text className={clsx('text-gray-dark text-md font-normal ')}>
          {`${numberOfLikes} ${numberOfLikes > 1 ? 'likes' : 'like'}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default LikeButtonUnregister;
