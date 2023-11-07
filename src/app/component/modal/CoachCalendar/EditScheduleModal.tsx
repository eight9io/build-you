import clsx from "clsx";
import dayjs from "dayjs";
import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "react-native-date-picker";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Resolver, Controller } from "react-hook-form";
import { View, Modal, SafeAreaView, Platform, StyleSheet } from "react-native";

import { IScheduledTime } from "../../../types/schedule";
import { ICoachCreateScheduleForm } from "./CoachCreateScheduleModal";
import { editScheduleForIndividualCertifiedChallenge } from "../../../service/schedule";

import { CoachCreateScheduleSchema } from "../../../Validators/CoachCreateSchedule.validate";

import Header from "../../common/Header";
import ErrorText from "../../common/ErrorText";
import TextInput from "../../common/Inputs/TextInput";
import GlobalToastController from "../../common/Toast/GlobalToastController";

import CloseBtn from "../../asset/close.svg";
import GlobalDialogController from "../../common/Dialog/GlobalDialogController";

interface IEditScheduleModalProps {
  isVisible: boolean;
  schedule: IScheduledTime;
  setLocalSchedule: React.Dispatch<React.SetStateAction<IScheduledTime>>;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditScheduleModal: FC<IEditScheduleModalProps> = ({
  schedule,
  isVisible,
  setIsVisible,
  setLocalSchedule,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(schedule.schedule)
  );

  const { t } = useTranslation();
  const {
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ICoachCreateScheduleForm>({
    defaultValues: {
      date: selectedDate,
      linkVideoCall: schedule?.meetingUrl,
      note: schedule?.note,
    },
    resolver: yupResolver(CoachCreateScheduleSchema()) as unknown as Resolver<
      ICoachCreateScheduleForm,
      any
    >,
  });

  const onClose = () => {
    setIsVisible(false);
  };

  const handleDatePicked = (date?: any) => {
    if (typeof date.getMonth === "function") {
      setValue("date", date, {
        shouldValidate: true,
      });
    }
    setSelectedDate(date);
  };

  const onSubmit = async (data: ICoachCreateScheduleForm) => {
    try {
      const newDate = new Date(selectedDate).toISOString();
      const res = await editScheduleForIndividualCertifiedChallenge({
        scheduleId: schedule.id,
        schedule: newDate,
        meetingUrl: data.linkVideoCall,
        note: data.note,
      });
      setLocalSchedule(Array.isArray(res.data) ? res.data[0] : res.data);
      setIsVisible(false);
      setTimeout(() => {
        GlobalToastController.showModal({
          message: t("toast.edit_schedule_success"),
        });
      }, 500);
    } catch (error) {
      console.error("error", error);
      GlobalToastController.showModal({
        message: t("error_general_message"),
      });
      setIsVisible(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={isVisible}
      className="h-full"
    >
      <SafeAreaView className="flex-1 bg-white">
        <View className="px-4">
          <Header
            title={t("challenge_detail_screen_tab.coach_calendar.edit")}
            leftBtn={<CloseBtn fill={"black"} />}
            rightBtn={t("save")}
            onLeftBtnPress={onClose}
            onRightBtnPress={handleSubmit(onSubmit)}
            containerStyle={Platform.OS === "ios" ? "my-4" : "mt-0"}
          />
        </View>
        <View className="flex-1">
          <View className="flex flex-col p-4">
            <View className="h-64">
              <DatePicker
                date={selectedDate}
                textColor="#24252B"
                onDateChange={handleDatePicked}
                minimumDate={dayjs().startOf("day").toDate()}
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
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
});

export default EditScheduleModal;
