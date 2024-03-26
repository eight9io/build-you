import { FC } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { View, SafeAreaView } from "react-native";
import { Route } from "@react-navigation/native";
import CloseBtn from "../../component/asset/close.svg";
import { useUserProfileStore } from "../../store/user-store";
import { AddScheduleLinkSchema } from "../../Validators/AddScheduleLink.validate";
import { serviceUpdateCalendlyLink } from "../../service/profile";
import GlobalToastController from "../../component/common/Toast/GlobalToastController";
import GlobalDialogController from "../../component/common/Dialog/GlobalDialog/GlobalDialogController";
import Header from "../../component/common/Header";
import TextInput from "../../component/common/Inputs/TextInput";
import ErrorText from "../../component/common/ErrorText";
import Button from "../../component/common/Buttons/Button";
import { useNav } from "../../hooks/useNav";
import { useScheduleStore } from "../../store/schedule-store";

interface IEditScheduleLinkScreenProps {
  route: Route<
    "EditScheduleLinkScreen",
    {
      link: string;
    }
  >;
}

interface IAddScheduleInput {
  link: string;
}

const EditScheduleLinkScreen: FC<IEditScheduleLinkScreenProps> = ({
  route: {
    params: { link },
  },
}) => {
  const { t } = useTranslation();
  const navigation = useNav();
  const { getUserProfile, setUserProfile } = useUserProfileStore();
  const currectUser = getUserProfile();
  const { setShouldRefreshIndividualCoachData } = useScheduleStore();

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
      // setCoachCalendyLink(data.link);
      setShouldRefreshIndividualCoachData(true);
      onClose();
      setTimeout(() => {
        GlobalToastController.showModal({
          message:
            t("toast.edit_calendy_link_success") ||
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
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-white">
      <View className="px-4">
        <Header
          title={
            t(
              "challenge_detail_screen_tab.coach_calendar.add_schedule_link_btn"
            ) as string
          }
          leftBtn={<CloseBtn fill={"black"} />}
          onLeftBtnPress={onClose}
          containerStyle="mt-3"
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

      <View className={"absolute bottom-[40px] h-12 w-full bg-white px-4"}>
        <Button
          title={t("save") || "Save"}
          onPress={handleSubmit(onSubmit)}
          containerClassName="bg-primary-default flex-1"
          textClassName="text-white"
        />
      </View>
    </View>
  );
};

export default EditScheduleLinkScreen;
