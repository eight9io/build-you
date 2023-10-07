import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect, ReactNode } from "react";

import DefaultAvatar from "../../../../common/svg/default-avatar.svg";
import TouchPointCircle from "../../../../common/svg/touchpoint-circle.svg";
import TouchPointCheckCircle from "../../../../common/svg/check-circle-24.svg";
import TouchPointRetangle from "../../../../common/svg/touchpoint-rectangle.svg";

interface ICoachTabViewOnlyProps {}

const EmptyCoachBanner = (translation) => {
  return (
    <View className="flex flex-row items-center rounded-lg bg-gray-light p-4">
      <DefaultAvatar />
      <View className="ml-4" />
      <Text className="text-md font-semibold text-gray-dark">
        Waiting for coach...
      </Text>
    </View>
  );
};

const CoachBanner = ({ coachName, coachAvatar, translation, specialize }) => {
  return (
    <View className="flex flex-row items-center justify-between rounded-lg bg-gray-light p-4">
      <View className="flex flex-row items-center">
        <DefaultAvatar />
        <View className="ml-4" />
        <View className="flex flex-col items-start">
          <Text className="text-black text-md font-semibold">{coachName}</Text>
          <Text className="text-md text-gray-dark">{specialize}</Text>
        </View>
      </View>
      <TouchableOpacity
        className="flex flex-row items-center justify-center rounded-full bg-white p-2 px-6 "
        onPress={() => {}}
      >
        <Text className="font-semibold text-primary-default">Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const CoachTabViewOnly = () => {
  const [
    isChangeTouchpointStatusModalVisible,
    setChangeTouchpointStatusModalVisible,
  ] = useState<boolean>(false);
  const { t } = useTranslation();

  const handleOpenChangeTouchpointStatusModal = () => {
    setChangeTouchpointStatusModalVisible(true);
  };

  const handleCloseChangeTouchpointStatusModal = () => {
    setChangeTouchpointStatusModalVisible(false);
  };

  return (
    <View className="flex flex-col p-4">
      {/* <EmptyCoachBanner translation={t} /> */}
      <CoachBanner
        translation={t}
        coachAvatar={"https://i.pravatar.cc/300"}
        coachName={"Rudy Aster"}
        specialize={"Personal Trainer"}
      />
    </View>
  );
};

export default CoachTabViewOnly;
