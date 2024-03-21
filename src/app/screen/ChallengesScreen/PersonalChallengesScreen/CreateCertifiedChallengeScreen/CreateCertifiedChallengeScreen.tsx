import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { yupResolver } from "@hookform/resolvers/yup";
import clsx from "clsx";
import { Controller, Resolver, useForm } from "react-hook-form";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";

import { CreateCertifiedChallengeValidationSchema } from "../../../../Validators/CreateChallenge.validate";
import SoftSkillPicker from "../../../../component/SoftSkillPicker/SoftSkillPicker";
import DateTimePicker2 from "../../../../component/common/BottomSheet/DateTimePicker2/DateTimePicker2";
import ErrorText from "../../../../component/common/ErrorText";
import ImagePicker from "../../../../component/common/ImagePicker";
import TextInput from "../../../../component/common/Inputs/TextInput";
import { useNav } from "../../../../hooks/useNav";
import { useCreateChallengeDataStore } from "../../../../store/create-challenge-data-store";
import { ICreateChallenge } from "../../../../types/challenge";
import dayjs from "../../../../utils/date.util";
import CustomActivityIndicator from "../../../../component/common/CustomActivityIndicator";
import {
  getPurchasingChallengeData,
  setPurchasingChallengeData,
} from "../../../../utils/purchase.util";

interface ICreateCertifiedChallengeForm
  extends Omit<ICreateChallenge, "achievementTime"> {
  achievementTime: string | Date;
  image: string;
  softSkills: string[];
}

interface IFormValueInput {
  label: string;
  value: number; //rating
  id: string;
  testID?: string;
}

const CreateCertifiedChallengeScreen = () => {
  const onClose = () => {
    navigation.goBack();
  };
  const { t } = useTranslation();
  const navigation = useNav();
  const scrollViewRef = useRef(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);

  const [selectedCompetencedSkill, setSelectedCompetencedSkill] = useState<
    IFormValueInput[]
  >([]);

  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [softSkillValue, setSoftSkillValue] = useState<string[]>([]);

  const { setCreateChallengeDataStore, getCreateChallengeDataStore } =
    useCreateChallengeDataStore();

  const {
    control,
    getValues,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateCertifiedChallengeForm>({
    defaultValues: {
      goal: "" as string,
      benefits: "",
      reasons: "",
      achievementTime: undefined,
      image: "",
      softSkills: [],
    },
    reValidateMode: "onChange",
    resolver: yupResolver(
      CreateCertifiedChallengeValidationSchema()
    ) as unknown as Resolver<ICreateCertifiedChallengeForm, any>,
  });

  // useEffect(() => {
  //   const cachedChallenge = getPurchasingChallengeData();
  //   if (cachedChallenge) {
  //     reset(cachedChallenge);
  //     setPurchasingChallengeData(null); // The cached data should only be used once
  //   }
  // }, []);

  const handleShowDatePicker = () => {
    setShowDatePicker(true);
  };

  const handleDatePicked = (date?: Date) => {
    if (date) {
      setValue("achievementTime", date, {
        shouldValidate: true,
      });
    }
    setShowDatePicker(false);
  };

  const handleImagesSelected = (images: string[]) => {
    setValue("image", images[0], {
      shouldValidate: true,
    });
  };

  const handleRemoveSelectedImage = (index: number) => {
    setValue("image", undefined, {
      shouldValidate: true,
    });
  };

  const onSubmit = async (data: ICreateCertifiedChallengeForm) => {
    // remove rating and testID from softSkills
    if (isImageLoading) return;
    setIsLoading(true);
    setErrorMessage("");
    setCreateChallengeDataStore({
      ...data,
      type: "certified",
    });
    setIsLoading(false);
    setTimeout(() => {
      navigation.navigate("ChoosePackageScreen");
    }, 500);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSubmit(onSubmit)} className="mr-3">
          <Text className="text-base font-normal text-primary-default">
            {t("new_challenge_screen.next").toLocaleUpperCase()}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, []);

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

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      testID="user_create_challenge_screen"
    >
      <KeyboardAwareFlatList
        data={[]}
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={() => null}
        ListHeaderComponent={
          <View>
            <CustomActivityIndicator isVisible={isLoading} />
          </View>
        }
        ListFooterComponent={
          <View className="mx-4 flex h-full rounded-t-xl bg-white">
            <View className="flex flex-col  py-5">
              <Text className="text-md font-normal leading-5 text-gray-dark">
                {t("new_challenge_screen.description")}
              </Text>
              {errorMessage && (
                <ErrorText
                  containerClassName="justify-center "
                  message={errorMessage}
                />
              )}
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
                {errors.goal ? (
                  <ErrorText message={errors.goal.message} />
                ) : null}
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
                {errors.benefits ? (
                  <ErrorText message={errors.benefits.message} />
                ) : null}
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
                {errors.reasons ? (
                  <ErrorText message={errors.reasons.message} />
                ) : null}
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
                        onPress={handleShowDatePicker}
                        className={clsx(
                          errors.achievementTime && "border-1 border-red-500"
                        )}
                      />
                      <DateTimePicker2
                        selectedDate={value as Date}
                        setSelectedDate={handleDatePicked}
                        setShowDateTimePicker={setShowDatePicker}
                        showDateTimePicker={showDatePicker}
                        minimumDate={new Date()}
                      />
                    </>
                  )}
                  name={"achievementTime"}
                />
                {errors.achievementTime ? (
                  <ErrorText message={errors.achievementTime.message} />
                ) : null}
              </View>
              <View className="mt-5 flex flex-col">
                <Text className="pb-2 text-md font-semibold text-primary-default">
                  {t("form_onboarding.screen_4.soft_skills") || "Soft skills"}
                </Text>
                <SoftSkillPicker
                  value={softSkillValue}
                  dropDrownDirection="TOP"
                  openDropdown={openDropdown}
                  setValue={setSoftSkillValue}
                  setOpenDropdown={(value: boolean) => {
                    setOpenDropdown(value);

                    // Scroll to bottom when open dropdown on Android
                    // Cause: Cannot scroll the dropdown picker because it is nested in a scrollview (Android only) => need to set position which cause the dropdown always open at the bottom
                    if (Platform.OS === "android" && value)
                      scrollViewRef.current?.scrollToEnd();
                  }}
                  selectedCompetencedSkill={selectedCompetencedSkill}
                  setSelectedCompetencedSkill={handleSelectSoftSkills}
                />
                {errors.softSkills ? (
                  <ErrorText message={errors.softSkills.message} />
                ) : null}
              </View>
              <View className="mt-5">
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
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default CreateCertifiedChallengeScreen;
