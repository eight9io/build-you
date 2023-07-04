import React from 'react';
import { View, Text, FlatList } from 'react-native';

import NotiItem from './NotiItem';
import { NOTIFICATION_TYPES } from '../../common/enum';
import { INotification } from '../../types/notification';
import { MOCK_NOTIFICATION } from '../../mock-data/notification';

interface INotificationProps {
  title?: string;
}

const Notification: React.FC<INotificationProps> = ({ title }) => {
  return (
    <View className="mt-4 flex-1">
      {title ? (
        <View className="px-6 py-4">
          <Text className="text-lg font-medium">{title}</Text>
        </View>
      ) : null}
      <FlatList
        data={MOCK_NOTIFICATION}
        renderItem={({ item, index }) => {
          return <NotiItem notification={item} key={index} />;
        }}
      />
    </View>
  );
};

export default Notification;
