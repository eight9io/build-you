import { Text } from 'react-native';
import React from 'react';
interface Props {
  message: any;
}
export default function ErrorText({ message }: Props) {
  return <Text className=" text-sm text-red-500">{message}</Text>;
}
