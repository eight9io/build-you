import React, { FC, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { clsx } from 'clsx';

import ThumbUp from './asset/thumb_up.svg';
import FilledThumbUP from './asset/filled_thumb_up.svg';

interface ILikeButtonProps {
  likes: number;
}

const LikeButton: FC<ILikeButtonProps> = ({ likes }) => {
  const [isLiked, setIsLiked] = React.useState(false);
  const [tempLikes, setTempLikes] = React.useState(likes);
  const handleLike = () => {
    // TODO: handle like api
    if (isLiked) {
      setTempLikes(tempLikes - 1);
    } else {
      setTempLikes(tempLikes + 1);
    }
    setIsLiked(!isLiked);
  };

  useEffect(() => {
    setTempLikes(likes);
  }, [likes]);

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handleLike}>
      <View className={clsx('flex-1 flex-row justify-center items-center gap-2')}>
        {isLiked ? <FilledThumbUP /> : <ThumbUp />}
        <Text className={clsx('text-gray-dark text-md font-normal ')}>
          {tempLikes > 0 ? `${tempLikes} likes` : `0 like`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default LikeButton;
