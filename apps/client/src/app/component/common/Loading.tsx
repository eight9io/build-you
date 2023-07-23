import { View, Text } from 'react-native';
import React from 'react';
import IconLoading from '../asset/loading.svg';
import clsx from 'clsx';
interface ILoadingProps {
  containerClassName?: string;
  text?: string;
}
export default function Loading({ containerClassName, text }: ILoadingProps) {
  return (
    <View
      className={clsx(
        'flex  h-full w-full items-center justify-center  bg-[#34363F] opacity-80 ',
        containerClassName
      )}
    >
      <IconLoading />
      <Text className="text-h6 mt-4 px-16 text-center font-light text-white">
        {text || 'Loading...'}
      </Text>
    </View>
  );
}
