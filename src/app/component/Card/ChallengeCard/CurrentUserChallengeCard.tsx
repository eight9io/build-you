import clsx from "clsx";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { IChallenge } from "../../../types/challenge";
import {
  getChallengeStatusColor,
  roundToDecimalOrWhole,
} from "../../../utils/common";

import CheckCircle from "../../asset/check_circle.svg";
import BackSvg from "../../asset/back.svg";
import { CertifiedChallengeTag, CompanyTag } from "./ChallengeCard";
import { useUserProfileStore } from "../../../store/user-store";
import { StackActions } from "@react-navigation/native";
import { serviceGetChallengeRating } from "../../../service/challenge";

import StarFillSvg from "../../../common/svg/star-fill.svg";
import EmptyImage from "../../../common/svg/empty-image.svg";
import { useChallengeUpdateStore } from "../../../store/challenge-update-store";
import GlobalDialogController from "../../common/Dialog/GlobalDialog/GlobalDialogController";

interface ICurrentUserChallengeCardProps {
  item: IChallenge;
  imageSrc: string | null | undefined;
  navigation?: any;
}

export const PaymentPendingTag = ({
  translate,
}: {
  translate: (key: string) => string;
}) => {
  return (
    <View className="flex h-8 w-3/6 flex-row items-center rounded-l-md bg-primary-default">
      <Text className="pl-4 text-md font-normal text-white">
        {translate("pending_payment")}
      </Text>
    </View>
  );
};

const CurrentUserChallengeCard: React.FC<ICurrentUserChallengeCardProps> = ({
  item,
  imageSrc,
  navigation,
}) => {
  const [ratedValue, setRatedValue] = useState<number>(0);

  const isDraft = item.isDraft;
  const challengeOwner = Array.isArray(item?.owner)
    ? item?.owner[0]
    : item?.owner;
  const companyName = challengeOwner.companyAccount && challengeOwner?.name;

  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();
  const { getChallengeRatingUpdate } = useChallengeUpdateStore();
  const challengeRatingUpdate = getChallengeRatingUpdate();

  const { t } = useTranslation();

  const onPress = () => {
    if (isDraft) {
      GlobalDialogController.showModal({
        title: t("dialog.pending_payment.title"),
        message: t("dialog.pending_payment.description"),
      });
      return;
    }
    if (navigation) {
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

  const isCertifiedChallenge = item?.type === "certified";

  const challengeStatus =
    challengeOwner.id === currentUser?.id
      ? item.status
      : isCurrentUserParticipant?.challengeStatus;

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

  useEffect(() => {
    if (challengeRatingUpdate?.id === item?.id) {
      setRatedValue(challengeRatingUpdate?.rating);
    }
  }, [challengeRatingUpdate?.id]);

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
        {isDraft && (
          <View className={clsx("absolute top-6 z-10 flex w-full items-end")}>
            <PaymentPendingTag translate={t} />
          </View>
        )}
        {isCertifiedChallenge && (
          <View
            className={clsx(
              "absolute left-4 top-6 z-10 flex w-full items-start"
            )}
          >
            <CertifiedChallengeTag />
          </View>
        )}
        {imageSrc && (
          <View className="w-100 aspect-square overflow-hidden">
            <Image
              className={clsx("aspect-square w-full rounded-t-xl")}
              source={{ uri: imageSrc }}
            />
            {isDraft && (
              <View
                className="absolute aspect-square w-full rounded-t-xl"
                style={{
                  backgroundColor: "rgba(45, 45, 45, 0.5)",
                }}
              />
            )}
          </View>
        )}
        {!imageSrc && (
          <View className="w-100 flex aspect-square items-center justify-center overflow-hidden">
            <EmptyImage className="aspect-square w-full rounded-t-xl" />
            {isDraft && (
              <View
                className="absolute aspect-square w-full rounded-t-xl"
                style={{
                  backgroundColor: "rgba(45, 45, 45, 0.5)",
                }}
              />
            )}
          </View>
        )}
        <View
          className={clsx(
            "flex flex-row items-center justify-between rounded-b-xl px-4 py-3"
          )}
          style={{
            backgroundColor: isDraft
              ? "rgba(45, 45, 45, 0.3)"
              : "rgba(45, 45, 45, 0)",
          }}
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
                  {roundToDecimalOrWhole(ratedValue)}/{5}
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

export default CurrentUserChallengeCard;
