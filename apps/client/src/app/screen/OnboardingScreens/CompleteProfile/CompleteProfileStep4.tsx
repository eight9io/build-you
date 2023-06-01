import React, { FC, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import clsx from 'clsx';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DropDownPicker from 'react-native-dropdown-picker';
import Checkbox from 'expo-checkbox';

import { useCompleteProfileStore } from '../../../store/complete-user-profile';
import { useUserProfileStore } from '../../../store/user-data';

import { useGetUserData } from '../../../hooks/useGetUser';

import StepOfSteps from '../../../component/common/StepofSteps';
import { CompleteProfileScreenNavigationProp } from './CompleteProfile';
import Button from '../../../component/common/Buttons/Button';
import NavButton from '../../../component/common/Buttons/NavButton';
import Header from '../../../component/common/Header';

import CheckedSvg from './asset/checked.svg';
import UncheckedSvg from './asset/uncheck.svg';
import WarningSvg from './asset/warning.svg';

import httpInstance, { setAuthTokenToHttpHeader } from '../../../utils/http';

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
  return (
    <View className="flex w-full flex-col">
      <View className="flex w-full flex-row items-center justify-between">
        <View>
          <Text className="text-black-default text-h6 w-44 font-medium leading-6">
            {item.label}
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
      {skillValueError && item?.value === 0 && (
        <View className="flex flex-row items-center">
          <WarningSvg />
          <Text className="pl-1 text-sm text-red-500">
            Please rate from 1 to 5.
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
  return fetchedSoftSkills.map((item) => ({
    label: item?.skill,
    value: 0,
    id: item?.id,
  }));
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

  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [value, setValue] = useState<string[]>([]);

  const [fetchedSoftSkills, setFetchedSoftSkills] = useState<IFormValueInput[]>(
    []
  );

  const { getUserProfile } = useUserProfileStore();
  const { setIsCompleteProfile } = useGetUserData();

  const userData = getUserProfile();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await httpInstance.get('/skill/soft/list');
        setFetchedSoftSkills(
          convertFetchedSoftSkillToSkillProps(response.data)
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchSkills();
  }, []);

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

  const handleSubmitForm = () => {
    setOpenDropdown(false);
    setSoftSkills(selectedCompetencedSkill);
    const profile = getProfile();
    if (!checkSoftSkillRequired() || !checkAllSkillValueGreaterThanZero())
      return;
    const softSkills = convertSelectedToSoftSkillProps(
      selectedCompetencedSkill
    );
    httpInstance
      .put(`/user/update/${userData.id}`, {
        ...profile,
        softSkills: softSkills,
      })
      .then((res) => {
        if (res.status === 200) {
          setIsCompleteProfile(true);
          navigation.navigate('CompleteProfileFinishScreen');
        }
      })
      .catch((err) => {
        console.error('upload err', err);
        navigation.navigate('LoginScreen');
      });
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
      <View className="relative flex h-full w-full flex-col items-center justify-start">
        <Header
          title="Complete profile"
          leftBtn={
            <NavButton
              text="Back"
              withBackIcon={true}
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
              open={openDropdown}
              value={value}
              items={fetchedSoftSkills}
              setOpen={setOpenDropdown}
              setValue={setValue}
              setItems={setFetchedSoftSkills}
              placeholder={
                selectedCompetencedSkill.length == 0
                  ? 'Select a soft skill'
                  : `${selectedCompetencedSkill.length}/${fetchedSoftSkills.length}`
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
              badgeDotColors={['#e76f51']}
              renderListItem={({ item, isSelected, onPress }) => {
                const isSkillAlreadySelected = selectedCompetencedSkill.find(
                  (selected) => selected.label === item.label
                );
                return (
                  <TouchableOpacity
                    onPress={() => addCompetencedSkill(item as IFormValueInput)}
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
                      <Text
                        key={item.label}
                        className="text-black-default text-h6 pl-3 font-medium leading-6"
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
                  <Text className="pl-1 text-sm font-normal leading-5 text-red-500">
                    Please select at least 3 different soft skills
                  </Text>
                </View>
              )}
            </View>
            <View className="w-full flex-col justify-between pt-5">
              {renderSelectedSoftSkill(
                selectedCompetencedSkill,
                changeSkillValue,
                skillValueError
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
    </TouchableWithoutFeedback>
  );
};

export default CompleteProfileStep4;
