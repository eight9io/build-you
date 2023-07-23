import { Text, View } from 'react-native';
import React from 'react';
import clsx from 'clsx';
import IconErr from '../asset/IconErr.svg';
interface Props {
  message: any;
  containerClassName?: string;
}
export default function ErrorText({ message, containerClassName }: Props) {
  return (
    <View
      className={clsx(
        'mt-4  flex-row content-center items-center',
        containerClassName
      )}
    >
      <IconErr />

      <Text className={clsx(' ml-1  text-sm text-red-500')}>{message}</Text>
    </View>
  );
}
