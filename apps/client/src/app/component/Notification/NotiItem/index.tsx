import React from 'react';
import clsx from 'clsx';
import { View, Text } from 'react-native';

import NotiAvatar from '../../common/Avatar/NotiAvatar';
import { NOTIFICATION_TYPES } from '../../../common/enum';
import { getNotificationContent } from '../../../utils/notification.util';
interface INotiItemProps {
  username?: string;
  avatarUrl?: string;
  contentPayload?: any;
  time?: string;
  isPrevious?: boolean;
  typeOfNoti: NOTIFICATION_TYPES;
}

const NotiItem: React.FC<INotiItemProps> = ({
  username = 'Rudy Aster',
  avatarUrl,
  contentPayload,
  time,
  isPrevious,
  typeOfNoti,
}) => {
  const content = getNotificationContent(typeOfNoti, contentPayload);
  return (
    <View
      className={clsx(
        'bg-primary-100 border-b-gray-medium flex flex-row items-center border-b-[1px] px-6 py-4',
        isPrevious && 'bg-white'
      )}
    >
      <NotiAvatar
        src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80"
        alt="avatar"
        typeOfNoti={typeOfNoti}
      />
      <View className={clsx('ml-4 flex flex-col')}>
        <View className={clsx('flex flex-row items-center')}>
          <Text className={clsx('text-base')}>
            <Text className={clsx('font-semibold')}>
              {username || 'Rudy Aster'}
            </Text>
            {` ${content}`}
          </Text>
        </View>
        <Text className={clsx('text-[#7C7673]')}>2 hours ago</Text>
      </View>
    </View>
  );
};

export default NotiItem;
