import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Modal, SafeAreaView, View, Text, ScrollView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { useNav } from "../../hooks/useNav";
import useModal from "../../hooks/useModal";
import { updateChallenge, updateChallengeImage } from "../../service/challenge";

import { IChallenge, IEditChallenge } from "../../types/challenge";
import { EditChallengeValidationSchema } from "../../Validators/EditChallenge.validate";

import dayjs from "../../utils/date.util";

import Header from "../common/Header";
import ErrorText from "../common/ErrorText";
import ImagePicker from "../common/ImagePicker";
import TextInput from "../common/Inputs/TextInput";
import ConfirmDialog from "../common/Dialog/ConfirmDialog";
import CustomActivityIndicator from "../common/CustomActivityIndicator";
import GlobalToastController from "../common/Toast/GlobalToastController";
import DateTimePicker2 from "../common/BottomSheet/DateTimePicker2/DateTimePicker2";

import { useChallengeUpdateStore } from "../../store/challenge-update-store";
import CalendarIcon from "../asset/calendar.svg";
import CloseIcon from "../asset/close.svg";

interface IEditChallengeModalProps {
  challenge: IChallenge;
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const EditChallengeModal: FC<IEditChallengeModalProps> = ({
  challenge,
  visible,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const navigation = useNav();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);

  const {
    isVisible: isConfirmModalVisible,
    openModal: openConfirmModal,
    closeModal: closeConfirmModal,
  } = useModal();

  const { setChallengeUpdateDetails } = useChallengeUpdateStore();

  const {
    control,
    getValues,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<IEditChallenge>({
    defaultValues: {
      goal: challenge.goal,
      benefits: challenge.benefits,
      reasons: challenge.reasons,
      image: challenge.image,
      achievementTime: dayjs(challenge.achievementTime).format("YYYY-MM-DD"),
    },
    resolver: yupResolver(EditChallengeValidationSchema()),
  });

  const handleShowDatePicker = () => {
    setShowDatePicker(true);
  };

  const handleDatePicked = (date?: Date) => {
    if (date) {
      setValue("achievementTime", dayjs(date).format("YYYY-MM-DD"), {
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

  const onSubmit = async (data: IEditChallenge) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const { image, ...rest } = data; // Images upload will be handle separately

      await Promise.all([
        updateChallenge(challenge.id, { ...rest }),
        updateChallengeImage({ id: challenge.id }, image),
      ]);

      GlobalToastController.showModal({
        message:
          t("toast.edit_challenge_success") ||
          "Your edit has been created successfully ! ",
      });
      setChallengeUpdateDetails({
        challengeId: challenge.id,
        goal: data.goal,
      });
      onConfirm();
    } catch (error) {
      setErrorMessage(t("errorMessage:500") || "");
    }
    setIsLoading(false);
  };

  const handleCloseConfirmModal = (challengeId: string) => {
    closeConfirmModal();
    // Close edit challenge modal and navigate to challenge detail screen
    onConfirm();
    navigation.navigate("PersonalChallengeDetailScreen", {
      challengeId: challengeId,
    });
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={visible}
    >
      <SafeAreaView className="flex-1">
        <CustomActivityIndicator isVisible={isLoading} />

        <View className="px-4 py-2">
          <Header
            title={t("edit_challenge_screen.title") || ""}
            rightBtn={t(
              "edit_challenge_screen.save_button"
            ).toLocaleUpperCase()}
            leftBtn={<CloseIcon width={24} height={24} fill={"#34363F"} />}
            onLeftBtnPress={() => {
              onClose();
              reset();
            }}
            onRightBtnPress={handleSubmit(onSubmit)}
            containerStyle="mt-2"
          />
        </View>
        <KeyboardAwareScrollView
          contentContainerStyle={{
            flex: 1,
          }}
        >
          <ScrollView className=" flex h-full rounded-t-xl">
            <View className="mx-4 flex flex-1 flex-col">
              <View className="pt-5">
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label={t("edit_challenge_screen.your_goal") || ""}
                      placeholder={
                        t("edit_challenge_screen.your_goal_placeholder") || ""
                      }
                      placeholderTextColor={"#6C6E76"}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
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
                      label={t("edit_challenge_screen.benefits") || ""}
                      placeholder={
                        t("edit_challenge_screen.benefits_placeholder") || ""
                      }
                      placeholderTextColor={"#6C6E76"}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      multiline
                      textAlignVertical="top"
                      className="h-24"
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
                    <TextInput
                      label={t("edit_challenge_screen.reasons") || ""}
                      placeholder={
                        t("edit_challenge_screen.reasons_placeholder") || ""
                      }
                      placeholderTextColor={"#6C6E76"}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      multiline
                      textAlignVertical="top"
                      className="h-24"
                    />
                  )}
                  name={"reasons"}
                />
                {errors.reasons ? (
                  <ErrorText message={errors.reasons.message} />
                ) : null}
              </View>

              <View className="mt-5">
                <Text className="mb-1 text-md font-semibold text-primary-default">
                  {t("edit_challenge_screen.benefits") || ""}
                </Text>
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

              <View className="mt-5">
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <TextInput
                        label={
                          t("edit_challenge_screen.time_to_reach_goal") || ""
                        }
                        placeholder={
                          t(
                            "edit_challenge_screen.time_to_reach_goal_placeholder"
                          ) || ""
                        }
                        placeholderTextColor={"#6C6E76"}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        editable={false}
                        value={value ? dayjs(value).format("DD/MM/YYYY") : ""}
                        rightIcon={<CalendarIcon />}
                        onPress={handleShowDatePicker}
                      />
                      <DateTimePicker2
                        selectedDate={dayjs(value).toDate()}
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

              <View className="h-10" />
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
      </SafeAreaView>
      <ConfirmDialog
        title={(!errorMessage ? t("success") : t("error")) || ""}
        description={
          (!errorMessage
            ? t("edit_challenge_screen.edit_success")
            : t("errorMessage:500")) || ""
        }
        isVisible={isConfirmModalVisible}
        onClosed={() => handleCloseConfirmModal(challenge.id)}
        closeButtonLabel={t("close") || ""}
      />
    </Modal>
  );
};
export default EditChallengeModal;
