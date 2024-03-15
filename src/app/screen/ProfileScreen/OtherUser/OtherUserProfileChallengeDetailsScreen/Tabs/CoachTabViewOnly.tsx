import { useTranslation } from "react-i18next";
import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect, FC } from "react";
import { Image } from "expo-image";

import DefaultAvatar from "../../../../../common/svg/default-avatar.svg";
import { useNav } from "../../../../../hooks/useNav";
import { IUserData } from "../../../../../types/user";
import { serviceGetOtherUserData } from "../../../../../service/user";
import { TFunction } from "i18next";
interface ICoachTabProps {
  coachID: string;
}

const EmptyCoachBanner = () => {
  const { t } = useTranslation();
  return (
    <View className="flex flex-row items-center rounded-lg bg-gray-light p-4">
      <DefaultAvatar />
      <View className="ml-4" />
      <Text className="text-md font-semibold text-gray-dark">
        {t("challenge_detail_screen_tab.coach.waiting_for_coach")}
      </Text>
    </View>
  );
};

const CoachBanner = ({ coachData }: { coachData: IUserData }) => {
  const navigation = useNav();
  const { t } = useTranslation();

  const handleOpenCoachProfile = () => {
    navigation.push("OtherUserProfileScreen", { userId: coachData?.id });
  };

  return (
    <View className="flex flex-row items-center justify-between rounded-lg bg-gray-light p-4">
      <View className="flex flex-row items-center">
        {coachData?.avatar ? (
          <Image
            source={{ uri: coachData?.avatar }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        ) : (
          <DefaultAvatar />
        )}
        <View className="ml-4" />
        <View className="flex flex-col items-start">
          <Text className="text-black text-md font-semibold ">
            {coachData.name} {coachData.surname}
          </Text>
          <Text className="w-44 text-sm capitalize text-gray-dark">
            {coachData?.occupation?.name}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        className="flex flex-row items-center justify-center rounded-full bg-white p-2 px-6 "
        onPress={handleOpenCoachProfile}
      >
        <Text className="font-semibold text-primary-default">
          {t("challenge_detail_screen_tab.coach.profile")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const CoachTabViewOnly: FC<ICoachTabProps> = ({ coachID }) => {
  const [coachData, setCoachData] = useState<IUserData>({} as IUserData);
  const { t } = useTranslation();

  useEffect(() => {
    const getCoachData = async () => {
      if (!coachID) return;
      try {
        const response = await serviceGetOtherUserData(coachID);
        setCoachData(response.data);
      } catch (error) {
        console.error("get coach data error", error);
      }
    };

    getCoachData();
  }, [coachID]);

  return (
    <View className="flex-1 bg-gray-veryLight p-4">
      {coachData?.id ? (
        <CoachBanner coachData={coachData} />
      ) : (
        <EmptyCoachBanner />
      )}
    </View>
  );
};

export default CoachTabViewOnly;
