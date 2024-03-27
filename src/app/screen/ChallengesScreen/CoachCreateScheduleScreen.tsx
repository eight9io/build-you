import { yupResolver } from "@hookform/resolvers/yup";
import clsx from "clsx";
import dayjs from "dayjs";
import { FC, useEffect, useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SafeAreaView, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Route } from "@react-navigation/native";
import DateTimePicker from "react-native-ui-datepicker";

import CloseBtn from "../../component/asset/close.svg";
import { CoachCreateScheduleSchema } from "../../Validators/CoachCreateSchedule.validate";
import { createScheduleForIndividualCertifiedChallenge } from "../../service/schedule";
import GlobalToastController from "../../component/common/Toast/GlobalToastController";
import CustomActivityIndicator from "../../component/common/CustomActivityIndicator";
import Header from "../../component/common/Header";
import ErrorText from "../../component/common/ErrorText";
import TextInput from "../../component/common/Inputs/TextInput";
import { useNav } from "../../hooks/useNav";
import { useScheduleStore } from "../../store/schedule-store";

interface ICoachCreateScheduleScreenProps {
  route: Route<
    "CoachCreateScheduleScreen",
    {
      challengeId: string;
    }
  >;
}

export interface ICoachCreateScheduleForm {
  linkVideoCall: string;
  note: string;
  date: Date;
}

const CoachCreateScheduleScreen: FC<ICoachCreateScheduleScreenProps> = ({
  route: {
    params: { challengeId },
  },
}) => {
  const navigation = useNav();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setShouldRefreshScheduleData } = useScheduleStore();

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

  useEffect(() => {
    // Set default value for date
    setValue("date", selectedDate);
  }, []);

  const handleDatePicked = (date?: any) => {
    if (date) {
      setValue("date", date, {
        shouldValidate: true,
      });
    }
    setSelectedDate(date);
  };

  const onCloseModal = () => {
    // setIsVisible(false);
    navigation.goBack();
    reset();
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
      setIsLoading(true);
      await createScheduleForIndividualCertifiedChallenge({
        challengeId: challengeId,
        schedule: date,
        meetingUrl: data.linkVideoCall,
        note: data.note,
      }).then(() => {
        // setIsVisible(false);
        setShouldRefreshScheduleData(true);
        GlobalToastController.showModal({
          message: t("toast.create_schedule_success"),
        });
        onCloseModal();
        // setShouldParentRefresh(true);
      });
    } catch (error) {
      console.error("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CustomActivityIndicator isVisible={isLoading} />
      <View className="px-4">
        <Header
          title={t("create_schedule_modal.title") as string}
          leftBtn={<CloseBtn fill={"black"} />}
          rightBtn={t("save") as string}
          onLeftBtnPress={onCloseModal}
          onRightBtnPress={handleSubmit(onSubmit)}
          containerStyle="my-4"
        />
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={{
          flex: 1,
        }}
      >
        <View className="flex flex-col p-4">
          <View className="mb-4 px-12">
            <DateTimePicker
              mode="single"
              timePicker
              date={selectedDate}
              onChange={(params) => handleDatePicked(params.date as Date)}
              minDate={new Date(currentDatetime)}
            />
          </View>
          {errors.date ? <ErrorText message={errors.date.message} /> : null}
        </View>

        <View className="px-4">
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

export default CoachCreateScheduleScreen;
