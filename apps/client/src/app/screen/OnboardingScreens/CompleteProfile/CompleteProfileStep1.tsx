import React, { FC, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useCompleteProfileStore } from '../../../store/complete-profile';
import { OnboardingScreen1Validators } from '../../../Validators/Onboarding.validate';

import dayjs from '../../../utils/date.util';

import StepOfSteps from '../../../component/common/StepofSteps';
import SignupAvatar from '../../../component/common/Avatar/SignupAvatar';
import TextInput from '../../../component/common/Inputs/TextInput';

import CalendarIcon from './asset/calendar-icon.svg';
import DateTimePicker from '../../../component/common/Pickers/DateTimePicker';
import SelectPicker from '../../../component/common/Pickers/SelectPicker';
import { MOCK_OCCUPATION_SELECT } from '../../../mock-data/occupation';
import Button from '../../../component/common/Buttons/Button';

import { CompleteProfileScreenNavigationProp } from './CompleteProfile';
import Header from '../../../component/common/Header';

import Warning from './asset/warning.svg';

import DateTimePicker2 from '../../../component/common/BottomSheet/DateTimePicker2.tsx/DateTimePicker2';

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
    resolver: yupResolver(OnboardingScreen1Validators()),
    reValidateMode: 'onChange',
  });

  const handleDatePicked = (date?: Date) => {
    if (date) {
      setValue('birthday', date);
      setSelectedDate(date);
    }

    setShowDateTimePicker(false);
  };

  const handleOccupationPicked = (index?: number) => {
    if (index) {
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

  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight = Dimensions.get('window').height;
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  return (
    <View className="">
      <DateTimePicker2
        selectedDate={selectedDate}
        setSelectedDate={handleDatePicked}
        setShowDateTimePicker={setShowDateTimePicker}
        showDateTimePicker={showDateTimePicker}
      />

      <View className="relative flex h-full w-full flex-col items-center justify-start">
        <Header title="Complete profile" />
        <View className="pt-2">
          <StepOfSteps step={1} totalSteps={4} />
        </View>
        <View className="flex flex-col items-center justify-center py-6">
          <Text className="text-black-default text-h4 font-medium leading-6">
            Tell us about yourself
          </Text>
        </View>

        <View className="">
          <SignupAvatar control={control} />
        </View>

        {/* Form */}
        <View className=" flex h-full w-full rounded-t-xl">
          <View className="mt-4 flex flex-col px-5 ">
            <View className="pt-3">
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="flex flex-col">
                    <TextInput
                      label="First Name"
                      placeholder={'Enter your first name'}
                      placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      className="border-gray-medium bg-gray-veryLight flex h-12 w-full flex-row rounded-[10px] border-[1px] px-3 pb-1 text-base font-normal"
                    />
                    {errors.firstName && (
                      <View className="flex flex-row pt-2">
                        <Warning />
                        <Text className="pl-1 text-sm font-normal text-red-500">
                          {errors.firstName.message}
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
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="flex flex-col">
                    <TextInput
                      label="Last Name"
                      placeholder={'Enter your last name'}
                      placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      className="border-gray-medium bg-gray-veryLight flex h-12 w-full flex-row rounded-[10px] border-[1px] px-3 pb-1 text-base font-normal"
                    />
                    {errors.lastName && (
                      <View className="flex flex-row pt-2">
                        <Warning />
                        <Text className="pl-1 text-sm font-normal text-red-500">
                          {errors.lastName.message}
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
                name="birthday"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="flex flex-col">
                    <TextInput
                      label="Birthday"
                      placeholder={'Enter your birthday'}
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
                      value={dayjs(value).format('DD/MM/YYYY')}
                      textAlignVertical="top"
                      editable={false}
                      onPress={() => setShowDateTimePicker(true)}
                      className="border-gray-medium bg-gray-veryLight flex h-12 w-full flex-row rounded-[10px] border-[1px] px-3 pb-2 text-base font-normal"
                    />
                    {errors.birthday && (
                      <View className="flex flex-row pt-2">
                        <Warning />
                        <Text className="pl-1 text-sm font-normal text-red-500">
                          {errors.birthday.message}
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
                // rules={{
                //   required: true,
                // }}
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
                      className="border-gray-medium bg-gray-veryLight flex h-12 w-full flex-row rounded-[10px] border-[1px] px-3 pb-2 text-base font-normal"
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
          </View>

          <SelectPicker
            show={showOccupationPicker}
            data={MOCK_OCCUPATION_SELECT}
            selectedIndex={selectedOccupationIndex}
            onSelect={handleOccupationPicked}
            onCancel={() => {
              setShowOccupationPicker(false);
            }}
          />
        </View>

        <View className="absolute bottom-0 left-0 h-16 w-full bg-white px-4">
          <View className="h-12">
            <Button
              title="Next"
              containerClassName="bg-primary-default flex-1"
              textClassName="text-white text-md leading-6"
              onPress={handleSubmit(handleSubmitForm)}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default CompleteProfileStep1;