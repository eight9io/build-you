import { yupResolver } from "@hookform/resolvers/yup";
import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SafeAreaView, View } from "react-native";
import { Route } from "@react-navigation/native";

import { EditProgressValidationSchema } from "../../Validators/EditProgress.validate";
import { IProgressChallenge } from "../../types/challenge";
import { IUpdateProgress } from "../../types/progress";

import { updateProgress } from "../../service/progress";

import CloseIcon from "../../component/asset/close.svg";
import { getSeperateImageUrls } from "../../utils/image";
import GlobalToastController from "../../component/common/Toast/GlobalToastController";
import CustomActivityIndicator from "../../component/common/CustomActivityIndicator";
import Header from "../../component/common/Header";
import TextInput from "../../component/common/Inputs/TextInput";
import ErrorText from "../../component/common/ErrorText";
import ImageSwiper from "../../component/common/ImageSwiper";
import VideoPlayer from "../../component/common/VideoPlayer";
import { useNav } from "../../hooks/useNav";
import { useRefresh } from "../../context/refresh.context";

interface IEditChallengeProgressScreenProps {
  route: Route<
    "EditChallengeProgressScreen",
    {
      progress: IProgressChallenge;
    }
  >;
}

export const EditChallengeProgressScreen: FC<
  IEditChallengeProgressScreenProps
> = ({
  route: {
    params: { progress },
  },
}) => {
  const { t } = useTranslation();
  const navigation = useNav();
  const [isLoading, setIsLoading] = useState(false);
  const { setRefresh: refreshChallengeData } = useRefresh();
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
        refreshChallengeData(true);
        onClose();
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

  const onClose = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CustomActivityIndicator isVisible={isLoading} />

      <View className="mx-4 flex h-full flex-1 flex-col rounded-t-xl bg-white">
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
                placeholder={t("edit_progress_modal.caption_placeholder") || ""}
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
            <ImageSwiper
              imageSrc={getSeperateImageUrls(progress?.image) || ""}
            />
          </View>
        ) : progress.video ? (
          <View className="mt-5 aspect-square w-full">
            <VideoPlayer src={progress.video} />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};
export default EditChallengeProgressScreen;
