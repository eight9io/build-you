import { View, Modal, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { Controller, set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Route } from "@react-navigation/native";
import clsx from "clsx";

import { IProposingScheduleTime } from "../../types/schedule";

import { ConfirmVideoCallUrlValidationSchema } from "../../Validators/validators";
import { confirmProposalByCoach } from "../../service/schedule";
import GlobalToastController from "../../component/common/Toast/GlobalToastController";
import Header from "../../component/common/Header";
import NavButton from "../../component/common/Buttons/NavButton";
import TextInput from "../../component/common/Inputs/TextInput";
import ErrorText from "../../component/common/ErrorText";
import { useNav } from "../../hooks/useNav";
import { useErrorModal } from "../../hooks/useErrorModal";
import { useRefresh } from "../../context/refresh.context";

interface IConfirmVideoCoachScreenProps {
  route: Route<
    "ConfirmVideoCoachScreen",
    {
      selectedOption: IProposingScheduleTime;
    }
  >;
}

export default function ConfirmVideoCoachScreen({
  route: {
    params: { selectedOption },
  },
}: IConfirmVideoCoachScreenProps) {
  const { t } = useTranslation();
  const navigation = useNav();
  const { setRefresh: refreshScheduleData } = useRefresh();
  const [selectedDatetime, setSelectedDatetime] = useState<Date | null>(null);
  const { openErrorModal } = useErrorModal();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    setError,
    formState: { errors },
  } = useForm<{
    url: string;
    note: string;
  }>({
    defaultValues: {
      url: "",
      note: "",
    },
    resolver: yupResolver(ConfirmVideoCallUrlValidationSchema()),
    reValidateMode: "onChange",
  });

  const handleSubmitConfirmedProposedTime = async () => {
    try {
      const res = await confirmProposalByCoach({
        scheduleId: selectedOption.id,
        meetingUrl: getValues("url"),
        note: getValues("note"),
      });
      if (res.status === 201) {
        // setConfirmedOption({
        //   ...selectedOption,
        //   metingUrl: getValues("url"),
        //   note: getValues("note"),
        // });
        refreshScheduleData(true);
        GlobalToastController.showModal({
          message: t("toast.proposing_time_success") as string,
        });
        onClose();
      }
    } catch (error) {
      if (error.response.data.statusCode == 403) {
        openErrorModal({
          title: t("error"),
          description: t("dialog.proposing_time.error_description"),
        });
      } else {
        openErrorModal({
          title: t("error"),
          description: t("error_general_message"),
        });
      }
    }
  };

  useEffect(() => {
    // seselectedOption.proposal in format 2023-10-28T00:00:00.000Z
    if (!selectedOption) return;
    setSelectedDatetime(new Date(selectedOption.proposal));
    setValue("url", selectedOption.metingUrl);
    setValue("note", selectedOption.note);
  }, [selectedOption]);

  const onClose = () => {
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-white px-3 pt-1">
      <Header
        title={t("confirm_time_modal.title")}
        leftBtn={
          <NavButton
            text={t("button.back") as string}
            onPress={onClose}
            withBackIcon
          />
        }
        // rightBtn={
        //   <NavButton
        //     text={t("confirm_time_modal.confirm") as string}
        //     onPress={handleSubmit(handleSubmitConfirmedProposedTime)}
        //     textClassName="text-primary-default uppercase"
        //   />
        // }
        rightBtn={t("confirm_time_modal.confirm")}
        onRightBtnPress={handleSubmit(handleSubmitConfirmedProposedTime)}
        containerStyle="mb-4"
      />
      <View className="flex flex-col p-2">
        <View className="flex flex-col">
          <Text className="text-md font-semibold text-primary-default">
            {t("confirm_time_modal.option")}
          </Text>
          <Text className="font-['Open Sans'] py-2 text-xl font-semibold leading-7 text-zinc-800">
            {selectedDatetime?.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <Text className="font-['Open Sans'] w-52 text-base font-semibold leading-tight text-zinc-800">
            {selectedDatetime?.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>

        <View className=" pt-8">
          <Controller
            control={control}
            name={"url"}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="flex flex-col gap-1">
                <TextInput
                  label={t("confirm_time_modal.link_video_call")}
                  placeholder={t(
                    "confirm_time_modal.link_video_call_placeholder"
                  )}
                  placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </View>
            )}
          />
          {errors.url ? <ErrorText message={errors.url?.message} /> : null}
        </View>
        <View className="pt-4">
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
                  className={clsx("h-32 ")}
                />
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
}
