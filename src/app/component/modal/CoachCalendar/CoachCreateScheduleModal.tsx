import clsx from "clsx";
import dayjs from "dayjs";
import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, Resolver, useForm } from "react-hook-form";
import DatePicker from "react-native-date-picker";

import { Modal, Platform, SafeAreaView, View, StyleSheet } from "react-native";

import Header from "../../common/Header";
import ErrorText from "../../common/ErrorText";
import TextInput from "../../common/Inputs/TextInput";
import { CoachCreateScheduleSchema } from "../../../Validators/CoachCreateSchedule.validate";

import CloseBtn from "../../asset/close.svg";
import { createScheduleForIndividualCertifiedChallenge } from "../../../service/schedule";
import GlobalToastController from "../../common/Toast/GlobalToastController";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface ICoachCreateScheduleModalProps {
  isVisible: boolean;
  challengeId: string;
  setShouldParentRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ICoachCreateScheduleForm {
  linkVideoCall: string;
  note: string;
  date: Date;
}

const CoachCreateScheduleModal: FC<ICoachCreateScheduleModalProps> = ({
  isVisible,
  challengeId,
  setIsVisible,
  setShouldParentRefresh,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { t } = useTranslation();
  const currentDatetime = dayjs().format("YYYY-MM-DDTHH:mm:ss");

  const {
    control,
    setValue,
    reset,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ICoachCreateScheduleForm>({
    defaultValues: {
      date: undefined,
      linkVideoCall: "",
      note: "",
    },
    resolver: yupResolver(CoachCreateScheduleSchema()) as unknown as Resolver<
      ICoachCreateScheduleForm,
      any
    >,
  });

  const handleDatePicked = (date?: any) => {
    if (date) {
      setValue("date", date, {
        shouldValidate: true,
      });
    }
    setSelectedDate(date);
  };

  const onSubmit = async (data: ICoachCreateScheduleForm) => {
    try {
      const date = new Date(data.date).toISOString();
      const timeWhenCreateSchedule = dayjs().format("YYYY-MM-DDTHH:mm:ss");
      if (dayjs(date).isBefore(timeWhenCreateSchedule)) {
        setError("date", {
          type: "manual",
          message: t("create_schedule_modal.error.old_date_time"),
        });
        return;
      }
      await createScheduleForIndividualCertifiedChallenge({
        challengeId: challengeId,
        schedule: date,
        meetingUrl: data.linkVideoCall,
        note: data.note,
      }).then(() => {
        setIsVisible(false);
        GlobalToastController.showModal({
          message: t("toast.create_schedule_success"),
        });
        setShouldParentRefresh(true);
      });
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={isVisible}
      className="h-full"
    >
      <SafeAreaView className="relative flex-1 bg-white">
        <KeyboardAwareScrollView
          contentContainerStyle={{
            flex: 1,
          }}
        >
          <View className="px-4">
            <Header
              title={t("create_schedule_modal.title") as string}
              leftBtn={<CloseBtn fill={"black"} />}
              rightBtn={t("save") as string}
              onLeftBtnPress={() => setIsVisible(false)}
              onRightBtnPress={handleSubmit(onSubmit)}
              containerStyle={Platform.OS === "ios" ? "my-4" : "mt-0"}
            />
          </View>

          <View className="flex flex-col p-4">
            <View className="h-64">
              <DatePicker
                date={selectedDate}
                mode="datetime"
                textColor="#24252B"
                onDateChange={handleDatePicked}
                minimumDate={new Date(currentDatetime)}
              />
            </View>
            {errors.date ? <ErrorText message={errors.date.message} /> : null}
          </View>

          <View className="p-4">
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label={t("create_schedule_modal.link_video_call")}
                  placeholder={t(
                    "create_schedule_modal.link_video_call_placeholder"
                  )}
                  placeholderTextColor={"#6C6E76"}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  className={clsx(
                    errors.linkVideoCall && "border-1 border-red-500"
                  )}
                />
              )}
              name={"linkVideoCall"}
            />
            {errors.linkVideoCall && (
              <ErrorText message={errors.linkVideoCall?.message} />
            )}
          </View>
          <View className=" px-4">
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label={t("create_schedule_modal.note")}
                  placeholder={t("create_schedule_modal.note_placeholder")}
                  placeholderTextColor={"#6C6E76"}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  className={clsx(
                    errors.linkVideoCall && "border-1 border-red-500"
                  )}
                />
              )}
              name={"note"}
            />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default CoachCreateScheduleModal;
