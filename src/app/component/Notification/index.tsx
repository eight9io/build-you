import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { useTranslation } from "react-i18next";

import NotiItem from "./NotiItem";
import { INotification } from "../../types/notification";
import { getNotifications } from "../../service/notification";
import GlobalDialogController from "../common/Dialog/GlobalDialogController";
import SkeletonLoadingCommon from "../common/SkeletonLoadings/SkeletonLoadingCommon";
import EmptyNotification from "../../component/asset/empty-notification.svg";
interface INotificationProps {
  title?: string;
  notifications: INotification[];
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

const Notification: React.FC<INotificationProps> = ({
  title,
  notifications,
  isRefreshing,
  onRefresh,
}) => {
  const { t } = useTranslation();

  return (
    <View className="flex-1">
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
          onRefresh={onRefresh}
          refreshing={isRefreshing}
          ListFooterComponent={<View className="h-20" />}
        />
      ) : (
        <>
          <View className="flex-1 items-center justify-center">
            <EmptyNotification />
            <Text className="text-center font-regular text-base text-gray-dark">
              {t("notification_screen.no_notification")}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

export default Notification;
