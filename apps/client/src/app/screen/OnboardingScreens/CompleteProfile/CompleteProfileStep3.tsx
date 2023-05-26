import React, { FC, useEffect, useState } from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';

import clsx from 'clsx';
import { useForm, Controller, set } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import httpInstance from '../../../utils/http';

import { useCompleteProfileStore } from '../../../store/complete-profile';

import StepOfSteps from '../../../component/common/StepofSteps';
import Button from '../../../component/common/Buttons/Button';
import { CompleteProfileScreenNavigationProp } from './CompleteProfile';
import NavButton from '../../../component/common/Buttons/NavButton';
import Header from '../../../component/common/Header';
import AddSkillModal from '../../../component/modal/AddSkill';

interface CompleteProfileStep3Props {
  navigation: CompleteProfileScreenNavigationProp;
}
interface MyObject {
  [key: string]: any;
}

const NUMBER_OF_SKILL_REQUIRED = 3;

const CompleteProfileStep3: FC<CompleteProfileStep3Props> = ({
  navigation,
}) => {
  const [fetchedHardSkills, setFetchedHardSkills] = useState<string[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await httpInstance.get('/skill/hard/list');
        setFetchedHardSkills(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSkills();
  }, []);

  const [selectedCompetencedSkill, setSelectedCompetencedSkill] = useState<
    string[]
  >([]);
  const [numberOfSkillError, setNumberOfSkillError] = useState<boolean>(false);
  const [isShowAddSkillModal, setIsShowAddSkillModal] =
    useState<boolean>(false);
  const [userAddSkill, setUserAddSkill] = useState<string[]>([]);
  const [arraySkills, setArraySkills] = useState<string[]>([]);

  const { t } = useTranslation();
  const { setSkills } = useCompleteProfileStore();

  useEffect(() => {
    const arraySkill = () => {
      const array = [];
      const ojb: MyObject = t('modal_skill.arraySkill', {
        returnObjects: true,
      });
      for (const key in ojb) {
        array.push(ojb[key]);
      }
      return array;
    };
    setArraySkills(arraySkill);
  }, []);

  useEffect(() => {
    if (userAddSkill.length > 0) {
      setArraySkills((prev) => [...prev, ...userAddSkill]);
      setUserAddSkill([]);
    }
  }, [userAddSkill]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<{
    firstName: string;
    lastName: string;
    birthday: Date;
    occupation: string;
  }>({
    defaultValues: {
      firstName: '',
      lastName: '',
      birthday: new Date(),
      occupation: '',
    },
  });

  const handleSubmitForm = (data: any) => {
    // TODO: Handle validate form with yup and remove required in form
    console.log(data);
  };

  const addCompetenceSkill = (skill: string) => {
    if (!selectedCompetencedSkill.includes(skill)) {
      setSelectedCompetencedSkill((prev) => [...prev, skill]);
    } else {
      setSelectedCompetencedSkill((prev) =>
        prev.filter((item) => item !== skill)
      );
    }
  };

  const checkNumberOfSkills = () => {
    if (selectedCompetencedSkill.length < NUMBER_OF_SKILL_REQUIRED) {
      setNumberOfSkillError(true);
      return false;
    }
    setNumberOfSkillError(false);
    setSkills(selectedCompetencedSkill);
    return selectedCompetencedSkill.length >= NUMBER_OF_SKILL_REQUIRED;
  };

  useEffect(() => {
    if (selectedCompetencedSkill.length >= NUMBER_OF_SKILL_REQUIRED) {
      setNumberOfSkillError(false);
      return;
    }
  }, [selectedCompetencedSkill]);

  return (
    <View className="flex h-full w-full flex-col items-center justify-start">
      <AddSkillModal
        setUserAddSkill={setUserAddSkill}
        isVisible={isShowAddSkillModal}
        onClose={() => setIsShowAddSkillModal(false)}
      />
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
        <StepOfSteps step={3} totalSteps={4} />
      </View>
      <View className="flex w-[282px] flex-col items-center justify-center py-6 ">
        <Text className="text-black-default text-h4 text-center font-semibold leading-6">
          How do you define yourself as competent?
        </Text>
        <Text className="text-gray-dark pt-2 text-center text-lg font-normal leading-5">
          Choose at least 3 and up to a maximum of 10 hard skills to better tell
          the community about yourself
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator style={{ marginVertical: 40 }}>
        <View className="h-full w-full flex-col justify-between">
          <View className="align-center w-full flex-row flex-wrap justify-center">
            {arraySkills.map((item, index) => (
              <Button
                key={index}
                title={item}
                onPress={() => addCompetenceSkill(item)}
                textClassName="line-[30px] text-center text-lg text-gray-dark font-medium"
                containerClassName={clsx(
                  'border-gray-light ml-1 border-[1px] mx-2 my-1.5 h-[48px] flex-none px-2',
                  {
                    'bg-primary-10': selectedCompetencedSkill.includes(item),
                    'border-primary-default':
                      selectedCompetencedSkill.includes(item),
                  }
                )}
              />
            ))}
          </View>
          <Button
            containerClassName="flex-none px-1"
            textClassName="line-[30px] text-center text-md font-medium text-primary-default"
            title={t('modal_skill.manually')}
            onPress={() => setIsShowAddSkillModal(true)}
          />
          {numberOfSkillError && (
            <Text className="pt-3 text-center text-sm font-normal leading-5 text-red-500">
              Please select at least 3 skills
            </Text>
          )}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 h-16 w-full bg-white px-4">
        <View className="h-12">
          <Button
            title="Next"
            containerClassName="bg-primary-default flex-1"
            textClassName="text-white"
            onPress={() =>
              checkNumberOfSkills() &&
              navigation.navigate('CompleteProfileStep4Screen')
            }
          />
        </View>
      </View>
    </View>
  );
};

export default CompleteProfileStep3;