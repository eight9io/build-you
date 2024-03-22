import { yupResolver } from "@hookform/resolvers/yup";
import { Image } from "expo-image";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  ScaledSize,
  Text,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ResizeMode, Video } from "expo-av";
import { Route } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useUserProfileStore } from "../../store/user-store";
import { IUploadMediaWithId } from "../../types/media";
import { getRandomId } from "../../utils/common";
import { CreateProgressValidationSchema } from "../../Validators/CreateProgress.validate";

import Close from "../../component/asset/close.svg";
import {
  createProgress,
  deleteProgress,
  updateProgressImage,
  updateProgressVideo,
} from "../../service/progress";
import { getBase64FileMimeType, isValidBase64 } from "../../utils/image";
import ErrorText from "../../component/common/ErrorText";
import Button from "../../component/common/Buttons/Button";
import GlobalToastController from "../../component/common/Toast/GlobalToastController";
import CustomActivityIndicator from "../../component/common/CustomActivityIndicator";
import ConfirmDialog from "../../component/common/Dialog/ConfirmDialog/ConfirmDialog";
import Header from "../../component/common/Header";
import CustomTextInput from "../../component/common/Inputs/CustomTextInput";
import ImagePicker from "../../component/common/ImagePicker";
import VideoPicker from "../../component/common/VideoPicker";
import LocationInput from "../../component/common/Inputs/LocationInput";
import { useNav } from "../../hooks/useNav";

interface IAddNewChallengeProgressScreenProps {
  route: Route<
    "AddNewChallengeProgressScreen",
    {
      challengeId: string;
      refetchProgresses?: () => void;
    }
  >;
}

interface IRenderSelectedMediaProps {
  screen: ScaledSize;
  selectedMedia: IUploadMediaWithId[];
  setSelectedMedia: (prev: IUploadMediaWithId[]) => void;
  onRemoveItem?: (medias: IUploadMediaWithId[]) => void;
}

const RenderSelectedMedia: FC<IRenderSelectedMediaProps> = ({
  screen,
  selectedMedia,
  setSelectedMedia,
  onRemoveItem,
}) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const handleRemoveItem = (id: string) => {
    const filteredMedia = selectedMedia.filter((media) => media.id !== id);
    setSelectedMedia(filteredMedia);
    onRemoveItem && onRemoveItem(filteredMedia);
  };

  // px-5 + gap-2 + gap-2 = 56
  const singleImageWidth = (screen.width - 56) / 3;

  useEffect(() => {
    // Check if selectedMedia contains invalid base64
    if (selectedMedia.length > 0) {
      const validMedia = selectedMedia.filter((media) =>
        isValidBase64(media.uri)
      );
      if (validMedia.length < selectedMedia.length)
        setError(t("error_general_message"));
      else setError(null);
    } else setError(null);
  }, [selectedMedia]);

  if (error) return <ErrorText message={error} />;

  return (
    <View className="flex flex-row flex-wrap justify-start gap-2 pt-5">
      {selectedMedia?.length > 0
        ? selectedMedia.map((media) => {
            // getBase64FileMimeType return value are expected to be "image/*" or "video/*"
            const mediaType = getBase64FileMimeType(media.uri).split("/")[0];
            const isVideo = mediaType === "video";
            return (
              <View
                className="relative aspect-square md:max-h-[150px] md:max-w-[150px]"
                style={{ width: singleImageWidth }}
                key={media.id}
              >
                <View className="absolute right-1 top-2 z-10">
                  <Button
                    onPress={() => handleRemoveItem(media.id)}
                    Icon={<Close fill={"white"} />}
                  />
                </View>
                {isVideo ? (
                  <Video
                    source={{ uri: media.uri }}
                    className={"aspect-square h-full w-full rounded-xl"}
                    resizeMode={ResizeMode.COVER}
                  />
                ) : (
                  <Image
                    source={{ uri: media.uri as any }}
                    className="h-full w-full rounded-xl"
                  />
                )}
              </View>
            );
          })
        : null}
    </View>
  );
};

export const AddNewChallengeProgressScreen: FC<
  IAddNewChallengeProgressScreenProps
