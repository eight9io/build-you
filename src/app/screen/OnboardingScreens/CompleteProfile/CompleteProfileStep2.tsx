import React, { FC, useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";

import { useForm, Controller } from "react-hook-form";

import { useCompleteProfileStore } from "../../../store/complete-user-profile";
import { uploadNewVideo } from "../../../utils/uploadVideo";

import StepOfSteps from "../../../component/common/StepofSteps";
import TextInput from "../../../component/common/Inputs/TextInput";
import Button from "../../../component/common/Buttons/Button";
import VideoPicker from "../../../component/common/VideoPicker";

import { CompleteProfileScreenNavigationProp } from "./CompleteProfile";
import { IUploadMediaWithId } from "../../../types/media";
import { useTranslation } from "react-i18next";

interface CompleteProfileStep2Props {
  navigation: CompleteProfileScreenNavigationProp;
}

const CompleteProfileStep2: FC<CompleteProfileStep2Props> = ({
  navigation,
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(false);
  const { t } = useTranslation();
  const [pickedVideo, setPickedVideo] = useState<IUploadMediaWithId[]>([]);

  const { setBiography, setVideo } = useCompleteProfileStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    biography: string;
    video: string;
  }>({
    defaultValues: {
      biography: "",
      video: "",
    },
  });

  useEffect(() => {
    if (!loading) {
      setLoadingError(false);
    }
  }, [loading]);

  const handleSubmitForm = (data: any) => {
    if (loading) {
      setLoadingError(true);
      return;
    }
    setBiography(data.biography);
    if (pickedVideo[0]?.uri) {
      setVideo(pickedVideo[0]?.uri);
    }
    navigation.navigate("CompleteProfileStep3Screen");
  };

  const removeVideo = () => {
    uploadNewVideo("");
    setPickedVideo([]);
  };

  return (
    <View
      className="flex h-full w-full flex-col items-center justify-start"
      testID="complete_profile_step_2"
    >
      <ScrollView className="w-full ">
        <View className="pt-2">
          <StepOfSteps step={2} totalSteps={4} />
        </View>
        <View className="flex flex-col items-center justify-center  pt-6">
          <View className="flex w-64 ">
            <Text className="text-center text-h4 font-semibold leading-6 text-black-default">
              {t("form_onboarding.screen_2.title") ||
                "Tell the others something about you"}
            </Text>
          </View>
        </View>

        {/* Form */}
        <View className="mt-4 flex w-full flex-col px-5">
          <View className="mt-4 flex flex-col ">
            <Controller
              control={control}
              name="biography"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="flex flex-col">
                  <TextInput
                    label={
                      t("form_onboarding.screen_2.biography") || "Biography"
                    }
                    placeholder={
                      t("form_onboarding.screen_2.your_biography") ||
                      "Your biography"
                    }
                    placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    multiline={true}
                    className="h-40 "
                  />
                </View>
              )}
            />
          </View>
          <View className="mt-10">
            <VideoPicker
              loading={loading}
              useBigImage={true}
              setLoading={setLoading}
              removeVideo={removeVideo}
              setExternalVideo={setPickedVideo}
            />
            {loadingError && (
              <Text className="pt-2 text-sm text-red-500">
                {t("image_picker.upload_a_video_waiting") as string}
              </Text>
            )}
          </View>

          <Button
            title={t("button.next") || "Next"}
            containerClassName="h-12 w-full bg-primary-default my-5 flex-none"
            textClassName="text-white text-md leading-6"
            onPress={handleSubmit(handleSubmitForm)}
            testID="complete_profile_step_2_next_button"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default CompleteProfileStep2;
