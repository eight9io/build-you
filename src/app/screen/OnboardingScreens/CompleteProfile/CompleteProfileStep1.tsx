import React, { FC, useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useCompleteProfileStore } from "../../../store/complete-user-profile";
import {
  OnboardingScreen1Validators,
  OnboardingScreen1ValidatorsWithAppleLogin,
} from "../../../Validators/Onboarding.validate";

import dayjs from "../../../utils/date.util";

import StepOfSteps from "../../../component/common/StepofSteps";
import SignupAvatar from "../../../component/common/Avatar/SignupAvatar";
import TextInput from "../../../component/common/Inputs/TextInput";

import CalendarIcon from "./asset/calendar-icon.svg";
import Button from "../../../component/common/Buttons/Button";
import SelectPickerOccupation from "../../../component/common/Pickers/SelectPicker/SelectPickerOccupation";

import { CompleteProfileScreenNavigationProp } from "./CompleteProfile";

import Warning from "../../../component/asset/warning.svg";

import DateTimePicker2 from "../../../component/common/BottomSheet/DateTimePicker2/DateTimePicker2";
import { useTranslation } from "react-i18next";
import { serviceGetListOccupation } from "../../../service/profile";
import { IOccupation } from "../../../types/user";
import { useUserProfileStore } from "../../../store/user-store";
import { useAppleLoginInfoStore } from "../../../store/apple-login-store";

interface CompleteProfileStep1Props {
  navigation: CompleteProfileScreenNavigationProp;
}

