import Checkbox from "expo-checkbox";
import React, { FC, useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import OutsidePressHandler from "react-native-outside-press";

import { useTranslation } from "react-i18next";
import clsx from "clsx";

import CheckedSvg from "../asset/checked.svg";
import UncheckedSvg from "../asset/uncheck.svg";
import WarningSvg from "../../component/asset/warning.svg";
import i18n from "../../i18n/i18n";
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
  value: number; //rating
  id: string;
  testID?: string;
}

interface IRenderSoftSkillProgress {
  item: IFormValueInput;
  changeSkillValue: any;
  skillValueError: boolean;
}

interface ISoftSkillPickerProps {
  openDropdown: boolean;
  setOpenDropdown: any;
  value: string[];
  setValue: any;
  skillValueError?: boolean;
  numberOfSkillError?: boolean;
  selectedCompetencedSkill: IFormValueInput[];
  setSelectedCompetencedSkill: any;
  shouldRenderSelectedSoftSkill?: boolean;
  dropDrownDirection?: "TOP" | "BOTTOM";
}

const MAX_PROGRESS_VALUE = 5;

const renderSoftSkillProgress: FC<IRenderSoftSkillProgress> = ({
  item,
  changeSkillValue,
  skillValueError,
}) => {
  const randomId = Math.random().toString();
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
            {i18n.t("form_onboarding.screen_4.error_rate") ||
              "Please rate from 1 to 5"}
          </Text>
        </View>
      )}
    </View>
  );
};

const renderSelectedSoftSkill = (
  selectedCompetencedSkill: IFormValueInput[],
  changeSkillValue: any,
  skillValueError: boolean
) => {
  const randomId = Math.random().toString();
  return (
    <View className="flex flex-col flex-wrap">
      {selectedCompetencedSkill.map((item, index) => (
        <View className="pb-6" key={`${randomId}${index}`}>
          {renderSoftSkillProgress({ item, changeSkillValue, skillValueError })}
        </View>
      ))}
    </View>
  );
};

const convertFetchedSoftSkillToSkillProps = (
  fetchedSoftSkills: IFetchedSkill[]
): IFormValueInput[] => {
  return fetchedSoftSkills.map((item, index) => ({
    label: item?.skill,
    value: 0,
    id: item?.id,
    testID: `soft_skill_dropdown_picker_item_${index}`,
  }));
};

const SoftSkillPicker: FC<ISoftSkillPickerProps> = ({
  openDropdown,
  setOpenDropdown,
  value,
  setValue,
  skillValueError,
  numberOfSkillError,
  selectedCompetencedSkill,
  setSelectedCompetencedSkill,
  shouldRenderSelectedSoftSkill = true,
  dropDrownDirection = "BOTTOM",
}) => {
  const { t } = useTranslation();
  const [fetchedSoftSkills, setFetchedSoftSkills] = useState<IFormValueInput[]>(
    []
  );

  const dropDownRef = React.useRef(null);

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

  const closeDropdown = () => {
    if (openDropdown) {
      setOpenDropdown(false);
    }
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
            height: 48,
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
            maxHeight: 300,
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
          <View>
            {numberOfSkillError && (
              <View className="flex flex-row items-center justify-start pt-2">
                <WarningSvg />
                <Text
                  className="pl-1 text-sm font-normal leading-5 text-red-500"
                  testID="complete_profile_step_4_error"
                >
                  {t("form_onboarding.screen_4.error") ||
                    "Please select at least 3 soft skills."}
                </Text>
              </View>
            )}
          </View>
          {shouldRenderSelectedSoftSkill && (
            <View className="w-full flex-col justify-between pt-5">
              {renderSelectedSoftSkill(
                selectedCompetencedSkill,
                changeSkillValue,
                skillValueError
              )}
            </View>
          )}
        </View>
      </View>
    </OutsidePressHandler>
  );
};

export default SoftSkillPicker;
