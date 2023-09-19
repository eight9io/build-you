import React, { FC, useEffect, useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Image } from "expo-image";

import { IUserData } from "../../../../types/user";

import { serviceGetOtherUserData } from "../../../../service/user";
import { getChallengeById } from "../../../../service/challenge";

import DefaultAvatar from "../../../../component/asset/default-avatar.svg";
import { IChallenge } from "../../../../types/challenge";
import { IFormValueInput } from "../../../OnboardingScreens/CompleteProfile/CompleteProfileStep4";

import CheckedSvg from "../../../../component/asset/checked.svg";
import UncheckedSvg from "../../../../component/asset/uncheck.svg";
import WarningSvg from "../../../../component/asset/warning.svg";
import { ScrollView } from "react-native-gesture-handler";
import Button from "../../../../component/common/Buttons/Button";

interface ICoachRateChallengeScreenProps {
  route: {
    params: {
      userId: string;
      challengeId: string;
    };
  };
}

interface IRenderSoftSkillProgress {
  t: any;
  item: IFormValueInput;
  changeSkillValue: any;
  skillValueError: boolean;
}

const MAX_PROGRESS_VALUE = 5;

const mockSelectedCompetencedSkill: IFormValueInput[] = [
  {
    id: "2fae6a03-1f44-4011-bfdc-06857a5306f7",
    label: "Communication",
    value: 4,
  },
  {
    id: "9684ed65-10da-42d0-918a-c4161c1adb44",
    label: "Creativity",
    value: 2,
  },
  {
    id: "6d1fb37c-81cc-43f6-8ccc-15f1393656ae",
    label: "Leadership",
    value: 5,
  },
];

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
            {item.label}
          </Text>
        </View>
        <View className="flex flex-1 flex-row  justify-end pt-2">
          {Array.from(Array(MAX_PROGRESS_VALUE).keys()).map((_, index) => (
            <TouchableOpacity
              className="pr-4"
              key={`${randomId}${index}`}
              onPress={() => changeSkillValue(item?.label, index + 1)}
              testID={`${item.testID}_progress_${index}`}
            >
              {index < item?.value ? (
                <CheckedSvg />
              ) : (
                <UncheckedSvg className="text-gray-light" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {skillValueError && item?.value === 0 && (
        <View className="flex flex-row items-center">
          <WarningSvg />
          <Text
            className="pl-1 text-sm text-red-500"
            testID={`${item.testID}_error`}
          >
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
  selectedCompetencedSkill: IFormValueInput[],
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

const CoachRateChallengeScreen: FC<ICoachRateChallengeScreenProps> = ({
  route,
}) => {
  const [userToRate, setUserToRate] = useState<IUserData>(null);
  const [challengeToRateData, setChallengeToRateData] =
    useState<IChallenge>(null);
  const [selectedCompetencedSkill, setSelectedCompetencedSkill] = useState<
    any[]
  >([]);
  const [skillValueError, setSkillValueError] = useState<boolean>(false);

  const { userId, challengeId } = route.params;
  const { t } = useTranslation();

  const fetchUserToRate = async () => {
    try {
      const response = await serviceGetOtherUserData(userId);
      setUserToRate(response.data);
    } catch (error) {
      console.log("CoachRateChallengeScreen", error);
    }
  };

  const fetchChallengeToRate = async () => {
    try {
      const response = await getChallengeById(challengeId);
    } catch (error) {
      console.log("CoachRateChallengeScreen", error);
    }
  };

  // useEffect(() => {
  //   fetchUserToRate();
  //   fetchChallengeToRate();
  // }, []);

  const changeSkillValue = (skill: string, value: number) => {
    const newSelectedCompetencedSkill = selectedCompetencedSkill.map((item) => {
      if (item.label === skill) {
        return {
          ...item,
          value,
        };
      }
      return item;
    });
    setSelectedCompetencedSkill(newSelectedCompetencedSkill);
  };

  return (
    <SafeAreaView className="relative flex-1 bg-white">
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
                source={userToRate?.avatar}
              />
            )}
          </View>
          <Text className="font-open-sans leading-140 text-xl font-medium">
            Robert Trini
          </Text>
        </View>

        <View className="w-full flex-col justify-between px-5 pt-6">
          {renderSelectedSoftSkill(
            t,
            mockSelectedCompetencedSkill,
            changeSkillValue,
            skillValueError
          )}
        </View>
      </ScrollView>
      <View className="absolute bottom-6 w-full">
        <Button
          testID="complete_profile_step_4_next_button"
          title={t("save") || "Save"}
          containerClassName=" bg-primary-default my-5 mx-5 "
          textClassName="text-white text-md leading-6 font-semibold"
          onPress={() => console.log("a")}
        />
      </View>
    </SafeAreaView>
  );
};

export default CoachRateChallengeScreen;
