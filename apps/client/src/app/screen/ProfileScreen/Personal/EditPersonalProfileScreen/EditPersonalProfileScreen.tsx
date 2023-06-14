import React, { FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { IHardSkillProps } from '../../../../types/user';

import Warning from '../../../../component/asset/warning.svg';
import TextInput from '../../../../component/common/Inputs/TextInput';
import AddSkillModal from '../../../../component/modal/AddSkill';

import PencilEditSvg from '../../../../component/asset/pencil-edit.svg';
import Button from '../../../../component/common/Buttons/Button';
import CalendarIcon from './asset/calendar-icon.svg';
import dayjs from '../../../../utils/date.util';
import SelectPicker from '../../../../component/common/Pickers/SelectPicker';
import { MOCK_OCCUPATION_SELECT } from '../../../../mock-data/occupation';
import { yupResolver } from '@hookform/resolvers/yup';
import { EditProfileValidators } from '../../../../Validators/EditProfile.validate';
import { useUserProfileStore } from '../../../../store/user-data';
import { useCompleteProfileStore } from '../../../../store/complete-user-profile';
import { useGetUserData } from 'apps/client/src/app/hooks/useGetUser';
import AddHardSkills from 'apps/client/src/app/component/modal/AddHardSkills/AddHardSkills';
interface IEditPersonalProfileScreenProps {
  navigation: any;
}

interface IHardSkillSectionProps {
  setOpenModal: () => void;
  hardSkill: IHardSkillProps[];
}

const HardSkillSection: FC<IHardSkillSectionProps> = ({
  setOpenModal,
  hardSkill,
}) => {
  const handleOpenEditHardSkillModal = () => {
    setOpenModal();
  };
  return (
    <View className="flex flex-col items-start justify-start ">
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
      <View className=" flex-col justify-between ">
        <View className="w-full flex-row flex-wrap justify-start">
          {hardSkill &&
            hardSkill.map((content, index) => {
              return (
                <Button
                  containerClassName="border-gray-light ml-1 border-[1px] mx-2 my-1.5  h-[48px] flex-none px-5"
                  textClassName="line-[30px] text-center text-md font-medium"
                  key={index}
                  title={content?.skill?.skill as string}
                />
              );
            })}
        </View>
      </View>
    </View>
  );
};

const EditPersonalProfileScreen = () => {
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [showOccupationPicker, setShowOccupationPicker] = useState(false);
  const [selectedOccupationIndex, setSelectedOccupationIndex] = useState<
    number | undefined
  >();
  const [userAddSkill, setUserAddSkill] = useState<IHardSkillProps[]>([]);
  const [isShowAddSkillModal, setIsShowAddSkillModal] =
    useState<boolean>(false);

  const { t } = useTranslation();
  const [requestError, setRequestError] = useState<string | null>(null);

  const { getUserProfile, setUserProfile } = useUserProfileStore();
  const userProfile = getUserProfile();
  useGetUserData();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<{
    name: string;
    surname: string;
    birth: string;
    occupation: string;
    bio: string;
    hardSkill: IHardSkillProps[];
  }>({
    defaultValues: {
      name: userProfile?.name || '',
      surname: userProfile?.surname || '',
      birth: (userProfile?.birth as string) || undefined,
      occupation: '',
      bio: userProfile?.bio || '',
      hardSkill: userProfile?.hardSkill || [],
    },
    resolver: yupResolver(EditProfileValidators()),
  });

  const handleOccupationPicked = (index: number) => {
    if (index >= 0) {
      setSelectedOccupationIndex(index);
      setValue('occupation', MOCK_OCCUPATION_SELECT[index].label);
    }
    setShowOccupationPicker(false);
  };
  const onSubmit = (data: any) => {
    console.log(data);
  };
  return (
    <SafeAreaView className="h-full bg-white">
      <View className="  h-full rounded-t-xl bg-white ">
        <AddHardSkills
          setUserAddSkill={setUserAddSkill}
          isVisible={isShowAddSkillModal}
          onClose={() => setIsShowAddSkillModal(false)}
        />
        <View className="mt-8 px-4">
          {requestError && (
            <View className="mb-2 flex flex-row">
              <Text className="pl-1 text-sm font-normal text-red-500">
                {requestError}
              </Text>
            </View>
          )}
        </View>
        {userProfile && (
          <ScrollView className=" h-full w-full px-4 ">
            <View>
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
                    {errors.surname && (
                      <View className="flex flex-row pt-2">
                        <Warning />
                        <Text className="pl-1 text-sm font-normal text-red-500">
                          {errors.surname.message}
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
                name="birth"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="flex flex-col">
                    <TextInput
                      label="Birthday"
                      placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                      rightIcon={
                        <TouchableOpacity
                          onPress={() => setShowDateTimePicker(true)}
                        >
                          <CalendarIcon />
                        </TouchableOpacity>
                      }
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value && dayjs(value).format('DD/MM/YYYY')}
                      // textAlignVertical="top"
                      editable={false}
                      onPress={() => setShowDateTimePicker(true)}
                      className="text-black-default"
                    />
                    {errors.birth && (
                      <View className="flex flex-row pt-2">
                        <Warning />
                        <Text className="pl-1 text-sm font-normal text-red-500">
                          {errors.birth.message}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              />
            </View>
            <View className="pt-3">
              <Controller
                name="occupation"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="flex flex-col">
                    <TextInput
                      label="Occupation"
                      placeholder={'Enter your occupation'}
                      placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      onPress={() => setShowOccupationPicker(true)}
                      value={value}
                    />
                    {errors.occupation && (
                      <View className="flex flex-row pt-2">
                        <Warning />
                        <Text className="pl-1 text-sm font-normal text-red-500">
                          {errors.occupation.message}
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
                  <View className="flex flex-col">
                    <TextInput
                      label="Biography"
                      placeholder={'Your biography'}
                      placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      multiline={true}
                      numberOfLines={4}
                      // className="h-32"
                    />
                  </View>
                )}
              />
            </View>

            <HardSkillSection
              setOpenModal={() => setIsShowAddSkillModal(true)}
              hardSkill={userProfile?.hardSkill || []}
            />

            <Button
              title="Update"
              containerClassName=" bg-primary-default my-10"
              textClassName="text-white text-md leading-6"
              onPress={handleSubmit(onSubmit)}
            />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default EditPersonalProfileScreen;
