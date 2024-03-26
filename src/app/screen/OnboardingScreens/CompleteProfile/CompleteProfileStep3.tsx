import { FC, useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";

import clsx from "clsx";
import { useTranslation } from "react-i18next";

import httpInstance from "../../../utils/http";

import { useCompleteProfileStore } from "../../../store/complete-user-profile";

import { IHardSkillProps } from "../../../types/user";

import StepOfSteps from "../../../component/common/StepofSteps";
import Button from "../../../component/common/Buttons/Button";
import { CompleteProfileScreenNavigationProp } from "./CompleteProfile";
import { CrashlyticService } from "../../../service/crashlytic";
import { useSkillStore } from "../../../store/skill-store";

interface CompleteProfileStep3Props {
  navigation: CompleteProfileScreenNavigationProp;
}
interface MyObject {
  [key: string]: any;
}

const NUMBER_OF_SKILL_REQUIRED = 3;
const MAX_NUMBER_OF_SKILL = 10;

const generateTestIdForSkills = (index: number) => {
  return `complete_profile_step_3_skill_${index}`;
};

const CompleteProfileStep3: FC<CompleteProfileStep3Props> = ({
  navigation,
}) => {
  const [fetchedHardSkills, setFetchedHardSkills] = useState<IHardSkillProps[]>(
    []
  );

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await httpInstance.get("/skill/hard/list");
        setFetchedHardSkills(response.data);
      } catch (error) {
        console.error(error);
        CrashlyticService({
          errorType: "Get Hard Skill Error",
          error: error,
        });
      }
    };
    fetchSkills();
  }, []);

  const [selectedCompetencedSkill, setSelectedCompetencedSkill] = useState<
    IHardSkillProps[]
  >([]);
  const [numberOfSkillError, setNumberOfSkillError] = useState<boolean>(false);
  const [isShowAddSkillModal, setIsShowAddSkillModal] =
    useState<boolean>(false);
  const { userAddedSkill, setUserAddedSkill } = useSkillStore();

  const { t } = useTranslation();
  const { setSkills } = useCompleteProfileStore();

  useEffect(() => {
    if (userAddedSkill.length > 0) {
      setFetchedHardSkills((prev) => [...prev, ...userAddedSkill]);
      setUserAddedSkill([]);
    }
  }, [userAddedSkill]);

  const addCompetenceSkill = (skill: IHardSkillProps) => {
    if (
      selectedCompetencedSkill.length >= MAX_NUMBER_OF_SKILL &&
      !selectedCompetencedSkill.find((item) => item.id === skill.id)
    ) {
      setNumberOfSkillError(true);
      return;
    }
    if (!selectedCompetencedSkill.find((item) => item.id === skill.id)) {
      setSelectedCompetencedSkill((prev) => [...prev, skill]);
    } else {
      setSelectedCompetencedSkill((prev) =>
        prev.filter((item) => item.id !== skill.id)
      );
    }
  };

  const checkNumberOfSkills = () => {
    if (
      selectedCompetencedSkill.length < NUMBER_OF_SKILL_REQUIRED ||
      selectedCompetencedSkill.length > MAX_NUMBER_OF_SKILL
    ) {
      setNumberOfSkillError(true);
      return false;
    }
    setNumberOfSkillError(false);
    setSkills(selectedCompetencedSkill);
    return (
      selectedCompetencedSkill.length >= NUMBER_OF_SKILL_REQUIRED ||
      selectedCompetencedSkill.length <= MAX_NUMBER_OF_SKILL
    );
  };

  useEffect(() => {
    if (
      selectedCompetencedSkill.length >= NUMBER_OF_SKILL_REQUIRED ||
      selectedCompetencedSkill.length <= MAX_NUMBER_OF_SKILL
    ) {
      setNumberOfSkillError(false);
      return;
    }
  }, [selectedCompetencedSkill]);

  const onAddManualSkill = () => {
    navigation.navigate("AddManualSkillScreen");
  };

  return (
    <View className="relative flex h-full w-full flex-col items-center justify-start">
      {/* <AddSkillModal
        setUserAddSkill={setUserAddSkill}
        isVisible={isShowAddSkillModal}
        onClose={() => setIsShowAddSkillModal(false)}
      /> */}
      <ScrollView
        showsVerticalScrollIndicator
        testID="complete_profile_step_3"
        className="max-w-full"
      >
        <View>
          <StepOfSteps step={3} totalSteps={4} />
        </View>
        <View className=" px-4 py-6 ">
          <Text className="text-center text-h4 font-semibold leading-6 text-black-default">
            {t("form_onboarding.screen_3.title") ||
              "How do you define yourself as competent?"}
          </Text>
          <Text className="pt-2 text-center text-lg font-normal leading-6 text-gray-dark">
            {t("form_onboarding.screen_3.sub_title") ||
              "Choose at least 3 and up to a maximum of 10 hard skills to better tell the community about yourself"}
          </Text>
        </View>

        <View className="w-full flex-col justify-between">
          <View className="flex w-full flex-row flex-wrap items-center justify-center px-2">
            {fetchedHardSkills.map((item, index) => (
              <Button
                key={index}
                testID={generateTestIdForSkills(index)}
                title={item.skill}
                onPress={() => addCompetenceSkill(item)}
                textClassName="line-[30px] text-center text-lg text-gray-dark font-medium"
                containerClassName={clsx(
                  "border-gray-light ml-1 border-[1px] mx-2 my-1.5 h-[48px] flex-none px-2 max-w-full",
                  {
                    "bg-primary-10": selectedCompetencedSkill.includes(item),
                    "border-primary-default":
                      selectedCompetencedSkill.includes(item),
                  }
                )}
                numberOfTextLines={1}
              />
            ))}
          </View>
          <Button
            containerClassName="flex-none px-1"
            textClassName="line-[30px] text-center text-md font-medium text-primary-default"
            title={t("modal_skill.manually")}
            // onPress={() => setIsShowAddSkillModal(true)}
            onPress={onAddManualSkill}
          />
          {numberOfSkillError && (
            <Text
              testID="complete_profile_step_3_error"
              className="pt-1 text-center text-sm font-normal leading-5 text-red-500"
            >
              {t("form_onboarding.screen_3.error") ||
                "Please select at least 3 hard skills and maximum of 10 skills"}
            </Text>
          )}
        </View>
        <Button
          testID="complete_profile_step_3_next_button"
          title={t("button.next") || "Next"}
          containerClassName="bg-primary-default my-5 mx-5 flex-none"
          textClassName="text-white text-md leading-6"
          onPress={() =>
            checkNumberOfSkills() &&
            navigation.navigate("CompleteProfileStep4Screen")
          }
        />
      </ScrollView>
    </View>
  );
};

export default CompleteProfileStep3;
