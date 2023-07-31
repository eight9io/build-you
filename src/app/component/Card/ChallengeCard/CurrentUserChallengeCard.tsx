import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import clsx from "clsx";
import { Image } from "expo-image";

import { IChallenge, IChallengeOwner } from "../../../types/challenge";
import { getChallengeStatusColor } from "../../../utils/common";

import CheckCircle from "../../asset/check_circle.svg";
import BackSvg from "../../asset/back.svg";
import { CompanyTag } from "./ChallengeCard";
import { useUserProfileStore } from "../../../store/user-store";
import { StackActions } from "@react-navigation/native";

interface ICurrentUserChallengeCardProps {
  item: IChallenge;
  imageSrc: string | null | undefined;
  navigation?: any;
}

const CurrentUserChallengeCard: React.FC<ICurrentUserChallengeCardProps> = ({
  item,
  imageSrc,
  navigation,
}) => {
  const challengeOwner = Array.isArray(item?.owner)
    ? item?.owner[0]
    : item?.owner;
  const companyName = challengeOwner.companyAccount && challengeOwner?.name;

  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();

  const onPress = () => {
    if (navigation) {
      // navigation.navigate("PersonalChallengeDetailScreen", {
      //   challengeId: item.id,
      // });
      const action = StackActions.push("PersonalChallengeDetailScreen", {
        challengeId: item.id,
      });
      navigation.dispatch(action);
      return;
    }
  };
  // find participants status with current user
  const isCurrentUserParticipant = item?.participants?.find(
    (participant) => participant.id === currentUser?.id
  );

  const challengeStatus =
    challengeOwner.id === currentUser?.id
      ? item.status
      : isCurrentUserParticipant?.challengeStatus;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={clsx("mb-5 w-full rounded-xl border border-gray-80 bg-white")}
    >
      <View className={clsx("relative w-full")}>
        {companyName && (
          <View className={clsx("absolute top-6 z-10 flex w-full items-end")}>
            <CompanyTag companyName={companyName} />
          </View>
        )}
        {imageSrc && (
          <Image
            className={clsx("aspect-square w-full rounded-t-xl")}
            source={{ uri: imageSrc }}

          />
        )}
        <View
          className={clsx(
            "flex flex-row items-center justify-between px-4 py-3"
          )}
        >
          <View className={clsx("flex-1 flex-row items-center")}>
            <CheckCircle
              fill={getChallengeStatusColor(challengeStatus, item.status)}
            />
            <View className="flex-1">
              <Text className={clsx("pl-2 text-h6 font-semibold leading-6")}>
                {item?.goal}
              </Text>
            </View>
          </View>
          <View className={clsx("flex w-10 items-end")}>
            <BackSvg />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CurrentUserChallengeCard;
