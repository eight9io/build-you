import React, { FC, useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";

import { IChallenge, ISoftSkill } from "../../types/challenge";
import { IUserData } from "../../types/user";
import { serviceRateSoftSkillCertifiedChallenge } from "../../service/challenge";
import GlobalToastController from "../common/Toast/GlobalToastController";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import Button from "../common/Buttons/Button";
import Header from "../common/Header";

import DefaultAvatar from "../asset/default-avatar.svg";
import { renderSelectedSoftSkill } from "./CoachRateChallengeModal";

interface ICoachRateChallengeModalProps {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  userToRate: IUserData;
  challengeData: IChallenge;
  setShouldParentRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  canCurrentUserRateSkills: boolean;
}

const extractSkillsFromUserData = (userData: IUserData) => {
  const skillsToRate: ISoftSkill[] = userData?.skills?.map((item) => item);
  return skillsToRate;
};

const CoachRateCompanyChallengeModal: FC<ICoachRateChallengeModalProps> = ({
  isVisible,
  setIsVisible,
  userToRate,
  challengeData,
  setShouldParentRefresh,
  canCurrentUserRateSkills,
}) => {
  const [selectedCompetencedSkill, setSelectedCompetencedSkill] = useState<
    ISoftSkill[]
  >([]);
  const [skillValueError, setSkillValueError] = useState<boolean>(false);

  const { t } = useTranslation();

  const userToRateId = userToRate?.id;
  const challengeId = challengeData?.id;

  const isChallengeRated = selectedCompetencedSkill.every(
    (item) => item.isRated
  );

  console.log(isChallengeRated);

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
        userToRateId,
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
    if (!canCurrentUserRateSkills) return;
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
    if (userToRate) {
      const skillsToRate: ISoftSkill[] = extractSkillsFromUserData(userToRate);
      setSelectedCompetencedSkill(skillsToRate);
    }
  }, [userToRate]);

  console.log(selectedCompetencedSkill);

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
            onLeftBtnPress={() => setIsVisible(false)}
            containerStyle={Platform.OS === "ios" ? "mt-5" : "mt-0"}
          />
        </View>

        <View className="relative flex-1 bg-white">
          <ScrollView className="flex-1">
            <View className="flex flex-col items-center ">
              <View className={clsx("mt-5 rounded-full border-4 border-white")}>
                {!userToRate?.avatar && (
                  <View
                    className={clsx(
                      "z-10 h-[100px] w-[100px] rounded-full  bg-white"
                    )}
                  >
                    <DefaultAvatar width={100} height={100} />
                  </View>
                )}
                {userToRate?.avatar && (
                  <Image
                    className={clsx("h-[100px] w-[100px] rounded-full")}
                    source={userToRate?.avatar.trim()}
                  />
                )}
              </View>
              <Text className="font-open-sans leading-140 text-xl font-medium">
                {userToRate?.name} {userToRate?.surname}
              </Text>
            </View>
            {!canCurrentUserRateSkills && (
              <View className="flex flex-row items-center justify-between px-4 pt-4">
                <Text className="text-md  text-danger-default">
                  {t("challenge_detail_screen.can_not_rate_skills")}
                </Text>
              </View>
            )}

            <View className="w-full flex-col justify-between px-5 pt-6">
              {renderSelectedSoftSkill(
                t,
                selectedCompetencedSkill,
                changeSkillValue,
                skillValueError
              )}
            </View>
          </ScrollView>
          {!isChallengeRated && canCurrentUserRateSkills && (
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
      </SafeAreaView>
    </Modal>
  );
};

export default CoachRateCompanyChallengeModal;
