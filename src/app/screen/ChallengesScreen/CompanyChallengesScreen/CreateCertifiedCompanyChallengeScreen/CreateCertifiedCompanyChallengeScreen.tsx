import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { yupResolver } from "@hookform/resolvers/yup";
import clsx from "clsx";
import dayjs from "dayjs";
import React, { FC, useLayoutEffect, useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";

import Ionicons from "@expo/vector-icons/Ionicons";

import SoftSkillPicker from "../../../../component/SoftSkillPicker/SoftSkillPicker";
import DateTimePicker2 from "../../../../component/common/BottomSheet/DateTimePicker2/DateTimePicker2";
import ErrorText from "../../../../component/common/ErrorText";
import ImagePicker from "../../../../component/common/ImagePicker";
import TextInput from "../../../../component/common/Inputs/TextInput";
import CustomSwitch from "../../../../component/common/Switch";
import { useNav } from "../../../../hooks/useNav";
import { ICreateCompanyChallenge } from "../../../../types/challenge";

import { CreateCertifiedCompanyChallengeValidationSchema } from "../../../../Validators/CreateChallenge.validate";
import { useCreateChallengeDataStore } from "../../../../store/create-challenge-data-store";
import { useUserProfileStore } from "../../../../store/user-store";
import { ICreateChallenge } from "../../../../types/challenge";
import CustomActivityIndicator from "../../../../component/common/CustomActivityIndicator";

interface ICreateChallengeForm
  extends Omit<ICreateChallenge, "achievementTime"> {
  achievementTime: Date;
  image?: string | undefined;
  public: boolean;
  maximumPeople: number | undefined;
  softSkills: ISoftSkillsInput[];
}

interface ISoftSkillsInput {
  label: string;
  value: number; //rating
  id: string;
}

interface ICreateChallengeModalProps {
  onClose: () => void;
}

const CreateCertifiedCompanyChallengeScreen: FC<
  ICreateChallengeModalProps
> = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);

  const [selectedCompetencedSkill, setSelectedCompetencedSkill] = useState<
    ISoftSkillsInput[]
  >([]);

  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [softSkillValue, setSoftSkillValue] = useState<string[]>([]);

  const { t } = useTranslation();
  const navigation = useNav();
  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();
  const isCurrentUserCompany = currentUser?.companyAccount;
  const { setCreateChallengeDataStore } = useCreateChallengeDataStore();

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<ICreateChallengeForm>({
    defaultValues: {
      goal: "",
      benefits: "",
      reasons: "",
      achievementTime: undefined,
      maximumPeople: undefined,
      public: false,
      image: "",
      softSkills: [],
    },
    resolver: yupResolver(
      CreateCertifiedCompanyChallengeValidationSchema()
    ) as unknown as Resolver<ICreateChallengeForm, any>,
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: ICreateCompanyChallenge) => {
    setIsLoading(true);
    const { softSkills, ...restData } = data;
    const softSkillsWithSkillLabel = softSkills.map((softSkill) => {
      const { label, ...rest } = softSkill;
      return {
        ...rest,
        skill: label,
      };
    });
    setCreateChallengeDataStore({
      ...restData,
      softSkills: softSkillsWithSkillLabel,
      type: "certified",
    });
    setIsLoading(false);
    setTimeout(() => {
      navigation.navigate("ChoosePackageScreen");
    }, 500);
  };

  const handleImagesSelected = (images: string[]) => {
    setValue("image", images[0], {
      shouldValidate: true,
    });
  };

  const handleDatePicked = (date?: any) => {
    if (typeof date.getMonth === "function") {
      setValue("achievementTime", date, {
        shouldValidate: true,
      });
    }
    setShowDatePicker(false);
  };

  const handleRemoveSelectedImage = (index: number) => {
    setValue("image", "", {
      shouldValidate: true,
    });
  };

  const handleSelectSoftSkills = (softSkills: any) => {
    const softSkillsWithoutTestID = softSkills.map((softSkill: any) => {
      const { testID, value, ...rest } = softSkill;
      return rest;
    });
    setSelectedCompetencedSkill(softSkillsWithoutTestID);
    setValue("softSkills", softSkillsWithoutTestID, {
      shouldValidate: true,
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSubmit(onSubmit)} className="mr-3">
          <Text className="text-base font-normal text-primary-default">
            {t("new_challenge_screen.next_button").toLocaleUpperCase()}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <SafeAreaView className="flex flex-1 flex-col bg-white">
      <CustomActivityIndicator isVisible={isLoading} />

      <KeyboardAwareFlatList
        data={[]}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={() => null}
        ListHeaderComponent={
          <View>
            <CustomActivityIndicator isVisible={isLoading} />
          </View>
        }
        ListFooterComponent={
          <View className=" flex h-full  rounded-t-xl bg-white">
            <View className="mb-10 mt-2 flex flex-col px-5">
              <Text className="text-md font-normal leading-5 text-gray-dark">
                {t("new_challenge_screen.description") ||
                  "Create a new challenge for yourself with a concrete goal and time to reach it."}{" "}
              </Text>
              <View className="pt-5">
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label={t("new_challenge_screen.your_goal") || ""}
                      placeholder={
                        t("new_challenge_screen.your_goal_placeholder") || ""
                      }
                      placeholderTextColor={"#6C6E76"}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      className={clsx(errors.goal && "border-1 border-red-500")}
                    />
                  )}
                  name={"goal"}
                />
                {errors.goal && <ErrorText message={errors.goal.message} />}
              </View>
              <View className="pt-5">
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label={t("new_challenge_screen.benefits") || ""}
                      placeholder={
                        t("new_challenge_screen.benefits_placeholder") || ""
                      }
                      placeholderTextColor={"#6C6E76"}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      multiline
                      textAlignVertical="top"
                      value={value}
                      className={clsx(
                        "h-24",
                        errors.benefits && "border-1 border-red-500"
                      )}
                    />
                  )}
                  name={"benefits"}
                />
                {errors.benefits && (
                  <ErrorText message={errors.benefits.message} />
                )}
              </View>

              <View className="pt-5">
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                      <TextInput
                        label={t("new_challenge_screen.reasons") || ""}
                        placeholder={
                          t("new_challenge_screen.reasons_placeholder") || ""
                        }
                        placeholderTextColor={"#6C6E76"}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        multiline
                        textAlignVertical="top"
                        className={clsx(
                          "h-24",
                          errors.reasons && "border-1 border-red-500"
                        )}
                      />
                    </View>
                  )}
                  name={"reasons"}
                />
                {errors.reasons && (
                  <ErrorText message={errors.reasons.message} />
                )}
              </View>
              <View className="mt-5">
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <TextInput
                        label={
                          t("new_challenge_screen.time_to_reach_goal") || ""
                        }
                        placeholder={
                          t(
                            "new_challenge_screen.time_to_reach_goal_placeholder"
                          ) || ""
                        }
                        placeholderTextColor={"#6C6E76"}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        editable={false}
                        value={value ? dayjs(value).format("DD/MM/YYYY") : ""}
                        rightIcon={
                          <MaterialCommunityIcons
                            name="calendar-month-outline"
                            size={24}
                            color="#FFF"
                          />
                        }
                        onPress={() => setShowDatePicker(true)}
                        className={clsx(
                          errors.achievementTime && "border-1 border-red-500"
                        )}
                      />
                      <DateTimePicker2
                        selectedDate={value}
                        setSelectedDate={handleDatePicked}
                        setShowDateTimePicker={setShowDatePicker}
                        showDateTimePicker={showDatePicker}
                        minimumDate={new Date()}
                      />
                    </>
                  )}
                  name={"achievementTime"}
                />
                {errors.achievementTime && (
                  <ErrorText message={errors.achievementTime.message} />
                )}
              </View>

              <View className="pt-5">
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label={t("new_challenge_screen.max_people") || ""}
                      placeholder={
                        t("new_challenge_screen.max_people_placeholder") || ""
                      }
                      placeholderTextColor={"#6C6E76"}
                      onChangeText={(number) => onChange(+number)}
                      onBlur={onBlur}
                      value={value ? value.toString() : ""}
                      keyboardType="number-pad"
                      className={clsx(errors.goal && "border-1 border-red-500")}
                    />
                  )}
                  name={"maximumPeople"}
                />
                {errors.maximumPeople && (
                  <ErrorText message={errors.maximumPeople.message} />
                )}
              </View>
              <View className="mt-5 flex flex-col ">
                <Text className="pb-2 text-md font-semibold text-primary-default">
                  {t("form_onboarding.screen_4.soft_skills") || "Soft skills"}
                </Text>
                <SoftSkillPicker
                  value={softSkillValue}
                  dropDrownDirection="TOP"
                  openDropdown={openDropdown}
                  setValue={setSoftSkillValue}
                  setOpenDropdown={setOpenDropdown}
                  selectedCompetencedSkill={selectedCompetencedSkill}
                  setSelectedCompetencedSkill={handleSelectSoftSkills}
                />
                {errors.softSkills ? (
                  <ErrorText message={errors.softSkills.message} />
                ) : null}
              </View>

              <View className="flex flex-col justify-start pt-5">
                <CustomSwitch
                  textDisable={t("private") || "Private"}
                  textEnable={t("public") || "Public"}
                  setValue={setValue}
                />
                <Text className="pt-2 text-sm font-normal leading-4 text-gray-dark ">
                  {t("new_challenge_screen.challenge_status_description") ||
                    "Everyone can join your public challenge while only user from your company can join your private challenge."}
                </Text>
              </View>

              <View className="mt-5">
                {/* <ImagePicker isSelectedImage /> */}
                <ImagePicker
                  images={getValues("image") ? [getValues("image")!] : []}
                  onImagesSelected={handleImagesSelected}
                  onRemoveSelectedImage={handleRemoveSelectedImage}
                  base64
                  loading={isImageLoading}
                  setLoading={setIsImageLoading}
                />
                {!isImageLoading && errors.image && (
                  <ErrorText message={errors.image.message} />
                )}
                {isImageLoading && errors.image && (
                  <Text className="pt-2 text-sm text-red-500">
                    <Ionicons
                      name="alert-circle-outline"
                      size={14}
                      color="#FF4949"
                    />
                    {t("image_picker.upload_a_video_waiting") as string}
                  </Text>
                )}
              </View>
            </View>
            <View className="h-20" />
          </View>
        }
      />
    </SafeAreaView>
  );
};
export default CreateCertifiedCompanyChallengeScreen;
