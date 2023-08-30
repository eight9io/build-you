import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React, { FC, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import clsx from "clsx";
import dayjs from "dayjs";
import Spinner from "react-native-loading-spinner-overlay";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { useNav } from "../../../../navigation/navigation.type";
import { ICreateCompanyChallenge } from "../../../../types/challenge";
import { CreateCompanyChallengeValidationSchema } from "../../../../Validators/CreateChallenge.validate";
import CustomSwitch from "../../../../component/common/Switch";
import ErrorText from "../../../../component/common/ErrorText";
import ImagePicker from "../../../../component/common/ImagePicker";
import TextInput from "../../../../component/common/Inputs/TextInput";
import DateTimePicker2 from "../../../../component/common/BottomSheet/DateTimePicker2.tsx/DateTimePicker2";

import { ICreateChallenge } from "../../../../types/challenge";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import Ionicons from "@expo/vector-icons/Ionicons";
import SoftSkillPicker from "../../../../component/SoftSkillPicker/SoftSkillPicker";
import { useCreateChallengeDataStore } from "../../../../store/create-challenge-data-store";

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

export const CreateCertifiedCompanyChallengeScreen: FC<
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

  const { setCreateChallengeDataStore } = useCreateChallengeDataStore();

  const { t } = useTranslation();
  const navigation = useNav();

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
      CreateCompanyChallengeValidationSchema()
    ) as unknown as Resolver<ICreateChallengeForm, any>,
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: ICreateCompanyChallenge) => {
    setIsLoading(true);
    setCreateChallengeDataStore({
      ...data,
      type: "certified",
    });
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate("ChoosePackageScreen");
    }, 500);

    // try {
    //   const { image, ...rest } = data; // Images upload will be handled separately
    //   const payload = {
    //     ...rest,
    //     achievementTime: data.achievementTime as Date,
    //   };
    //   const challengeCreateResponse = await createCompanyChallenge(payload);
    //   const newChallengeId = challengeCreateResponse.data.id;
    //   // If challenge created successfully, upload image
    //   if (challengeCreateResponse.status === 200 || 201) {
    //     setNewChallengeId(challengeCreateResponse.data.id);
    //     if (image) {
    //       const challengeImageResponse = (await updateChallengeImage(
    //         {
    //           id: newChallengeId,
    //         },
    //         image
    //       )) as AxiosResponse;
    //       if (challengeImageResponse.status === 200 || 201) {
    //         GlobalToastController.showModal({
    //           message:
    //             t("toast.create_challenge_success") ||
    //             "Your challenge has been created successfully !",
    //         });

    //         const isChallengesScreenInStack = navigation
    //           .getState()
    //           .routes.some((route) => route.name === "Challenges");
    //         if (isChallengesScreenInStack) {
    //           navigation.dispatch(StackActions.popToTop());
    //         } else {
    //           // add ChallengesScreen to the stack
    //           navigation.navigate("Challenges");
    //         }

    //         navigation.navigate("Challenges", {
    //           screen: "CompanyChallengeDetailScreen",
    //           params: { challengeId: newChallengeId },
    //         });

    //         setIsLoading(false);
    //         return;
    //       }
    //       setIsRequestSuccess(false);
    //       setIsShowModal(true);
    //       httpInstance.delete(
    //         `/challenge/delete/${challengeCreateResponse.data.id}`
    //       );
    //       GlobalDialogController.showModal({
    //         title: t("dialog.err_title"),
    //         message:
    //           t("error_general_message") ||
    //           "Something went wrong. Please try again later!",
    //       });
    //     }
    //     setIsLoading(false);
    //     setIsRequestSuccess(true);
    //     setIsShowModal(true);
    //   }
    // } catch (error) {
    //   setIsLoading(false);
    //   GlobalDialogController.showModal({
    //     title: t("dialog.err_title"),
    //     message:
    //       t("error_general_message") ||
    //       "Something went wrong. Please try again later!",
    //   });
    // }
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
        <TouchableOpacity onPress={handleSubmit(onSubmit)}>
          <Text className="text-base font-normal text-primary-default">
            {t("new_challenge_screen.next_button").toLocaleUpperCase()}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <SafeAreaView className="flex flex-col bg-white">
      {isLoading && <Spinner visible={isLoading} />}

      <KeyboardAwareFlatList
        data={[]}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={() => null}
        ListHeaderComponent={
          <View>{isLoading && <Spinner visible={isLoading} />}</View>
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
                  shouldRenderSelectedSoftSkill={false}
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
