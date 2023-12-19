import { yupResolver } from "@hookform/resolvers/yup";
import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Modal, SafeAreaView, View } from "react-native";

import { EditProgressValidationSchema } from "../../Validators/EditProgress.validate";
import { IProgressChallenge } from "../../types/challenge";
import { IUpdateProgress } from "../../types/progress";

import { updateProgress } from "../../service/progress";

import ErrorText from "../common/ErrorText";
import Header from "../common/Header";
import ImageSwiper from "../common/ImageSwiper";
import TextInput from "../common/Inputs/TextInput";
import VideoPlayer from "../common/VideoPlayer";

import CloseIcon from "../asset/close.svg";
import GlobalToastController from "../common/Toast/GlobalToastController";
import CustomActivityIndicator from "../common/CustomActivityIndicator";

interface IEditChallengeProgressModalProps {
  progress: IProgressChallenge;
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const EditChallengeProgressModal: FC<
  IEditChallengeProgressModalProps
> = ({ progress, isVisible, onClose, onConfirm }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const {
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      caption: progress?.caption,
    },
    resolver: yupResolver(EditProgressValidationSchema()),
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (progress) {
      setValue("caption", progress?.caption);
    }
  }, [progress]);

  const onSubmit = async (data: IUpdateProgress) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const res = await updateProgress(progress.id, {
        ...data,
      });
      if (res.status === 200) {
        handleCloseConfirmModal();
        GlobalToastController.showModal({
          message: t("edit_progress_modal.edit_success") as string,
        });
      } else {
        setErrorMessage(t("errorMessage:500") || "");
      }
    } catch (error) {
      setErrorMessage(t("errorMessage:500") || "");
    }
    setIsLoading(false);
  };

  const handleCloseConfirmModal = () => {
    onConfirm();
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={isVisible}
    >
      <SafeAreaView className=" bg-white">
        <CustomActivityIndicator isVisible={isLoading} />

        <View className="mx-4 flex h-full flex-col rounded-t-xl bg-white">
          <Header
            title={t("challenge_detail_screen.edit_progress") || ""}
            rightBtn={t("edit_progress_modal.save_button").toLocaleUpperCase()}
            leftBtn={<CloseIcon width={24} height={24} fill={"#34363F"} />}
            onLeftBtnPress={() => {
              onClose();
              reset();
            }}
            onRightBtnPress={handleSubmit(onSubmit)}
          />

          <View className="flex flex-col justify-between pt-4">
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label={t("edit_progress_modal.caption") || ""}
                  placeholder={
                    t("edit_progress_modal.caption_placeholder") || ""
                  }
                  placeholderTextColor={"#6C6E76"}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  multiline
                  textAlignVertical="top"
                  className="h-32"
                />
              )}
              name={"caption"}
            />
            {errors.caption ? (
              <ErrorText message={errors.caption.message} />
            ) : null}
          </View>
          {progress?.image ? (
            <View className="mt-5 aspect-square w-full">
              <ImageSwiper imageSrc={progress?.image.replace(";", "") || ""} />
            </View>
          ) : progress.video ? (
            <View className="mt-5 aspect-square w-full">
              <VideoPlayer src={progress.video} />
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    </Modal>
  );
};
export default EditChallengeProgressModal;
