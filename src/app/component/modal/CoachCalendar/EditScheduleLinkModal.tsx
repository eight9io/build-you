import React, { FC } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { View, Modal, SafeAreaView, Platform, Text } from "react-native";

import { useUserProfileStore } from "../../../store/user-store";
import { AddScheduleLinkSchema } from "../../../Validators/AddScheduleLink.validate";

import { serviceUpdateCalendlyLink } from "../../../service/profile";

import Header from "../../common/Header";
import ErrorText from "../../common/ErrorText";
import Button from "../../common/Buttons/Button";
import TextInput from "../../common/Inputs/TextInput";
import GlobalDialogController from "../../common/Dialog/GlobalDialogController";
import GlobalToastController from "../../common/Toast/GlobalToastController";

import CloseBtn from "../../asset/close.svg";

interface IEditScheduleLinkModalProps {
  link: string;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setCoachCalendyLink: React.Dispatch<React.SetStateAction<string>>;
}

interface IAddScheduleInput {
  link: string;
}

const EditScheduleLinkModal: FC<IEditScheduleLinkModalProps> = ({
  link,
  isVisible,
  setIsVisible,
  setCoachCalendyLink,
}) => {
  const { t } = useTranslation();
  const isAndroid = Platform.OS === "android";

  const { getUserProfile, setUserProfile } = useUserProfileStore();
  const currectUser = getUserProfile();

  const {
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<IAddScheduleInput>({
    defaultValues: {
      link: link || "",
    },
    resolver: yupResolver(AddScheduleLinkSchema()),
  });

  const onSubmit = async (data: IAddScheduleInput) => {
    try {
      await serviceUpdateCalendlyLink({
        userId: currectUser?.id,
        calendlyLink: data.link,
      });
      setUserProfile({ ...currectUser, calendly: data.link });
      setCoachCalendyLink(data.link);
      onClose();
      setTimeout(() => {
        GlobalToastController.showModal({
          message:
            t("toast.add_calendy_link_success") ||
            "Your progress has been created successfully!",
        });
      }, 500);
    } catch (error) {
      GlobalDialogController.showModal({
        title: t("dialog.err_title"),
        message:
          t("error_general_message") ||
          "Something went wrong. Please try again later!",
      });
      console.error(error);
    }
  };

  const onClose = () => {
    setIsVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={isVisible}
      className="h-full"
    >
      <SafeAreaView className="relative flex-1 bg-white">
        <View className="px-4">
          <Header
            title={
              t(
                "challenge_detail_screen_tab.coach_calendar.add_schedule_link_btn"
              ) as string
            }
            leftBtn={<CloseBtn fill={"black"} />}
            onLeftBtnPress={onClose}
            containerStyle={Platform.OS === "ios" ? "my-4" : "mt-0"}
          />
        </View>
        <View className="flex-1 p-4">
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label={t("challenge_detail_screen_tab.coach_calendar.link")}
                placeholder={t(
                  "challenge_detail_screen_tab.coach_calendar.link_placeholder"
                )}
                placeholderTextColor={"#6C6E76"}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                className={clsx(errors.link && "border-1 border-red-500")}
              />
            )}
            name={"link"}
          />
          {errors.link && <ErrorText message={errors.link?.message} />}
        </View>

        <View
          className={clsx(
            "absolute bottom-[40px] h-12 w-full bg-white px-4",
            isAndroid && "bottom-[50px]"
          )}
        >
          <Button
            title={t("save") || "Save"}
            onPress={handleSubmit(onSubmit)}
            containerClassName="bg-primary-default flex-1"
            textClassName="text-white"
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default EditScheduleLinkModal;
