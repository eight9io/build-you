import React, { FC, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  FlatList,
} from "react-native";

import clsx from "clsx";
import { useTranslation } from "react-i18next";
import DropDownPicker from "react-native-dropdown-picker";
import Checkbox from "expo-checkbox";

import { useCompleteProfileStore } from "../../../store/complete-user-profile";
import { useUserProfileStore } from "../../../store/user-store";

import { useGetUserData } from "../../../hooks/useGetUser";

import StepOfSteps from "../../../component/common/StepofSteps";
import { CompleteProfileScreenNavigationProp } from "./CompleteProfile";
import Button from "../../../component/common/Buttons/Button";
import SoftSkillPicker from "../../../component/SoftSkillPicker/SoftSkillPicker";

import CheckedSvg from "./asset/checked.svg";
import UncheckedSvg from "./asset/uncheck.svg";
import WarningSvg from "../../../component/asset/warning.svg";

import httpInstance from "../../../utils/http";
import { uploadNewVideo } from "../../../utils/uploadVideo";
import GlobalDialogController from "../../../component/common/Dialog/GlobalDialogController";

interface CompleteProfileStep4Props {
  navigation: CompleteProfileScreenNavigationProp;
}

interface IFetchedSkill {
  id: string;
  skill: string;
}
interface ISkillProps {
  skill: IFetchedSkill;
  rating: number;
}

interface IFormValueInput {
  label: string;
  value: number; //rating
  id: string;
  testID?: string;
}

interface IRenderSoftSkillProgress {
  item: IFormValueInput;
  changeSkillValue: any;
  skillValueError: boolean;
}

const NUMBER_OF_SKILL_REQUIRED = 3;
const MAX_PROGRESS_VALUE = 5;

