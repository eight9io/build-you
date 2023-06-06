import React from 'react';
import clsx from 'clsx';
import { View, Text, ScrollView } from 'react-native';

import NotiItem from './NotiItem';

interface INotificaitonProps {
  title: string;
  notificationItems?: any[];
  isPrevious?: boolean;
}

const Notificaiton: React.FC<INotificaitonProps> = ({
  title,
  notificationItems,
  isPrevious = false,
}) => {
  return (
    <View className="flex flex-col">
      <View className="bg-gray-100 px-6 py-4">
        <Text className="text-lg font-medium">{title}</Text>
      </View>

      <NotiItem typeOfNoti="comment" isPrevious={isPrevious} />
      <NotiItem typeOfNoti="follow" isPrevious={isPrevious} />
      <NotiItem typeOfNoti="comment" isPrevious={isPrevious} />
    </View>
  );
};

export default Notificaiton;
