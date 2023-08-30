import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import clsx from "clsx";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";

import { IChallenge, IChallengeOwner } from "../../../types/challenge";
import { getChallengeStatusColor } from "../../../utils/common";

import CheckCircle from "../../asset/check_circle.svg";
import BackSvg from "../../asset/back.svg";
import { useUserProfileStore } from "../../../store/user-store";
import { StackActions } from "@react-navigation/native";
import { serviceGetChallengeRating } from "../../../service/challenge";

import StarFillSvg from "../../../common/svg/star-fill.svg";

export interface IChallengeCardProps {
  item: IChallenge;
  isCompanyAccount?: boolean | undefined | null;
  imageSrc: string | null | undefined;
  navigation?: any;
  handlePress?: () => void;
  isFromOtherUser?: boolean;
}

export const CompanyTag = ({
  companyName,
}: {
  companyName: string | false | undefined;
}) => {
  const { t } = useTranslation();
  if (!companyName) return null;
  if (companyName?.length > 13) {
    companyName = companyName.slice(0, 13) + "...";
  }
  return (
    <View className="flex h-8 w-2/5 flex-row items-center rounded-l-md bg-primary-default">
      <View className="mx-2 h-[20px] w-[20px] rounded-full bg-gray-200 py-1"></View>
      <Text className="text-md font-normal text-white">
        {companyName || t("company") || "Company"}
      </Text>
    </View>
  );
};

const ChallengeCard: React.FC<IChallengeCardProps> = ({
  item,
  imageSrc,
  isCompanyAccount,
  navigation,
  handlePress,
  isFromOtherUser = false,
}) => {
  const [ratedValue, setRatedValue] = useState<number>(0);

  const challengeOwner = Array.isArray(item?.owner)
    ? item?.owner[0]
    : item?.owner;
  const companyName = challengeOwner.companyAccount && challengeOwner?.name;

  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();

  const isCurrentUserParticipant = item?.participants?.find(
    (participant) => participant.id === currentUser?.id
  );

  const challengeStatus =
    challengeOwner.id === currentUser?.id || !isCurrentUserParticipant
      ? item.status
      : isCurrentUserParticipant?.challengeStatus;

  const onPress = () => {
    if (navigation) {
      if (isCompanyAccount && !isFromOtherUser) {
        return navigation.navigate("CompanyChallengeDetailScreen", {
          challengeId: item.id,
        });
      } else if (isFromOtherUser) {
        if (companyName) {
          const action = StackActions.push(
            "OtherUserProfileChallengeDetailsScreen",
            {
              challengeId: item.id,
              isCompanyAccount: true,
            }
          );
          navigation.dispatch(action);
          return;
        }
        const action = StackActions.push(
          "OtherUserProfileChallengeDetailsScreen",
          {
            challengeId: item.id,
          }
        );

        navigation.dispatch(action);
        return;
      }
      navigation.navigate("PersonalChallengeDetailScreen", {
        challengeId: item.id,
      });
      return;
    }
    if (handlePress) handlePress();
  };

  useEffect(() => {
    const fetchChallengeRating = async () => {
      try {
        const res = await serviceGetChallengeRating(item?.id);
        const rating = res.data?.rateAverage;
        setRatedValue(rating);
      } catch (_) {
        setRatedValue(0);
      }
    };
    fetchChallengeRating();
  }, []);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={clsx("mb-5 w-full rounded-xl border border-gray-80 bg-white")}
    >
      <View className={clsx("relative w-full")}>
        {(isCompanyAccount || companyName) && (
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
          <View className={clsx("flex flex-row items-end")}>
            {ratedValue > 0 && (
              <View className={clsx("mr-4 flex flex-row items-center")}>
                <Text className={clsx("mr-1 text-h6 font-semibold leading-6")}>
                  {ratedValue}/{5}
                </Text>
                <StarFillSvg width={18} height={18} />
              </View>
            )}
            <BackSvg />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChallengeCard;
