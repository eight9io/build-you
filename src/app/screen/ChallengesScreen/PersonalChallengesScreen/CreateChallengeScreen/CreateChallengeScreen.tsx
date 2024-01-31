import React, { useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { yupResolver } from "@hookform/resolvers/yup";
import clsx from "clsx";
import { Controller, Resolver, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Ionicons from "@expo/vector-icons/Ionicons";
import { StackActions } from "@react-navigation/native";
import { CreateChallengeValidationSchema } from "../../../../Validators/CreateChallenge.validate";
import DateTimePicker2 from "../../../../component/common/BottomSheet/DateTimePicker2/DateTimePicker2";
import ConfirmDialog from "../../../../component/common/Dialog/ConfirmDialog/ConfirmDialog";
import ErrorText from "../../../../component/common/ErrorText";
import ImagePicker from "../../../../component/common/ImagePicker";
import TextInput from "../../../../component/common/Inputs/TextInput";
import GlobalToastController from "../../../../component/common/Toast/GlobalToastController";
import { useNav } from "../../../../hooks/useNav";
import {
  createChallenge,
  updateChallengeImage,
} from "../../../../service/challenge";
import { ICreateChallengeForm } from "../../../../types/challenge";
import dayjs from "../../../../utils/date.util";
import httpInstance from "../../../../utils/http";
import CustomActivityIndicator from "../../../../component/common/CustomActivityIndicator";

const CreateChallengeScreen = () => {
  const onClose = () => {
    navigation.goBack();
  };
  const { t } = useTranslation();
  const navigation = useNav();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [isRequestSuccess, setIsRequestSuccess] = useState<boolean | null>(
    null
  );
  const [newChallengeId, setNewChallengeId] = useState<string | undefined>(
    undefined
  );
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);

  const {
    control,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateChallengeForm>({
    defaultValues: {
      goal: "" as string,
      benefits: "",
      reasons: "",
      achievementTime: undefined,
      image: "",
    },
    resolver: yupResolver(
      CreateChallengeValidationSchema()
    ) as unknown as Resolver<ICreateChallengeForm, any>,
  });

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

  const onSubmit = async (data: ICreateChallengeForm) => {
    if (isImageLoading) return;
    setIsLoading(true);
    setErrorMessage("");
    let newChallengeId: string | null;

    try {
      const { image, ...rest } = data; // Images upload will be handle separately
      const payload = {
        ...rest,
        achievementTime: data.achievementTime as Date,
      };

      // Create a challenge without image
      const challengeCreateResponse = await createChallenge(payload);
      newChallengeId = challengeCreateResponse.data?.id;
      // If challenge created successfully, upload image
      if (
        challengeCreateResponse.status === 200 ||
        challengeCreateResponse.status === 201
      ) {
        try {
          setNewChallengeId(newChallengeId);
          if (image) {
            const challengeImageResponse = await updateChallengeImage(
              {
                id: newChallengeId,
              },
              image
            );

            if (
              challengeImageResponse.status === 200 ||
              challengeCreateResponse.status === 201
            ) {
              const isChallengesScreenInStack = navigation
                .getState()
                .routes.some((route) => route.name === "Challenges");
              if (isChallengesScreenInStack) {
                navigation.dispatch(StackActions.popToTop());
              } else {
                navigation.navigate("Challenges");
              }

              navigation.navigate("Challenges", {
                screen: "PersonalChallengeDetailScreen",
                params: { challengeId: newChallengeId },
              });

              GlobalToastController.showModal({
                message:
                  t("toast.create_challenge_success") ||
                  "Your challenge has been created successfully!",
              });
              // setIsRequestSuccess(true);
              // setIsShowModal(true);
              setIsLoading(false);
              return;
            }
            setIsRequestSuccess(false);
            setIsShowModal(true);
          }
          setIsRequestSuccess(true);
          setIsShowModal(true);
        } catch (error) {
          httpInstance.delete(`/challenge/delete/${newChallengeId}`);
        }
      }
    } catch (error) {
      setErrorMessage(t("errorMessage:500") || "");
    }
    setIsLoading(false);
  };

  const handleCloseModal = (newChallengeId: string | undefined) => {
    setIsShowModal(false);
    if (isRequestSuccess && newChallengeId) {
      onClose();

      navigation.navigate("HomeScreen", {
        screen: "Challenges",
        params: {
          screen: "PersonalChallengeDetailScreen",
          params: {
            challengeId: newChallengeId,
          },
        },
      });
    }
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
    <SafeAreaView
      className="flex-1 bg-white"
      testID="user_create_challenge_screen"
    >
      <KeyboardAwareScrollView>
        <CustomActivityIndicator isVisible={isLoading} />
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
              {errors.goal ? <ErrorText message={errors.goal.message} /> : null}
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
                      label={t("new_challenge_screen.time_to_reach_goal") || ""}
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
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default CreateChallengeScreen;
