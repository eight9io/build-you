import React, { FC, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Route } from "@react-navigation/native";

import { IChallenge, ISoftSkill } from "../../types/challenge";
import { IUserData } from "../../types/user";
import { serviceRateSoftSkillCertifiedChallenge } from "../../service/challenge";

import DefaultAvatar from "../../common/svg/default-avatar.svg";
import Header from "../../component/common/Header";
import CheckedSvg from "../../component/asset/checked.svg";
import UncheckedSvg from "../../component/asset/uncheck.svg";
import WarningSvg from "../../component/asset/warning.svg";
import GlobalToastController from "../../component/common/Toast/GlobalToastController";
import Button from "../../component/common/Buttons/Button";
import { useRefresh } from "../../context/refresh.context";
import { useNav } from "../../hooks/useNav";

interface ICoachRateCompanyChallengeScreenProps {
  route: Route<
    "CoachRateCompanyChallengeScreen",
    {
      userToRate: IUserData;
      challengeData: IChallenge;
      canCurrentUserRateSkills: boolean;
    }
  >;
}

const extractSkillsFromUserData = (userData: IUserData) => {
  const skillsToRate: ISoftSkill[] = userData?.skills?.map((item) => item);
  return skillsToRate;
};

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
      <View className="flex w-full flex-col">
        <View>
          <Text className="w-44 text-h6 font-medium leading-6 text-black-default">
            {item.skill}
          </Text>
        </View>
        <View className="flex flex-1 flex-row pt-2">
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
      {skillValueError && (item?.rating === 0 || !item?.rating) ? (
        <View className="flex flex-row items-center pt-3">
          <WarningSvg />
          <Text className="pl-1 text-sm text-red-500">
            {t("form_onboarding.screen_4.error_rate") ||
              "Please rate from 1 to 5"}
          </Text>
        </View>
      ) : null}
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

const CoachRateCompanyChallengeScreen: FC<
  ICoachRateCompanyChallengeScreenProps
> = ({
  route: {
    params: { userToRate, challengeData, canCurrentUserRateSkills },
  },
}) => {
  const navigation = useNav();
  const { setRefresh: refreshParentData } = useRefresh();
  const [selectedCompetencedSkill, setSelectedCompetencedSkill] = useState<
    ISoftSkill[]
  >([]);
  const [skillValueError, setSkillValueError] = useState<boolean>(false);

  const { t } = useTranslation();

  const userToRateId = userToRate?.id;
  const challengeId = challengeData?.id;

  const isChallengeRated = useMemo(() => {
    if (!selectedCompetencedSkill) return null;
    selectedCompetencedSkill.every((item) => item.isRated);
  }, [selectedCompetencedSkill]);

  useEffect(() => {
    if (userToRate) {
      const skillsToRate: ISoftSkill[] = extractSkillsFromUserData(userToRate);
      setSelectedCompetencedSkill(skillsToRate);
    }
  }, [userToRate]);

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
      // setShouldParentRefresh(true);
      // setIsVisible(false);
      refreshParentData(true);
      onClose();
      GlobalToastController.showModal({
        message: t("toast.rate_skills_success") || "Rate skills successfully!",
      });
    } catch (error) {
      console.error("Rating skill error: ", error);
      // setIsVisible(false);
      onClose();
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

  const onClose = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-4">
        <Header
          title={
            t("challenge_detail_screen.rate_skills") ||
            ("Rate skills" as string)
          }
          leftBtn={t("add_new_challenge_progress_modal.cancel") || "Cancel"}
          // onLeftBtnPress={() => setIsVisible(false)}
          onLeftBtnPress={onClose}
          containerStyle="mt-0"
        />
      </View>

      <View className="relative flex-1 bg-white">
        <ScrollView className="flex-1">
          <View className="flex flex-col items-center ">
            <View className={clsx("mt-5 rounded-full border-4 border-white")}>
              {!userToRate?.avatar ? (
                <View
                  className={clsx(
                    "z-10 h-[100px] w-[100px] rounded-full  bg-white"
                  )}
                >
                  <DefaultAvatar width={100} height={100} />
                </View>
              ) : null}
              {userToRate?.avatar ? (
                <Image
                  className={clsx("h-[100px] w-[100px] rounded-full")}
                  source={userToRate?.avatar.trim()}
                />
              ) : null}
            </View>
            <Text className="font-open-sans leading-140 text-xl font-medium">
              {userToRate?.name} {userToRate?.surname}
            </Text>
          </View>
          {!canCurrentUserRateSkills ? (
            <View className="flex flex-row items-center justify-between px-4 pt-4">
              <Text className="text-md  text-danger-default">
                {t("challenge_detail_screen.can_not_rate_skills")}
              </Text>
            </View>
          ) : null}

          <View className="w-full flex-col justify-between px-5 pt-6">
            {selectedCompetencedSkill
              ? renderSelectedSoftSkill(
                  t,
                  selectedCompetencedSkill,
                  changeSkillValue,
                  skillValueError
                )
              : null}
          </View>
        </ScrollView>
        {!isChallengeRated && canCurrentUserRateSkills ? (
          <View className="absolute bottom-6 w-full">
            <Button
              testID="complete_profile_step_4_next_button"
              title={t("save") || "Save"}
              containerClassName=" bg-primary-default my-5 mx-5 flex-none"
              textClassName="text-white text-md leading-6 font-semibold"
              onPress={handleSummitRatingSkills}
            />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default CoachRateCompanyChallengeScreen;
