import React, { useState } from "react";
import clsx from "clsx";
import { View, Text, TouchableOpacity } from "react-native";

import NotiAvatar from "../../common/Avatar/NotiAvatar";
import { NOTIFICATION_TYPES } from "../../../common/enum";
import {
  getNotificationContent,
  handleTapOnNotification,
} from "../../../utils/notification.util";
import { INotification } from "../../../types/notification";
import dayjs from "../../../utils/date.util";
import { useNav } from "../../../hooks/useNav";
import { setNotificationIsRead } from "../../../service/notification";
import { useUserProfileStore } from "../../../store/user-store";
import { useTranslation } from "react-i18next";
interface INotiItemProps {
  notification: INotification;
}

const NotiItem: React.FC<INotiItemProps> = ({ notification }) => {
  const navigation = useNav();
  const [isRead, setIsRead] = useState<boolean>(notification.isRead);
  const { userProfile } = useUserProfileStore();
  const { t } = useTranslation();

  let content = "";
  if (
    notification.type === NOTIFICATION_TYPES.CHALLENGE_CREATED ||
    notification.type === NOTIFICATION_TYPES.PROGRESS_CREATED
  )
    content = getNotificationContent(notification.type, {
      challengeGoal: notification.challengeGoal,
    });
  else content = getNotificationContent(notification.type);
  return (
    <TouchableOpacity
      className={clsx(
        "flex-row items-center border-b-[1px] border-b-gray-medium bg-primary-100 p-4",
        isRead && "bg-white"
      )}
      onPress={async () => {
        await handleTapOnNotification(
          notification,
          navigation,
          setNotificationIsRead
        );
        setIsRead(true);
      }}
    >
      <NotiAvatar
        src={notification.user.avatar}
        alt="avatar"
        typeOfNoti={notification.type}
        onPress={async () => {
          await handleTapOnNotification(
            notification,
            navigation,
            setNotificationIsRead
          );
          setIsRead(true);
        }}
      />
      <View className={clsx("ml-4 flex-1")}>
        <Text className={clsx("text-base font-normal")}>
          {`${
            userProfile.id !== notification.user.id
              ? notification.user.name
              : t("notification_screen.you")
          } ${content}`}
        </Text>
        <Text className={clsx("text-[#7C7673]")}>
          {dayjs(notification.createdAt).fromNow()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default NotiItem;
