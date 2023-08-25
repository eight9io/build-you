import { View, Text, Modal, SafeAreaView, ScrollView } from "react-native";
import React, { FC, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import clsx from "clsx";
import dayjs from "dayjs";
import Spinner from "react-native-loading-spinner-overlay";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { useNav } from "../../../../navigation/navigation.type";
import { ICreateCompanyChallenge } from "../../../../types/challenge";
import { CreateCompanyChallengeValidationSchema } from "../../../../Validators/CreateChallenge.validate";
import Header from "../../../../component/common/Header";
import CustomSwitch from "../../../../component/common/Switch";
import ErrorText from "../../../../component/common/ErrorText";
import ImagePicker from "../../../../component/common/ImagePicker";
import TextInput from "../../../../component/common/Inputs/TextInput";
import ConfirmDialog from "../../../../component/common/Dialog/ConfirmDialog";
import DateTimePicker2 from "../../../../component/common/BottomSheet/DateTimePicker2.tsx/DateTimePicker2";

import { ICreateChallenge } from "../../../../types/challenge";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  createCompanyChallenge,
  updateChallengeImage,
} from "../../../../service/challenge";
import { AxiosResponse } from "axios";
import httpInstance from "../../../../utils/http";
import GlobalDialogController from "../../../../component/common/Dialog/GlobalDialogController";
import GlobalToastController from "../../../../component/common/Toast/GlobalToastController";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StackActions } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface ICreateChallengeForm
  extends Omit<ICreateChallenge, "achievementTime"> {
  achievementTime: Date;
  image?: string | undefined;
  public: boolean;
  maximumPeople: number | undefined;
}

interface ICreateChallengeModalProps {
  onClose: () => void;
}

export const CreateCompanyChallengeScreen: FC<
  ICreateChallengeModalProps
> = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [isRequestSuccess, setIsRequestSuccess] = useState<boolean | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const [newChallengeId, setNewChallengeId] = useState<string | undefined>(
    undefined
  );
  const [errorMessage, setErrorMessage] = useState("");

  const { t } = useTranslation();
  const navigation = useNav();
  const onClose = () => {
    navigation.goBack();
  };

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
    },
    resolver: yupResolver(CreateCompanyChallengeValidationSchema()),
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: ICreateCompanyChallenge) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const { image, ...rest } = data; // Images upload will be handled separately
      const payload = {
        ...rest,
        achievementTime: data.achievementTime as Date,
      };
      const challengeCreateResponse = await createCompanyChallenge(payload);
      const newChallengeId = challengeCreateResponse.data.id;
      // If challenge created successfully, upload image
      if (challengeCreateResponse.status === 200 || 201) {
        setNewChallengeId(challengeCreateResponse.data.id);
        if (image) {
          const challengeImageResponse = (await updateChallengeImage(
            {
              id: newChallengeId,
            },
            image
          )) as AxiosResponse;
          if (challengeImageResponse.status === 200 || 201) {
            GlobalToastController.showModal({
              message:
                t("toast.create_challenge_success") ||
                "Your challenge has been created successfully !",
            });

            const isChallengesScreenInStack = navigation
              .getState()
              .routes.some((route) => route.name === "Challenges");
            if (isChallengesScreenInStack) {
              navigation.dispatch(StackActions.popToTop());
            } else {
              // add ChallengesScreen to the stack
              navigation.navigate("Challenges");
            }

            navigation.navigate("Challenges", {
              screen: "CompanyChallengeDetailScreen",
              params: { challengeId: newChallengeId },
            });

            setIsLoading(false);
            return;
          }
          setIsRequestSuccess(false);
          setIsShowModal(true);
          httpInstance.delete(
            `/challenge/delete/${challengeCreateResponse.data.id}`
          );
          GlobalDialogController.showModal({
            title: t("dialog.err_title"),
            message:
              t("error_general_message") ||
              "Something went wrong. Please try again later!",
          });
        }
        setIsLoading(false);
        setIsRequestSuccess(true);
        setIsShowModal(true);
      }
    } catch (error) {
      setIsLoading(false);
      GlobalDialogController.showModal({
        title: t("dialog.err_title"),
        message:
          t("error_general_message") ||
          "Something went wrong. Please try again later!",
      });
    }
  };

  const handleImagesSelected = (images: string[]) => {
    setValue("image", images[0], {
      shouldValidate: true,
    });
  };

  const handleCloseModal = (newChallengeId: string | undefined) => {
    setIsShowModal(false);
    if (isRequestSuccess && newChallengeId) {
      onClose();
      navigation.navigate("Challenges", {
        screen: "PersonalChallengeDetailScreen",
        params: { challengeId: newChallengeId },
      });
    }
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSubmit(onSubmit)}>
          <Text className="text-base font-normal text-primary-default">
            {t("new_challenge_screen.create_button").toLocaleUpperCase()}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <SafeAreaView className="flex flex-col bg-white">
      {isLoading && <Spinner visible={isLoading} />}

      <ConfirmDialog
        title={
          isRequestSuccess
            ? t("dialog.success_title") || "Success"
            : t("dialog.err_title") || "Error"
        }
        description={
          isRequestSuccess
            ? t("dialog.create_challenge_success") ||
              "Your challenge has been created successfully !"
            : t("error_general_message") ||
              "Something went wrong. Please try again later."
        }
        isVisible={isShowModal}
        onClosed={() => handleCloseModal(newChallengeId)}
        closeButtonLabel={t("dialog.got_it") || "Got it"}
      />

      <KeyboardAwareScrollView extraHeight={150}>
        <View className=" flex h-full  rounded-t-xl bg-white">
          <ScrollView showsVerticalScrollIndicator>
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
          </ScrollView>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};
export default CreateCompanyChallengeScreen;
