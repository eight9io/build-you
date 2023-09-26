import Checkbox from "expo-checkbox";
import React, { FC, useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import OutsidePressHandler from "react-native-outside-press";

import { useTranslation } from "react-i18next";
import clsx from "clsx";

import WarningSvg from "../../component/asset/warning.svg";
import httpInstance from "../../utils/http";

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
  id: string;
  testID?: string;
}

interface ISoftSkillPickerProps {
  openDropdown: boolean;
  setOpenDropdown: any;
  value: string[];
  setValue: any;
  numberOfSkillError?: boolean;
  selectedCompetencedSkill: IFormValueInput[];
  setSelectedCompetencedSkill: any;
  dropDrownDirection?: "TOP" | "BOTTOM";
}

const MIN_SOFT_SKILLS = 3;

const convertFetchedSoftSkillToSkillProps = (
  fetchedSoftSkills: IFetchedSkill[]
): IFormValueInput[] => {
  return fetchedSoftSkills.map((item, index) => ({
    label: item?.skill,
    id: item?.id,
    testID: `soft_skill_dropdown_picker_item_${index}`,
  }));
};

const SoftSkillPicker: FC<ISoftSkillPickerProps> = ({
  openDropdown,
  setOpenDropdown,
  value,
  setValue,
  numberOfSkillError,
  selectedCompetencedSkill,
  setSelectedCompetencedSkill,
  dropDrownDirection = "BOTTOM",
}) => {
  const { t } = useTranslation();
  const [fetchedSoftSkills, setFetchedSoftSkills] = useState<IFormValueInput[]>(
    []
  );

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await httpInstance.get("/skill/soft/list");
        setFetchedSoftSkills(
          convertFetchedSoftSkillToSkillProps(response.data)
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchSkills();
  }, []);

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
    <OutsidePressHandler
      onOutsidePress={() => {
        setOpenDropdown(false);
      }}
    >
      <View>
        <DropDownPicker
          value={value}
          itemKey="label"
          open={openDropdown}
          setValue={setValue}
          items={fetchedSoftSkills}
          setOpen={setOpenDropdown}
          setItems={setFetchedSoftSkills}
          testID="soft_skill_dropdown_picker"
          dropDownDirection={dropDrownDirection}
          listMode="SCROLLVIEW"
          placeholder={
            selectedCompetencedSkill.length == 0
              ? t("form_onboarding.screen_4.select_soft_skill") ||
                "Select a soft skill"
              : `${selectedCompetencedSkill.length}/${fetchedSoftSkills.length}`
          }
          style={{
            backgroundColor: "#fafafa",
            borderColor: "#e2e8f0",
            borderWidth: 1,
            borderRadius: 8,
            zIndex: 10,
          }}
          containerStyle={{
            width: "100%",
            backgroundColor: "#fafafa",
            zIndex: 10,
          }}
          dropDownContainerStyle={{
            backgroundColor: "#fafafa",
            borderColor: "#e2e8f0",
            borderWidth: 1,
            borderRadius: 8,
            overflow: "scroll",
            zIndex: 10,
          }}
          theme="LIGHT"
          multiple={true}
          mode="SIMPLE"
          badgeDotColors={["#e76f51"]}
          renderListItem={({ item, isSelected }) => {
            const isSkillAlreadySelected = selectedCompetencedSkill.find(
              (selected) => selected.label === item.label
            );
            const randomIndex = Math.random().toString().replace(".", "");
            return (
              <TouchableOpacity
                onPress={() => addCompetencedSkill(item as IFormValueInput)}
                key={randomIndex}
                testID={item.testID}
              >
                <View
                  className={clsx(
                    "flex-row items-center justify-start px-4 py-3",
                    {
                      "bg-gray-light": isSelected,
                    }
                  )}
                >
                  <Checkbox
                    value={!!isSkillAlreadySelected}
                    onValueChange={() =>
                      addCompetencedSkill(item as IFormValueInput)
                    }
                    color={isSelected ? "#4630EB" : undefined}
                  />
                  <Text
                    key={item.label}
                    className="pl-3 text-h6 font-medium leading-6 text-black-default"
                  >
                    {item.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
        <View>
          {numberOfSkillError && (
            <View className="flex flex-row items-center justify-start pt-2">
              <WarningSvg />
              <Text
                className="pl-1 text-sm font-normal leading-5 text-red-500"
                testID="complete_profile_step_4_error"
              >
                {t("form_onboarding.screen_4.error") ||
                  `Please select at least ${MIN_SOFT_SKILLS}  soft skills.`}
              </Text>
            </View>
          )}
        </View>
      </View>
    </OutsidePressHandler>
  );
};

export default SoftSkillPicker;