> = ({ route }) => {
  const navigation = useNav();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedMedia, setSelectedMedia] = useState<IUploadMediaWithId[]>([]);
  const [isSelectedImage, setIsSelectedImage] = useState<boolean | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<IUploadMediaWithId[]>([]);
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [isRequestSuccess, setIsRequestSuccess] = useState<boolean | null>(
    null
  );
  const [shouldDisableAddImage, setShouldDisableAddImage] =
    useState<boolean>(false);
  const [isImageOrVideoLoading, setIsImageOrVideoLoading] =
    useState<boolean>(false);

  const { getUserProfile } = useUserProfileStore();
  const userProfile = getUserProfile();

  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<{
    challenge: string;
    location: string;
    caption: string;
    media: any;
  }>({
    defaultValues: {
      challenge: "",
      location: "",
      caption: "",
      media: undefined,
    },
    resolver: yupResolver(CreateProgressValidationSchema()),
    reValidateMode: "onChange",
  });
  const { challengeId, refetchProgresses } = route.params;

  useEffect(() => {
    if (selectedMedia.length === 0) {
      setIsSelectedImage(null);
      setShouldDisableAddImage(false);
      return;
    } else if (selectedMedia.length >= 3) {
      setShouldDisableAddImage(true);
    } else if (selectedMedia.length < 3) {
      setShouldDisableAddImage(false);
    }
  }, [selectedMedia]);

  const onSubmit = async (data: any) => {
    if (isImageOrVideoLoading) return;
    try {
      setIsLoading(true);
      if (!userProfile || !userProfile.id) return;
      const payload = {
        user: userProfile.id,
        challenge: challengeId,
        caption: data.caption,
        location: data.location,
      };

      const createProgressResponse = await createProgress(payload);

      if (
        (createProgressResponse.status === 200 || 201) &&
        selectedMedia.length > 0
      ) {
        const progressId = createProgressResponse.data.id;
        if (isSelectedImage) {
          await updateProgressImage(progressId, selectedMedia)
            .then((res) => {
              if (res.status === 200 || 201) {
                handleCloseConfirmModal();
                GlobalToastController.showModal({
                  message:
                    t("toast.create_progress_success") ||
                    "Your progress has been created successfully!",
                });
              }
            })
            .catch((_) => {
              setIsRequestSuccess(false);
              setIsShowModal(true);
              deleteProgress(progressId);
            });
        } else {
          await updateProgressVideo(progressId, selectedVideo[0])
            .then((res) => {
              if (res.status === 200 || 201) {
                handleCloseConfirmModal();
                GlobalToastController.showModal({
                  message:
                    t("toast.create_progress_success") ||
                    "Your progress has been created successfully!",
                });
              }
            })
            .catch((_) => {
              setIsRequestSuccess(false);
              setIsShowModal(true);
              deleteProgress(progressId);
            });
        }
        setIsLoading(false);

        return;
      }
    } catch (error) {
      setIsRequestSuccess(false);
      setIsShowModal(true);
      setIsLoading(false);
    }
  };

  const screen = Dimensions.get("window");

  const onClose = () => {
    navigation.goBack();
  };

  const handleCloseConfirmModal = () => {
    setIsShowModal(false);
    onClose();
    // setProgressLoading(true);
    refetchProgresses && refetchProgresses();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CustomActivityIndicator isVisible={isLoading} />
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flex: 1,
        }}
      >
        <ConfirmDialog
          title={
            isRequestSuccess
              ? t("dialog.success_title") || "Success"
              : t("dialog.err_title") || "Error"
          }
          description={
            isRequestSuccess
              ? t("dialog.create_progress_success") ||
                "Your progress has been created successfully !"
              : t("error_general_message") ||
                "Something went wrong. Please try again later!"
          }
          isVisible={isShowModal}
          onClosed={handleCloseConfirmModal}
          closeButtonLabel={t("dialog.got_it") || "Got it"}
        />
        <View className="mx-4  h-full rounded-t-xl">
          <Header
            title={t("challenge_detail_screen.new_progress") as string}
            rightBtn={t("challenge_detail_screen.new_progress_post") as string}
            leftBtn={t("add_new_challenge_progress_modal.cancel") || "Cancel"}
            onLeftBtnPress={onClose}
            onRightBtnPress={handleSubmit(onSubmit)}
          />

          <View className="flex flex-col justify-between pt-4">
            <CustomTextInput
              title={t("add_new_challenge_progress_modal.caption") || "Caption"}
              field="caption"
              placeholderClassName="h-32"
              placeholder={
                t("add_new_challenge_progress_modal.caption_placeholder") ||
                "What do you achieve?"
              }
              control={control}
              errors={errors.caption}
            />

            {selectedMedia ? (
              <RenderSelectedMedia
                screen={screen}
                selectedMedia={selectedMedia}
                setSelectedMedia={setSelectedMedia}
                onRemoveItem={(medias) => {
                  if (!medias.length) {
                    setError("media", {
                      message:
                        t("please_upload_images_or_video") ||
                        "Please upload images or video",
                      type: "required",
                    });
                  }
                }}
              />
            ) : null}

            <View>
              {isImageOrVideoLoading ? (
                <ActivityIndicator size="large" color="#C5C8D2" />
              ) : null}
              <View className="">
                <ImagePicker
                  onImagesSelected={(images) => {
                    setSelectedMedia((prev: IUploadMediaWithId[]) => {
                      const imagesSelected: IUploadMediaWithId[] = images.map(
                        (uri) => {
                          const id = getRandomId();
                          setValue("media", uri, { shouldValidate: true });
                          return {
                            id,
                            uri: uri,
                          };
                        }
                      );

                      if (prev.length + imagesSelected.length > 3) {
                        return prev;
                      }
                      return [...prev, ...imagesSelected];
                    });
                  }}
                  allowsMultipleSelection
                  isSelectedImage={isSelectedImage}
                  setIsSelectedImage={setIsSelectedImage}
                  isDisabled={shouldDisableAddImage}
                  setLoading={setIsImageOrVideoLoading}
                />
              </View>

              <View className="flex flex-col">
                <VideoPicker
                  setExternalVideo={(video) => {
                    setSelectedMedia(video);
                    setValue("media", video, { shouldValidate: true });
                  }}
                  setSelectedVideo={setSelectedVideo}
                  isSelectedImage={isSelectedImage}
                  setIsSelectedImage={setIsSelectedImage}
                  setLoading={setIsImageOrVideoLoading}
                />
              </View>
              {!isImageOrVideoLoading && errors?.media ? (
                <ErrorText message={errors.media.message} />
              ) : null}
              {isImageOrVideoLoading && errors?.media ? (
                <Text className="pt-2 text-sm text-red-500">
                  <Ionicons
                    name="alert-circle-outline"
                    size={14}
                    color="#FF4949"
                  />
                  {t("image_picker.upload_a_video_waiting") as string}
                </Text>
              ) : null}
            </View>

            <View className="flex flex-col pt-4">
              <LocationInput
                control={control}
                errors={errors.location}
                setFormValue={setValue}
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};
export default AddNewChallengeProgressScreen;
