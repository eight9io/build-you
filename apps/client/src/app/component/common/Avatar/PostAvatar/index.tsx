import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import clsx from 'clsx';
import DefaultAvatar from '../../../asset/default-avatar.svg';

interface IPostAvatarProps {
  src?: string;
  alt?: string;
  onPress?: () => void;
}

const PostAvatar: React.FC<IPostAvatarProps> = ({ src, alt, onPress }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  return (
    <View className={clsx('flex flex-row items-center')}>
      {src && (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
          <View className={clsx('relative')}>
            <Image
              className={clsx('h-[32px] w-[32px] rounded-full')}
              source={{ uri: src }}
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
              onError={(err) => {
                setLoading(false);
                setError(true);
              }}
            />
          </View>
        </TouchableOpacity>
      )}
      {!src && <DefaultAvatar />}
    </View>
  );
};

export default PostAvatar;
