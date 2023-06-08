import React, { FC, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useCompleteProfileStore } from '../../../store/complete-user-profile';
import { OnboardingScreen1Validators } from '../../../Validators/Onboarding.validate';

import dayjs from '../../../utils/date.util';

import StepOfSteps from '../../../component/common/StepofSteps';
import SignupAvatar from '../../../component/common/Avatar/SignupAvatar';
import TextInput from '../../../component/common/Inputs/TextInput';

import CalendarIcon from './asset/calendar-icon.svg';
import SelectPicker from '../../../component/common/Pickers/SelectPicker';
import { MOCK_OCCUPATION_SELECT } from '../../../mock-data/occupation';
import Button from '../../../component/common/Buttons/Button';

import { CompleteProfileScreenNavigationProp } from './CompleteProfile';

import Warning from '../../../component/asset/warning.svg';

import DateTimePicker2 from '../../../component/common/BottomSheet/DateTimePicker2.tsx/DateTimePicker2';
import { useTranslation } from 'react-i18next';

interface CompleteProfileStep1Props {
  navigation: CompleteProfileScreenNavigationProp;
}

const CompleteProfileStep1: FC<CompleteProfileStep1Props> = ({
  navigation,
}) => {
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [showOccupationPicker, setShowOccupationPicker] = useState(false);
  const [selectedOccupationIndex, setSelectedOccupationIndex] = useState<
    number | undefined
  >();

  const { setProfile } = useCompleteProfileStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<{
    name: string;
    surname: string;
    birth: Date | undefined;
    occupation: string;
  }>({
    defaultValues: {
      name: '',
      surname: '',
      birth: undefined,
      occupation: '',
    },
    resolver: yupResolver(OnboardingScreen1Validators()),
    reValidateMode: 'onChange',
  });

  const { t } = useTranslation();

  const occupation = getValues('occupation');
  const birth = getValues('birth');
  const handleDatePicked = (date?: Date) => {
    if (date) {
      setValue('birth', date);
      setSelectedDate(date);
    }
    setShowDateTimePicker(false);
  };

  const handleOccupationPicked = (index: number) => {
    if ( index >= 0) {
      setSelectedOccupationIndex(index);
      setValue('occupation', MOCK_OCCUPATION_SELECT[index].label);
    }
    setShowOccupationPicker(false);
  };

  const handleSubmitForm = (data: any) => {
    // TODO: Handle validate form with yup and remove required in form
    setProfile(data);
    navigation.navigate('CompleteProfileStep2Screen');
  };

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  return (
    <View className="">
      <DateTimePicker2
        shouldMinus16Years
        selectedDate={selectedDate}
        setSelectedDate={handleDatePicked}
        setShowDateTimePicker={setShowDateTimePicker}
        showDateTimePicker={showDateTimePicker}
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
      <ScrollView className="h-full w-full">
        <View className=" flex w-full flex-col items-center justify-start">
          <View className="pt-2">
            <StepOfSteps step={1} totalSteps={4} />
          </View>
          <View className="flex flex-col items-center justify-center py-6">
            <Text className="text-black-default text-h4 font-medium leading-6">
              {t('form_onboarding.screen_1.title')}
            </Text>
          </View>

          <View className="h-28">
            <SignupAvatar />
          </View>

          {/* Form */}
          <View className=" flex w-full">
            <View className="mt-4 flex flex-col px-5 ">
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
                        placeholder={'Enter your last name'}
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
              {/* TODO: Implement a slide modal picker */}
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
              <Button
                title="Next"
                containerClassName="h-12 w-full bg-primary-default my-5 "
                textClassName="text-white text-md leading-6"
                onPress={handleSubmit(handleSubmitForm)}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CompleteProfileStep1;
