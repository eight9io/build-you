import React from 'react';
import { View, Text } from 'react-native';

import NotiItem from './NotiItem';
import { NOTIFICATION_TYPES } from '../../common/enum';

interface INotificationProps {
  title: string;
  notificationItems?: any[];
  isPrevious?: boolean;
}

const Notification: React.FC<INotificationProps> = ({
  title,
  notificationItems,
  isPrevious = false,
}) => {
  return (
    <View className="flex flex-col">
      <View className="bg-gray-100 px-6 py-4">
        <Text className="text-lg font-medium">{title}</Text>
      </View>

      <NotiItem
        typeOfNoti={NOTIFICATION_TYPES.NEW_COMMENT}
        isPrevious={isPrevious}
      />
      <NotiItem
        typeOfNoti={NOTIFICATION_TYPES.NEW_FOLLOWER}
        isPrevious={isPrevious}
      />
      <NotiItem
        typeOfNoti={NOTIFICATION_TYPES.NEW_CHALLENGE_FROM_FOLLOWING}
        isPrevious={isPrevious}
      />
      <NotiItem
        typeOfNoti={NOTIFICATION_TYPES.NEW_MENTION}
        isPrevious={isPrevious}
      />
    </View>
  );
};

export default Notification;
