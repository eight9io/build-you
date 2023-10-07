import clsx from "clsx";
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Image } from "expo-image";

import {
  serviceRateSoftSkillCertifiedChallenge,
  getChallengeById,
  serviceGetRatedSoftSkillCertifiedChallenge,
} from "../../service/challenge";
import { serviceGetOtherUserData } from "../../service/user";

import { IChallenge, IChallengeOwner, ISoftSkill } from "../../types/challenge";
import { IUserData } from "../../types/user";

import { extractSkillsFromChallengeData } from "../../utils/challenge";

import Button from "../common/Buttons/Button";
import GlobalToastController from "../common/Toast/GlobalToastController";

import DefaultAvatar from "../asset/default-avatar.svg";
import CheckedSvg from "../../component/asset/checked.svg";
import UncheckedSvg from "../../component/asset/uncheck.svg";
import WarningSvg from "../../component/asset/warning.svg";
import Header from "../common/Header";

interface ICoachRateChallengeModalProps {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  challengeOwner: IChallengeOwner;
  challengeData: IChallenge;
  setShouldParentRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IRenderSoftSkillProgress {
  t: any;
  item: ISoftSkill;
  changeSkillValue: any;
  skillValueError: boolean;
}

const MAX_PROGRESS_VALUE = 5;

const renderSoftSkillProgress: FC<IRenderSoftSkillProgress> = ({
  t,
  item,
  changeSkillValue,
  skillValueError,
}) => {
  const randomId = Math.random().toString();
  return (
    <View className="flex w-full flex-col">
      <View className="flex w-full flex-col items-center justify-between">
        <View>
          <Text className="w-44 text-h6 font-medium leading-6 text-black-default">
            {item.skill}
          </Text>
        </View>
        <View className="flex flex-1 flex-row  justify-end pt-2">
          {Array.from(Array(MAX_PROGRESS_VALUE).keys()).map((_, index) => (
            <TouchableOpacity
              className="pr-4"
              key={`${randomId}${index}`}
              onPress={() => changeSkillValue(item?.skill, index + 1)}
            >
              {index < item?.rating ? (
                <CheckedSvg />
              ) : (
                <UncheckedSvg className="text-gray-light" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {skillValueError && (item?.rating === 0 || !item?.rating) && (
        <View className="flex flex-row items-center pt-3">
          <WarningSvg />
          <Text className="pl-1 text-sm text-red-500">
            {t("form_onboarding.screen_4.error_rate") ||
              "Please rate from 1 to 5"}
          </Text>
        </View>
      )}
    </View>
  );
};

const renderSelectedSoftSkill = (
  t: any,
  selectedCompetencedSkill: ISoftSkill[],
  changeSkillValue: any,
  skillValueError: boolean
) => {
  const randomId = Math.random().toString();
  return (
    <View className="flex flex-col flex-wrap">
      {selectedCompetencedSkill.map((item, index) => (
        <View className="pb-6" key={`${randomId}${index}`}>
          {renderSoftSkillProgress({
            t,
            item,
            changeSkillValue,
            skillValueError,
          })}
        </View>
      ))}
    </View>
  );
};

const CoachRateChallengeModal: FC<ICoachRateChallengeModalProps> = ({
  isVisible,
  setIsVisible,
  challengeOwner,
  challengeData,
  setShouldParentRefresh,
}) => {
  const [selectedCompetencedSkill, setSelectedCompetencedSkill] = useState<
    ISoftSkill[]
  >([]);
  const [ratedCompetencedSkill, setRatedCompetencedSkill] = useState<
    ISoftSkill[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [skillValueError, setSkillValueError] = useState<boolean>(false);

  const { t } = useTranslation();
  const isChallengeRated = ratedCompetencedSkill.length > 0;
  const challengeOwnerId = challengeOwner?.id;
  const challengeId = challengeData?.id;

  const handleSummitRatingSkills = async () => {
    try {
      const isAllSkillRated = selectedCompetencedSkill.every(
        (item) => item.rating !== 0 && item.rating !== undefined
      );
      if (!isAllSkillRated) {
        setSkillValueError(true);
        return;
      }
      const data = selectedCompetencedSkill.map((item) => ({
        id: item.id,
        rating: item.rating,
      }));

      await serviceRateSoftSkillCertifiedChallenge(
        challengeId,
        challengeOwnerId,
        data
      );
      setShouldParentRefresh(true);
      setIsVisible(false);
      GlobalToastController.showModal({
        message: t("toast.rate_skills_success") || "Rate skills successfully!",
      });
    } catch (error) {
      setIsVisible(false);
    }
  };

  const changeSkillValue = (skill: string, value: number) => {
    const newSelectedCompetencedSkill = selectedCompetencedSkill.map((item) => {
      if (item.skill === skill) {
        return {
          ...item,
          rating: value,
        };
      }
      return item;
    });
    setSelectedCompetencedSkill(newSelectedCompetencedSkill);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const [ratedSoffSkillsValue] = await Promise.allSettled([
          serviceGetRatedSoftSkillCertifiedChallenge(challengeId),
        ]);
        if (ratedSoffSkillsValue.status === "fulfilled") {
          const ratedSoffSkills = ratedSoffSkillsValue.value.data.map(
            (item) => {
              return {
                id: item.skillId,
                skill: item.skillName,
                rating: item.skillRating,
              };
            }
          );
          setRatedCompetencedSkill(ratedSoffSkills);
        } else {
          console.log(
            "CoachRateChallengeModal - Error fetching rated skills:",
            ratedSoffSkillsValue.reason
          );
        }
      } catch (error) {
        console.log("CoachRateChallengeModal - Error fetching data:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };
    if (challengeId) {
      getData();
      const skillsToRate: ISoftSkill[] =
        extractSkillsFromChallengeData(challengeData);
      setSelectedCompetencedSkill(skillsToRate);
    }
  }, [challengeId]);

  const onClose = () => {
    setIsVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={isVisible}
      className="h-full"
    >
      <SafeAreaView className="relative flex-1 bg-white">
        <View className="px-4">
          <Header
            title={
              t("challenge_detail_screen.rate_skills") ||
              ("Rate skills" as string)
            }
            leftBtn={t("add_new_challenge_progress_modal.cancel") || "Cancel"}
            onLeftBtnPress={onClose}
            containerStyle={Platform.OS === "ios" ? "mt-5" : "mt-0"}
          />
        </View>

        {!isLoading && (
          <View className="relative flex-1 bg-white">
            <ScrollView className="flex-1">
              <View className="flex flex-col items-center ">
                <View
                  className={clsx("mt-5 rounded-full border-4 border-white")}
                >
                  {!challengeOwner?.avatar && (
                    <View
                      className={clsx(
                        "z-10 h-[100px] w-[100px] rounded-full  bg-white"
                      )}
                    >
                      <DefaultAvatar width={100} height={100} />
                    </View>
                  )}
                  {challengeOwner?.avatar && (
                    <Image
                      className={clsx("h-[100px] w-[100px] rounded-full")}
                      source={challengeOwner?.avatar}
                    />
                  )}
                </View>
                <Text className="font-open-sans leading-140 text-xl font-medium">
                  {challengeOwner?.name} {challengeOwner?.surname}
                </Text>
              </View>

              <View className="w-full flex-col justify-between px-5 pt-6">
                {renderSelectedSoftSkill(
                  t,
                  isChallengeRated
                    ? ratedCompetencedSkill
                    : selectedCompetencedSkill,
                  changeSkillValue,
                  skillValueError
                )}
              </View>
            </ScrollView>
            {!isChallengeRated && (
              <View className="absolute bottom-6 w-full">
                <Button
                  testID="complete_profile_step_4_next_button"
                  title={t("save") || "Save"}
                  containerClassName=" bg-primary-default my-5 mx-5 "
                  textClassName="text-white text-md leading-6 font-semibold"
                  onPress={handleSummitRatingSkills}
                />
              </View>
            )}
          </View>
        )}
        {isLoading && <ActivityIndicator size={"large"} className="pt-10" />}
      </SafeAreaView>
    </Modal>
  );
};

export default CoachRateChallengeModal;
