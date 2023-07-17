import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';

import NotiItem from './NotiItem';
import { INotification } from '../../types/notification';
import { getNotifications } from '../../service/notification';
import GlobalDialogController from '../common/Dialog/GlobalDialogController';
import SkeletonLoadingCommon from '../common/SkeletonLoadings/SkeletonLoadingCommon';
import EmptyNotification from '../../component/asset/empty-notification.svg';
interface INotificationProps {
  title?: string;
}

const Notification: React.FC<INotificationProps> = ({ title }) => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (error) {
        GlobalDialogController.showModal({
          title: 'Error',
          message:
            t('errorMessage:500') ||
            'Something went wrong. Please try again later!',
          button: 'OK',
        });
        console.error(error);
      }
      setIsLoading(false);
    };
    fetchNotifications();
  }, []);

  if (isLoading)
    return (
      <View className="flex-1">
        <SkeletonLoadingCommon />
      </View>
    );

  return (
    <View className="mt-4 flex-1">
      {title ? (
        <View className="px-6 py-4">
          <Text className="text-lg font-medium">{title}</Text>
        </View>
      ) : null}
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={({ item, index }) => {
            return <NotiItem notification={item} key={index} />;
          }}
          keyExtractor={(item) => item.createdAt.toString()} // TODO: change to id
        />
      ) : (
        <>
          <View className="flex-1 items-center justify-center">
            <EmptyNotification />
            <Text className="text-gray-dark font-regular text-center text-base">
              {t('notification_screen.no_notification')}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

export default Notification;
