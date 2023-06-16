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

import { IHardSkill, IHardSkillProps } from '../../../../types/user';

import Warning from '../../../../component/asset/warning.svg';
import TextInput from '../../../../component/common/Inputs/TextInput';

import PencilEditSvg from '../../../../component/asset/pencil-edit.svg';
import Button from '../../../../component/common/Buttons/Button';
import CalendarIcon from './asset/calendar-icon.svg';
import dayjs from '../../../../utils/date.util';
import SelectPicker from '../../../../component/common/Pickers/SelectPicker';
import { MOCK_OCCUPATION_SELECT } from '../../../../mock-data/occupation';
import { yupResolver } from '@hookform/resolvers/yup';
import { EditProfileValidators } from '../../../../Validators/EditProfile.validate';
import { useUserProfileStore } from '../../../../store/user-data';
import { useGetUserData } from 'apps/client/src/app/hooks/useGetUser';
import AddHardSkills from 'apps/client/src/app/component/modal/AddHardSkills/AddHardSkills';
import { useAuthStore } from 'apps/client/src/app/store/auth-store';
import DateTimePicker2 from 'apps/client/src/app/component/common/BottomSheet/DateTimePicker2.tsx/DateTimePicker2';
interface IEditPersonalProfileScreenProps {
  navigation: any;
}

interface IHardSkillSectionProps {
  setOpenModal: () => void;
  hardSkill: IHardSkill[];
  setArrayMyHardSkills: (value: IHardSkill[]) => void;
}

const HardSkillSection: FC<IHardSkillSectionProps> = ({
  setOpenModal,
  hardSkill,
  setArrayMyHardSkills,
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
                  title={content?.skill as string}
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
  const [isShowAddHardSkillModal, setIsShowAddHardSkillModal] =
    useState<boolean>(false);

  const { t } = useTranslation();

  const { getUserProfile, setUserProfile } = useUserProfileStore();
  const userData = getUserProfile();

  useGetUserData();
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<{
    name: string;
    surname: string;
    birth: Date | undefined | string;
    occupation: string;
    bio: string;
    hardSkill: IHardSkillProps[];
  }>({
    defaultValues: {
      name: userData?.name || '',
      surname: userData?.surname || '',
      birth: userData?.birth || undefined,
      occupation: userData?.occupation?.name || 'Developer',
      bio: userData?.bio || '',
      hardSkill: userData?.hardSkill || [],
    },
    resolver: yupResolver(EditProfileValidators()),
  });
  const occupation = getValues('occupation');
  const birth = getValues('birth');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const handleDatePicked = (date?: Date) => {
    if (date) {
      setValue('birth', date);
      setSelectedDate(date);
    }
    setShowDateTimePicker(false);
  };

  const handleOccupationPicked = (index: number) => {
    if (index >= 0) {
      setSelectedOccupationIndex(index);
      setValue('occupation', MOCK_OCCUPATION_SELECT[index].label);
    }
    setShowOccupationPicker(false);
  };
  const [arrayMyHardSkills, setArrayMyHardSkills] = useState<IHardSkill[]>([]);
  useEffect(() => {
    if (userData?.hardSkill) {
      const hardSkill = userData?.hardSkill.map((item) => {
        return {
          skill: item.skill.skill,
          id: item.skill.id,
        };
      });
      setArrayMyHardSkills(hardSkill);
    }
  }, [userData?.hardSkill]);

  const onSubmit = (data: any) => {
    const hardSkill = arrayMyHardSkills.map((item) => {
      return {
        skill: {
          skill: item.skill,
          id: item.id,
        },
      };
    });
    console.log(
      '🚀 ~ file: EditPersonalProfileScreen.tsx:159 ~ hardSkill ~ hardSkill:',
      hardSkill
    );
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <View className="  h-full rounded-t-xl bg-white ">
        <AddHardSkills
          setIsShowAddHardSkillModal={setIsShowAddHardSkillModal}
          isVisible={isShowAddHardSkillModal}
          onClose={() => setIsShowAddHardSkillModal(false)}
          setArrayMyHardSkills={setArrayMyHardSkills}
          arrayMyHardSkills={arrayMyHardSkills}
        />
        <DateTimePicker2
          shouldMinus16Years
          selectedDate={selectedDate}
          setSelectedDate={handleDatePicked}
          setShowDateTimePicker={setShowDateTimePicker}
          showDateTimePicker={showDateTimePicker}
          maximumDate={dayjs().subtract(16, 'years').startOf('day').toDate()}
          minimumDate={dayjs().subtract(100, 'years').startOf('day').toDate()}
        />

        <SelectPicker
          show={showOccupationPicker}
          data={MOCK_OCCUPATION_SELECT}
          selectedIndex={selectedOccupationIndex}
          onSelect={handleOccupationPicked}
          onCancel={() => {
            setShowOccupationPicker(false);
          }}
        />

        {userData && (
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
                      placeholder={'Enter your birth day'}
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
                    {errors.birth && !birth && (
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
                    {errors.occupation && !occupation && (
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
              setOpenModal={() => setIsShowAddHardSkillModal(true)}
              hardSkill={arrayMyHardSkills || []}
              setArrayMyHardSkills={setArrayMyHardSkills}
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
