import { yupResolver } from "@hookform/resolvers/yup";
import clsx from "clsx";
import dayjs from "dayjs";
import { FC, useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SafeAreaView, View } from "react-native";
import DateTimePicker from "react-native-ui-datepicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Route } from "@react-navigation/native";

import CloseBtn from "../../component/asset/close.svg";
import { IScheduledTime } from "../../types/schedule";
import { ICoachCreateScheduleForm } from "./CoachCreateScheduleScreen";
import { CoachCreateScheduleSchema } from "../../Validators/CoachCreateSchedule.validate";
import { useNav } from "../../hooks/useNav";
import { editScheduleForIndividualCertifiedChallenge } from "../../service/schedule";
import GlobalToastController from "../../component/common/Toast/GlobalToastController";
import CustomActivityIndicator from "../../component/common/CustomActivityIndicator";
import Header from "../../component/common/Header";
import ErrorText from "../../component/common/ErrorText";
import TextInput from "../../component/common/Inputs/TextInput";
import { useScheduleStore } from "../../store/schedule-store";

interface IEditScheduleScreenProps {
  route: Route<
    "EditChallengeProgressScreen",
    {
      schedule: IScheduledTime;
    }
  >;
}

const EditScheduleScreen: FC<IEditScheduleScreenProps> = ({
  route: {
    params: { schedule },
  },
}) => {
  const navigation = useNav();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setShouldRefreshScheduleData, setUpdatedScheduleData } =
    useScheduleStore();
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
    setError,
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
    // setIsVisible(false);
    reset();
    navigation.goBack();
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
      const timeWhenCreateSchedule = dayjs().format("YYYY-MM-DDTHH:mm:ss");
      if (dayjs(newDate).isBefore(timeWhenCreateSchedule)) {
        setError("date", {
          type: "manual",
          message: t("create_schedule_modal.error.old_date_time"),
        });
        return;
      }
      setIsLoading(true);
      const res = await editScheduleForIndividualCertifiedChallenge({
        scheduleId: schedule.id,
        schedule: newDate,
        meetingUrl: data.linkVideoCall,
        note: data.note,
      });
      if (res.data)
        GlobalToastController.showModal({
          message: t("toast.edit_schedule_success"),
        });
      setShouldRefreshScheduleData(true);
      setUpdatedScheduleData(res.data);
      onClose();
    } catch (error) {
      console.error("error", error);
      GlobalToastController.showModal({
        message: t("error_general_message"),
      });
      // setIsVisible(false);
      // setIsEditActionSuccess(false);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CustomActivityIndicator isVisible={isLoading} />
      <View className="px-4">
        <Header
          title={t("challenge_detail_screen_tab.coach_calendar.edit")}
          leftBtn={<CloseBtn fill={"black"} />}
          rightBtn={t("save")}
          onLeftBtnPress={onClose}
          onRightBtnPress={handleSubmit(onSubmit)}
          containerStyle="my-6"
        />
      </View>
      <KeyboardAwareScrollView className="flex-1">
        <View className="flex flex-col p-4">
          <View className="mb-4 px-12">
            <DateTimePicker
              mode="single"
              timePicker
              date={selectedDate}
              onChange={(params) => handleDatePicked(params.date as Date)}
              minDate={dayjs().startOf("day").toDate()}
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
          {errors.linkVideoCall ? (
            <ErrorText message={errors.linkVideoCall?.message} />
          ) : null}
        </View>
        <View className="flex flex-col p-4">
          <Controller
            control={control}
            name="note"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="flex flex-col">
                <TextInput
                  label={t("create_schedule_modal.note")}
                  placeholder={t("create_schedule_modal.note_placeholder")}
                  placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  multiline={true}
                  className={clsx(
                    "h-32 "
                    // errors.linkVideoCall && "border-1 border-red-500"
                  )}
                />
              </View>
            )}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default EditScheduleScreen;
