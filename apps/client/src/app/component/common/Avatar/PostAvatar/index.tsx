import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import clsx from 'clsx';
import DefaultAvatar from '../../../asset/default-avatar.svg';

interface IPostAvatarProps {
  src: string | null | undefined;
  alt?: string;
  onPress?: () => void;
}

const PostAvatar: React.FC<IPostAvatarProps> = ({ src, alt, onPress }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState<string | null | undefined>(
    null
  );

  useEffect(() => {
    let url: string | null | undefined;
    if (src && !src.startsWith('http')) {
      url = `https://buildyou-front.stg.startegois.com${src}`;
    } else {
      url = src;
    }
    setNewAvatarUrl(url);
  }, [src]);


  return (
    <View className={clsx('flex flex-row items-center')}>
      {newAvatarUrl && (
        <View className={clsx('relative')}>
          <Image
            key={`${newAvatarUrl}`}
            className={clsx('h-[32px] w-[32px] rounded-full')}
            source={{
              uri: newAvatarUrl,
            }}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onError={(err) => {
              setLoading(false);
              setError(true);
            }}
          />
        </View>
      )}
      {!newAvatarUrl && (
        <View className={clsx('z-10 h-[32px] w-[32px] rounded-full  bg-white')}>
          <DefaultAvatar />
        </View>
      )}
    </View>
  );
};

export default PostAvatar;
