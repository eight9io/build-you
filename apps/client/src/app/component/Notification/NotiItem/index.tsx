import React, { useState } from 'react';
import clsx from 'clsx';
import { View, Text, TouchableOpacity } from 'react-native';

import NotiAvatar from '../../common/Avatar/NotiAvatar';
import { NOTIFICATION_TYPES } from '../../../common/enum';
import { getNotificationContent, handleTapOnNotification } from '../../../utils/notification.util';
import { INotification } from '../../../types/notification';
import dayjs from '../../../utils/date.util';
import { useNav } from '../../../navigation/navigation.type';
interface INotiItemProps {
  notification: INotification;
}

const NotiItem: React.FC<INotiItemProps> = ({
  notification,
}) => {
  const navigation = useNav();
  const [isRead, setIsRead] = useState<boolean>(notification.isRead);

  let content = '';
  if (notification.type === NOTIFICATION_TYPES.NEW_PROGRESS_FROM_FOLLOWING)
    content = getNotificationContent(notification.type, {
      challengeName: notification.challengeName,
    });
  else content = getNotificationContent(notification.type);
  return (
    <TouchableOpacity
      className={clsx(
        'bg-primary-100 border-b-gray-medium flex-row items-center border-b-[1px] p-4',
        isRead && 'bg-white'
      )}
      onPress={async () => {
        await handleTapOnNotification(notification, navigation);
        setIsRead(true);
      }}
    >
      <NotiAvatar
        src={notification.user.avatar}
        alt="avatar"
        typeOfNoti={notification.type}
      />
      <View className={clsx('ml-4 flex-1')}>
        <Text className={clsx('text-base font-normal')}>
          {`${notification.user.name || 'Rudy Aster'} ${content}`}
        </Text>
        <Text className={clsx('text-[#7C7673]')}>
          {dayjs(notification.createdAt).fromNow()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default NotiItem;
