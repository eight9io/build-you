import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Modal, SafeAreaView, Platform, StyleSheet } from "react-native";

import { IScheduledTime } from "../../../types/schedule";

import Header from "../../common/Header";

import CloseBtn from "../../asset/close.svg";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Resolver, Controller, set } from "react-hook-form";
import { CoachCreateScheduleSchema } from "../../../Validators/CoachCreateSchedule.validate";
import { ICoachCreateScheduleForm } from "./CoachCreateScheduleModal";
import { editScheduleForIndividualCertifiedChallenge } from "../../../service/schedule";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import clsx from "clsx";
import dayjs from "dayjs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ErrorText from "../../common/ErrorText";
import TextInput from "../../common/Inputs/TextInput";
import GlobalToastController from "../../common/Toast/GlobalToastController";

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
      GlobalToastController.showModal({
        message: t("toast.edit_schedule_success"),
      });
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
            title={"Edit"}
            leftBtn={<CloseBtn fill={"black"} />}
            rightBtn={"Save"}
            onLeftBtnPress={onClose}
            onRightBtnPress={handleSubmit(onSubmit)}
            containerStyle={Platform.OS === "ios" ? "my-4" : "mt-0"}
          />
        </View>
        <View className="flex-1">
          <View className="flex flex-col p-4">
            <View className="h-64">
              <GestureHandlerRootView style={styles.container}>
                <RNDateTimePicker
                  value={selectedDate}
                  mode={"datetime"}
                  display="spinner"
                  textColor="black" // Fix text turning white when iOS is in dark mode
                  onChange={(_, value) => handleDatePicked(value as Date)}
                  style={{ height: "100%" }}
                  minimumDate={dayjs().startOf("day").toDate()}
                />
              </GestureHandlerRootView>
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