const CompleteProfileStep1: FC<CompleteProfileStep1Props> = ({
  navigation,
}) => {
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [showOccupationPicker, setShowOccupationPicker] = useState(false);
  const [otherOccupation, setOtherOccupation] = useState<string | null>(null);

  const [selectedOccupationIndex, setSelectedOccupationIndex] = useState<
    number | undefined
  >();

  const { setProfile } = useCompleteProfileStore();
  const { userProfile } = useUserProfileStore();
  const [occupationList, setOccupationList] = useState<IOccupation[]>([]);

  const { getUserAppleInfo } = useAppleLoginInfoStore();
  const userAppleInfo = getUserAppleInfo();
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<{
    name: string;
    surname: string;
    birth: any;
    occupation: string;
  }>({
    defaultValues: {
      name: "",
      surname: "",
      birth: undefined,
      occupation: "",
    },
    resolver: yupResolver(
      userProfile.loginType !== "apple"
        ? OnboardingScreen1Validators()
        : OnboardingScreen1ValidatorsWithAppleLogin() // Provide different validation for apple login
    ),
    reValidateMode: "onChange",
  });

  const occupation = getValues("occupation");
  const birth = getValues("birth");
  const handleDatePicked = (date?: Date) => {
    if (date) {
      setValue("birth", date);
      setSelectedDate(date);
    }
    setShowDateTimePicker(false);
  };

  const handleOccupationPicked = (value: number | string) => {
    if (typeof value !== "number") {
      setValue("occupation", value.toUpperCase());
      setOtherOccupation(value.toUpperCase());
      return;
    }
    if (value >= 0) {
      setSelectedOccupationIndex(value);
      setValue("occupation", occupationList[value].name);
      setOtherOccupation(occupationList[value].name);
    }
    setShowOccupationPicker(false);
  };
  const handleSubmitForm = (data: any) => {
    if (otherOccupation) {
      data.occupation = otherOccupation;
      data.occupationDetail = otherOccupation;
      setProfile({ ...data });
      navigation.navigate("CompleteProfileStep2Screen");
    }
  };

  useEffect(() => {
    const getAppleUserProfile = async () => {
      const userEmailFromStorage = userAppleInfo.email;
      const userSubFromStorage = userAppleInfo.sub;
      const userTempName = userEmailFromStorage || userSubFromStorage || "";
      setValue("name", userTempName, { shouldValidate: true });
      setValue("surname", userTempName, { shouldValidate: true });
    };
    if (userProfile.loginType === "apple") getAppleUserProfile(); // Set name and surname for apple login
  }, []);

  useEffect(() => {
    const getOccupationList = async () => {
      const { data } = await serviceGetListOccupation();
      // find value have name = "ALTRO" in data and put it to the end of array
      const index = data.findIndex((item) => item.name === "ALTRO");
      const temp = data[index];
      data.splice(index, 1);
      data.push(temp);
      setOccupationList(data);
    };
    getOccupationList();
  }, []);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  return (
    <View className="" testID="complete_profile_step_1">
      <DateTimePicker2
        shouldMinus16Years
        selectedDate={selectedDate}
        setSelectedDate={handleDatePicked}
        setShowDateTimePicker={setShowDateTimePicker}
        showDateTimePicker={showDateTimePicker}
        maximumDate={dayjs().subtract(16, "years").startOf("day").toDate()}
        minimumDate={dayjs().subtract(100, "years").startOf("day").toDate()}
      />

      <SelectPickerOccupation
        occupationList={occupationList}
        title={t("edit_personal_profile_screen.occupation") || "Occupation"}
        show={showOccupationPicker}
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
            <Text className="text-h4 font-medium leading-6 text-black-default">
              {t("form_onboarding.screen_1.title")}
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
                    <>
                      {userProfile.loginType !== "apple" && (
                        <View className="flex flex-col">
                          <TextInput
                            label={
                              t("form_onboarding.screen_1.first_name") ||
                              "First name"
                            }
                            placeholder={
                              t("form_onboarding.screen_1.enter_first_name") ||
                              "Enter your first name"
                            }
                            placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            testID="complete_profile_step_1_name_input"
                          />
                          {errors.name && (
                            <View className="flex flex-row pt-2">
                              <Warning />
                              <Text
                                className="pl-1 text-sm font-normal text-red-500"
                                testID="complete_profile_step_1_name_error_message"
                              >
                                {errors.name.message}
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                    </>
                  )}
                />
              </View>
              <View className="pt-3">
                <Controller
                  control={control}
                  name="surname"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      {userProfile.loginType !== "apple" && (
                        <View className="flex flex-col">
                          <TextInput
                            label={
                              t("form_onboarding.screen_1.last_name") ||
                              "Last name"
                            }
                            placeholder={
                              t("form_onboarding.screen_1.enter_last_name") ||
                              "Enter your last name"
                            }
                            placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            testID="complete_profile_step_1_surname_input"
                          />
                          {errors.surname && (
                            <View className="flex flex-row pt-2">
                              <Warning />
                              <Text
                                className="pl-1 text-sm font-normal text-red-500"
                                testID="complete_profile_step_1_surname_error_message"
                              >
                                {errors.surname.message}
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                    </>
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
                        label={
                          t("form_onboarding.screen_1.birth") || "Birthday"
                        }
                        placeholder={
                          t("form_onboarding.screen_1.select_your_birthday") ||
                          "Select your birth"
                        }
                        placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                        rightIcon={
                          <TouchableOpacity
                            onPress={() => setShowDateTimePicker(true)}
                          >
                            <CalendarIcon />
                          </TouchableOpacity>
                        }
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value && dayjs(value).format("DD/MM/YYYY")}
                        // textAlignVertical="top"
                        editable={false}
                        onPress={() => setShowDateTimePicker(true)}
                        className="text-black-default"
                        testID="complete_profile_step_1_birthdate_input"
                      />
                      {errors.birth && !birth && (
                        <View className="flex flex-row pt-2">
                          <Warning />
                          <Text
                            className="pl-1 text-sm font-normal text-red-500"
                            testID="complete_profile_step_1_birthdate_input_error_message"
                          >
                            {errors?.birth?.message as string}
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
                        label={
                          t("form_onboarding.screen_1.occupation") ||
                          "Occupation"
                        }
                        placeholder={
                          t("form_onboarding.screen_1.enter_occupation") ||
                          "Enter your occupation"
                        }
                        placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        onPress={() => setShowOccupationPicker(true)}
                        value={value}
                        testID="complete_profile_step_1_occupation_input"
                      />
                      {errors.occupation && !occupation && (
                        <View className="flex flex-row pt-2">
                          <Warning />
                          <Text
                            className="pl-1 text-sm font-normal text-red-500"
                            testID="complete_profile_step_1_occupation_input_error_message"
                          >
                            {errors.occupation.message}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                />
              </View>
              <Button
                testID="complete_profile_step_1_next_button"
                title={t("button.next") || "Next"}
                containerClassName="h-12 w-full bg-primary-default my-5 flex-none"
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