const renderSoftSkillProgress: FC<IRenderSoftSkillProgress> = ({
  item,
  changeSkillValue,
  skillValueError,
}) => {
  const randomId = Math.random().toString();
  const { t } = useTranslation();
  return (
    <View className="flex w-full flex-col">
      <View className="flex w-full flex-row items-center justify-between">
        <View>
          <Text className="w-44 text-h6 font-medium leading-6 text-black-default">
            {item.label}
          </Text>
        </View>
        <View className="flex flex-1 flex-row  justify-end">
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

const convertSelectedToSoftSkillProps = (
  selectedCompetencedSkill: IFormValueInput[]
): ISkillProps[] => {
  return selectedCompetencedSkill.map((item) => ({
    skill: {
      id: item?.id,
      skill: item?.label,
    },
    rating: item?.value,
  }));
};

const CompleteProfileStep4: FC<CompleteProfileStep4Props> = ({
  navigation,
}) => {
  const { t } = useTranslation();

  const [selectedCompetencedSkill, setSelectedCompetencedSkill] = useState<
    IFormValueInput[]
  >([]);
  const [numberOfSkillError, setNumberOfSkillError] = useState<boolean>(false);
  const [skillValueError, setSkillValueError] = useState<boolean>(false);

  const { setSoftSkills, getProfile } = useCompleteProfileStore();
  const { setUserProfile, getUserProfileAsync } = useUserProfileStore();

  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [value, setValue] = useState<string[]>([]);

  useGetUserData();
  const { getUserProfile } = useUserProfileStore();
  const userData = getUserProfile();

  const checkAllSkillValueGreaterThanZero = () => {
    const isGreaterThanZero = selectedCompetencedSkill.every(
      (item) => item.value > 0
    );
    if (!isGreaterThanZero) {
      setSkillValueError(true);
    }
    return isGreaterThanZero;
  };

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

  const checkSoftSkillRequired = () => {
    if (selectedCompetencedSkill.length < NUMBER_OF_SKILL_REQUIRED) {
      setNumberOfSkillError(true);
      return false;
    }
    setNumberOfSkillError(false);
    return true;
  };

  const handleSubmitForm = async () => {
    setOpenDropdown(false);
    setSoftSkills(selectedCompetencedSkill);
    const profile = getProfile();
    if (!checkSoftSkillRequired() || !checkAllSkillValueGreaterThanZero())
      return;
    const softSkills = convertSelectedToSoftSkillProps(
      selectedCompetencedSkill
    );

    if (!userData?.id) {
      GlobalDialogController.showModal({
        title: t("dialog.err_title"),
        message:
          (t("error_general_message") as string) || "Something went wrong",
        button: t("dialog.ok"),
      });
      return;
    }

    console.log(userData.id);
    try {
      await Promise.all([
        uploadNewVideo(profile?.video),
        httpInstance.put(`/user/update/${userData.id}`, {
          name: profile?.name,
          surname: profile?.surname,
          birth: profile?.birth,
          occupation: profile?.occupation,
          bio: profile?.biography,
          softSkill: softSkills,
          hardSkill: profile.skills,
          company: "",
        }),
      ]);
      await getUserProfileAsync();
      navigation.navigate("CompleteProfileFinishScreen");
    } catch (error) {
      GlobalDialogController.showModal({
        title: t("dialog.err_title"),
        message:
          (t("error_general_message") as string) || "Something went wrong",
      });
    }
  };

  const addCompetencedSkill = (skill: IFormValueInput | undefined) => {
    if (!skill) return;
    const isSkillAlreadySelected = selectedCompetencedSkill.find(
      (item) => item.label === skill.label
    );
    if (isSkillAlreadySelected) {
      const newSelectedCompetencedSkill = selectedCompetencedSkill.filter(
        (item) => item.label !== skill.label
      );
      setSelectedCompetencedSkill(newSelectedCompetencedSkill);
      return;
    }
    setSelectedCompetencedSkill([...selectedCompetencedSkill, skill]);
  };

  return (
    <TouchableWithoutFeedback onPress={() => setOpenDropdown(false)}>
      <FlatList
        data={[]}
        renderItem={() => <View />}
        keyExtractor={() => "empty"}
        ListHeaderComponent={() => (
          <View>
            <View>
              <StepOfSteps step={4} totalSteps={4} />
            </View>
            <View className="px-16 py-6">
              <Text className="text-center text-h4 font-semibold leading-6 text-black-default">
                {t("form_onboarding.screen_4.title") ||
                  "Select the soft skills you are already competent on"}
              </Text>
              <Text className="pt-2 text-center text-h6 font-normal leading-5 text-gray-dark">
                {t("form_onboarding.screen_4.sub_title") ||
                  "Please select at least 3 different soft skills and rate it from 1 to 5."}
              </Text>
            </View>
          </View>
        )}
        ListFooterComponent={() => (
          <View>
            <View className="flex w-full pt-5 ">
              <View className="flex flex-col px-5">
                <Text className="pb-2 text-md font-semibold text-primary-default">
                  {t("form_onboarding.screen_4.soft_skills") || "Soft skills"}
                </Text>
                <SoftSkillPicker
                  value={value}
                  setValue={setValue}
                  openDropdown={openDropdown}
                  setOpenDropdown={setOpenDropdown}
                  skillValueError={skillValueError}
                  numberOfSkillError={numberOfSkillError}
                  selectedCompetencedSkill={selectedCompetencedSkill}
                  setSelectedCompetencedSkill={setSelectedCompetencedSkill}
                />
              </View>
            </View>
            {!openDropdown && (
              <Button
                testID="complete_profile_step_4_next_button"
                title={t("button.next") || "Next"}
                containerClassName=" bg-primary-default my-5 mx-5 "
                textClassName="text-white text-md leading-6"
                onPress={() => handleSubmitForm()}
              />
            )}
          </View>
        )}
      />

      {/* <ScrollView showsVerticalScrollIndicator testID="complete_profile_step_4">
        <View>
          <StepOfSteps step={4} totalSteps={4} />
        </View>
        <View className="px-16 py-6">
          <Text className="text-center text-h4 font-semibold leading-6 text-black-default">
            {t("form_onboarding.screen_4.title") ||
              "Select the soft skills you are already competent on"}
          </Text>
          <Text className="pt-2 text-center text-h6 font-normal leading-5 text-gray-dark">
            {t("form_onboarding.screen_4.sub_title") ||
              "Please select at least 3 different soft skills and rate it from 1 to 5."}
          </Text>
        </View>

        <View className="flex w-full pt-5 ">
          <View className="flex flex-col px-5">
            <Text className="pb-2 text-md font-semibold text-primary-default">
              {t("form_onboarding.screen_4.soft_skills") || "Soft skills"}
            </Text>
            <SoftSkillPicker
              value={value}
              setValue={setValue}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              skillValueError={skillValueError}
              numberOfSkillError={numberOfSkillError}
              selectedCompetencedSkill={selectedCompetencedSkill}
              setSelectedCompetencedSkill={setSelectedCompetencedSkill}
            />
          </View>
        </View>
        {!openDropdown && (
          <Button
            testID="complete_profile_step_4_next_button"
            title={t("button.next") || "Next"}
            containerClassName=" bg-primary-default my-5 mx-5 "
            textClassName="text-white text-md leading-6"
            onPress={() => handleSubmitForm()}
          />
        )}
      </ScrollView> */}
    </TouchableWithoutFeedback>
  );
};

export default CompleteProfileStep4;
