import React from 'react';
import clsx from 'clsx';
import { View, Text } from 'react-native';

import NotiAvartar from '../../common/Avatar/NotiAvatar';

interface INotiItemProps {
  username?: string;
  avatarUrl?: string;
  content?: string;
  time?: string;
  isPrevious?: boolean;
  typeOfNoti?: 'comment' | 'follow';
}

const NotiItem: React.FC<INotiItemProps> = ({
  username,
  avatarUrl,
  content,
  time,
  isPrevious,
  typeOfNoti,
}) => {
  return (
    <View
      className={clsx(
        'bg-primary-100 border-b-gray-medium flex flex-row items-center border-b-[1px] px-6 py-4',
        isPrevious && 'bg-white'
      )}
    >
      <NotiAvartar
        src='https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80'
        alt='avatar'
        typeOfNoti={typeOfNoti}
      />
      <View className={clsx('ml-4 flex flex-col')}>
        <View className={clsx('flex flex-row items-center')}>
          <Text className={clsx('text-base font-semibold')}>Rudy Aster{' '}</Text>
          <Text className={clsx('text-base')}>commented on your update</Text>
        </View>
        <Text className={clsx('text-[#7C7673]')}>2 hours ago</Text>
      </View>
    </View>
  );
};

export default NotiItem;
