import React, { FC, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import clsx from 'clsx';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DropDownPicker from 'react-native-dropdown-picker';
import Checkbox from 'expo-checkbox';

import { useCompleteProfileStore } from '../../../store/complete-profile';

import StepOfSteps from '../../../component/common/StepofSteps';
import { CompleteProfileScreenNavigationProp } from './index';
import Button from '../../../component/common/Buttons/Button';
import NavButton from '../../../component/common/Buttons/NavButton';
import Header from '../../../component/common/Header';

import CheckedSvg from './asset/checked.svg';
import UncheckedSvg from './asset/uncheck.svg';
import WarningSvg from './asset/warning.svg';

interface CompleteProfileStep4Props {
  navigation: CompleteProfileScreenNavigationProp;
}

interface ISkillProps {
  label: string;
  value: number;
  key?: number;
}

interface IRenderSoftSkillProgress {
  item: ISkillProps;
  changeSkillValue: any;
}

const NUMBER_OF_SKILL_REQUIRED = 3;
const MAX_PROGRESS_VALUE = 5;

const renderSoftSkillProgress: FC<IRenderSoftSkillProgress> = ({
  item,
  changeSkillValue,
}) => {
  const randomId = Math.random().toString();
  return (
    <View className="flex w-full flex-row items-center justify-between">
      <View>
        <Text className="text-black-default text-h6 font-medium leading-6">
          {item?.label}
        </Text>
      </View>
      <View className="flex flex-1 flex-row  justify-end">
        {Array.from(Array(MAX_PROGRESS_VALUE).keys()).map((_, index) => (
          <TouchableOpacity
            className="pr-4"
            key={`${randomId}${index}`}
            onPress={() => changeSkillValue(item?.label, index + 1)}
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
  );
};

const renderSelectedSoftSkill = (
  selectedCompetencedSkill: ISkillProps[],
  changeSkillValue: any
) => {
  const randomId = Math.random().toString();
  return (
    <View className="flex flex-col flex-wrap">
      {selectedCompetencedSkill.map((item, index) => (
        <View className="pb-6" key={`${randomId}${index}`}>
          {renderSoftSkillProgress({ item, changeSkillValue })}
        </View>
      ))}
    </View>
  );
};

const CompleteProfileStep4: FC<CompleteProfileStep4Props> = ({
  navigation,
}) => {
  const { t } = useTranslation();

  const [selectedCompetencedSkill, setSelectedCompetencedSkill] = useState<
    ISkillProps[]
  >([]);
  const [numberOfSkillError, setNumberOfSkillError] = useState<boolean>(false);

  const { setSoftSkills, getProfile } = useCompleteProfileStore();

  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string[]>([]);
  const [items, setItems] = useState<any[]>([
    { label: 'Football', name: 'football', key: 1 },
    { label: 'Baseball', name: 'baseball', key: 2 },
    { label: 'Hockey', name: 'hockey', key: 3 },
  ]);

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

  // const {
  //   control,
  //   handleSubmit,
  //   formState: { errors },
  //   getValues,
  // } = useForm<{
  //   softSkills: string[];
  // }>({
  //   defaultValues: {
  //     softSkills: [],
  //   },
  // });

  const checkSoftSkillRequired = () => {
    if (selectedCompetencedSkill.length < NUMBER_OF_SKILL_REQUIRED) {
      setNumberOfSkillError(true);
      return false;
    }
    setNumberOfSkillError(false);
    return true;
  };

  const handleSubmitForm = () => {
    setOpen(false);
    setSoftSkills(selectedCompetencedSkill);
    const profile = getProfile();
    if (!checkSoftSkillRequired()) return;
    navigation.navigate('CompleteProfileFinishScreen');
  };

  const addCompetencedSkill = (skill: string | undefined) => {
    if (!skill) return;
    const isSkillAlreadySelected = selectedCompetencedSkill.find(
      (item) => item.label === skill
    );
    if (isSkillAlreadySelected) {
      setSelectedCompetencedSkill((prev) =>
        prev.filter((item) => item.label !== skill)
      );
    } else {
      setSelectedCompetencedSkill((prev) => [
        ...prev,
        { label: skill, value: 0 },
      ]);
    }
  };

  return (
    <View className="relative flex h-full w-full flex-col items-center justify-start">
      <Header
        title="Complete profile"
        leftBtn={
          <NavButton
            text="Back"
            withIcon={true}
            onPress={() => navigation.goBack()}
          />
        }
      />
      <View className="pt-4">
        <StepOfSteps step={4} totalSteps={4} />
      </View>
      <View className="flex w-[282px] flex-col items-center justify-center py-6 ">
        <Text className="text-black-default text-h4 text-center font-semibold leading-6">
          Select the soft skills you are already competent on
        </Text>
        <Text className="text-gray-dark text-h6 pt-2 text-center font-normal leading-5">
          Please select at least 3 different soft skills and rate it from 1 to
          5.
        </Text>
      </View>

      <View className="flex h-full w-full pt-5 ">
        <View className="flex flex-col px-5">
          <Text className="text-primary-default text-md pb-2 font-semibold">
            Soft skills
          </Text>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder={
              selectedCompetencedSkill.length == 0
                ? 'Select a soft skill'
                : `${selectedCompetencedSkill.length}/${items.length}`
            }
            style={{
              backgroundColor: '#fafafa',
              borderColor: '#e2e8f0',
              borderWidth: 1,
              borderRadius: 8,
              height: 48,
            }}
            containerStyle={{
              width: '100%',
              backgroundColor: '#fafafa',
            }}
            dropDownContainerStyle={{
              backgroundColor: '#fafafa',
              borderColor: '#e2e8f0',
              borderWidth: 1,
              borderRadius: 8,
              maxHeight: 300,
              overflow: 'scroll',
            }}
            theme="LIGHT"
            multiple={true}
            mode="SIMPLE"
            badgeDotColors={[
              '#e76f51',
              '#00b4d8',
              '#e9c46a',
              '#e76f51',
              '#8ac926',
              '#00b4d8',
              '#e9c46a',
            ]}
            renderListItem={({ item, isSelected, onPress }) => {
              const isSkillAlreadySelected = selectedCompetencedSkill.find(
                (selected) => selected.label === item.label
              );
              return (
                <TouchableOpacity
                  onPress={() => addCompetencedSkill(item?.label)}
                >
                  <View
                    className={clsx(
                      'flex-row items-center justify-start px-4 py-3',
                      {
                        'bg-gray-light': isSelected,
                      }
                    )}
                  >
                    <Checkbox
                      value={!!isSkillAlreadySelected}
                      onValueChange={onPress}
                      color={isSelected ? '#4630EB' : undefined}
                    />
                    <Text className="text-black-default text-h6 pl-3 font-medium leading-6">
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
                <Text className="text-sm font-normal leading-5 text-red-500 pl-1">
                  Please select at least 3 different soft skills
                </Text>
              </View>
            )}
          </View>
          <View className="w-full flex-col justify-between pt-5">
            {renderSelectedSoftSkill(
              selectedCompetencedSkill,
              changeSkillValue
            )}
          </View>
        </View>
      </View>
      <View className="absolute bottom-6 left-0 h-12 w-full px-4">
        <Button
          title="Next"
          containerClassName="bg-primary-default flex-1"
          textClassName="text-white"
          onPress={() => handleSubmitForm()}
        />
      </View>
    </View>
  );
};

export default CompleteProfileStep4;
