import React, { FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import { IHardSkillProps } from '../../../../types/user';

import Warning from '../../../../component/asset/warning.svg';
import TextInput from '../../../../component/common/Inputs/TextInput';
import AddSkillModal from '../../../../component/modal/AddSkill';

import PencilEditSvg from '../../../../component/asset/pencil-edit.svg';
import Button from '../../../../component/common/Buttons/Button';

interface IEditPersonalProfileScreenProps {
  navigation: any;
}

interface IHardSkillSectionProps {
  setOpenModal: () => void;
}

const ButtonContent: IHardSkillProps[] = [
  {
    id: '14',
    skill: '💻 Development',
  },
  {
    id: '34',
    skill: '🌍 Foreign languages',
  },
  {
    id: '124',
    skill: '✏️Design',
  },
  {
    id: '14',
    skill: '📷 Photography',
  },
  {
    id: '234',
    skill: '📱 Productivity',
  },
];

const HardSkillSection: FC<IHardSkillSectionProps> = ({ setOpenModal }) => {
  const handleOpenEditHardSkillModal = () => {
    setOpenModal();
  };
  return (
    <View className="flex flex-col items-start justify-start pt-10">
      <View className="flex flex-row items-center">
        <Text className="text-primary-dark pr-2 text-base font-semibold">
          Hard skills
        </Text>
        <View className="w-6">
          <Button
            Icon={<PencilEditSvg />}
            onPress={handleOpenEditHardSkillModal}
          />
        </View>
      </View>
      <View className="h-full w-full flex-col justify-between ">
        <View className="w-full flex-row flex-wrap justify-start">
          {ButtonContent.map((content) => {
            return (
              <Button
                key={content.id}
                textClassName="line-[30px] text-center text-lg text-gray-dark font-medium"
                containerClassName="border-gray-light ml-1 border-[1px] mx-2 my-1.5 h-[48px] flex-none px-2"
                title={content?.skill}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

const EditPersonalProfileScreen = () => {
  const [userAddSkill, setUserAddSkill] = useState<IHardSkillProps[]>([]);
  const [isShowAddSkillModal, setIsShowAddSkillModal] =
    useState<boolean>(false);
  const [arraySkills, setArraySkills] = useState<IHardSkillProps[]>([]);

  const { t } = useTranslation();
  const [requestError, setRequestError] = useState<string | null>(null);

  useEffect(() => {
    setArraySkills(ButtonContent);
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      surname: '',
      birth: '',
      occupation: '',
      bio: '',
      hardSkill: '',
    },
  });
  return (
    <SafeAreaView className="bg-white">
      <View className="relative flex h-full flex-col rounded-t-xl bg-white px-4">
        <AddSkillModal
          setUserAddSkill={setUserAddSkill}
          isVisible={isShowAddSkillModal}
          onClose={() => setIsShowAddSkillModal(false)}
        />
        <View className="h-10">
          {requestError && (
            <View className="flex flex-row pt-2">
              <Text className="pl-1 text-sm font-normal text-red-500">
                {requestError}
              </Text>
            </View>
          )}
        </View>
        <ScrollView className="w-full">
          <View className="pt-3">
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="flex flex-col">
                  <TextInput
                    label="First Name"
                    placeholder={'Enter your first name'}
                    placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  {errors.name && (
                    <View className="flex flex-row pt-2">
                      <Warning />
                      <Text className="pl-1 text-sm font-normal text-red-500">
                        {errors.name.message}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            />
          </View>

          <View className="pt-3">
            <Controller
              control={control}
              name="surname"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="flex flex-col">
                  <TextInput
                    label="Last Name"
                    placeholder={'Enter your first name'}
                    placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  {errors.name && (
                    <View className="flex flex-row pt-2">
                      <Warning />
                      <Text className="pl-1 text-sm font-normal text-red-500">
                        {errors.name.message}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            />
          </View>

          <View className="pt-3">
            <Controller
              control={control}
              name="bio"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="flex h-32 flex-col">
                  <TextInput
                    label="Biography"
                    placeholder={'Your biography'}
                    placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    multiline={true}
                    numberOfLines={4}
                    className="h-32"
                  />
                </View>
              )}
            />
          </View>

          <HardSkillSection setOpenModal={() => setIsShowAddSkillModal(true)} />
        </ScrollView>

        <View className="absolute bottom-0 left-4 w-full">
          <Button
            title="Update"
            containerClassName="w-full bg-primary-default my-5"
            textClassName="text-white text-md leading-6"
            onPress={() => console.log('submit')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditPersonalProfileScreen;
