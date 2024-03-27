import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { View, SafeAreaView } from "react-native";

import CloseBtn from "../../component/asset/close.svg";
import { useUserProfileStore } from "../../store/user-store";
import { AddScheduleLinkSchema } from "../../Validators/AddScheduleLink.validate";
import { serviceUpdateCalendlyLink } from "../../service/profile";
import GlobalToastController from "../../component/common/Toast/GlobalToastController";
import GlobalDialogController from "../../component/common/Dialog/GlobalDialog/GlobalDialogController";
import { useNav } from "../../hooks/useNav";
import Header from "../../component/common/Header";
import TextInput from "../../component/common/Inputs/TextInput";
import Button from "../../component/common/Buttons/Button";
import ErrorText from "../../component/common/ErrorText";
import { useScheduleStore } from "../../store/schedule-store";

interface IAddScheduleInput {
  link: string;
}

const AddScheduleLinkScreen = () => {
  const navigation = useNav();
  const { t } = useTranslation();
  const { getUserProfile, setUserProfile } = useUserProfileStore();
  const { setShouldRefreshIndividualCoachData } = useScheduleStore();
  const currectUser = getUserProfile();

  const {
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<IAddScheduleInput>({
    defaultValues: {
      link: "",
    },
    resolver: yupResolver(AddScheduleLinkSchema()),
  });

  const onSubmit = async (data: IAddScheduleInput) => {
    try {
      const res = await serviceUpdateCalendlyLink({
        userId: currectUser?.id,
        calendlyLink: data.link,
      });
      if (res.data) {
        setUserProfile({ ...currectUser, calendly: data.link });
        // setCoachCalendyLink(data.link);
        setShouldRefreshIndividualCoachData(true);
        onClose();
        setTimeout(() => {
          GlobalToastController.showModal({
            message:
              t("toast.add_calendy_link_success") ||
              "Your progress has been created successfully!",
          });
        }, 500);
      } else
        throw new Error("Failed to update calendly link => empty response");
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
    // setIsVisible(false);
    navigation.goBack();
  };

  return (
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
          containerStyle="my-4"
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
        {errors.link ? <ErrorText message={errors.link?.message} /> : null}
      </View>

      <View className="absolute bottom-[40px] h-12 w-full bg-white px-4">
        <Button
          title={t("save") || "Save"}
          onPress={handleSubmit(onSubmit)}
          containerClassName="bg-primary-default flex-1"
          textClassName="text-white"
        />
      </View>
    </SafeAreaView>
  );
};

export default AddScheduleLinkScreen;
