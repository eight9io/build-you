import {
  View,
  Text,
  Modal,
  SafeAreaView,
  Dimensions,
  ScaledSize,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import React, { FC, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Spinner from "react-native-loading-spinner-overlay";

import { useUserProfileStore } from "../../store/user-store";
import { IUploadMediaWithId } from "../../types/media";
import { getRandomId } from "../../utils/common";
import { CreateProgressValidationSchema } from "../../Validators/CreateProgress.validate";

import Header from "../common/Header";
import Button from "../common/Buttons/Button";
import ImagePicker from "../common/ImagePicker";
import VideoPicker from "../common/VideoPicker";
import LocationInput from "../common/Inputs/LocationInput";
import CustomTextInput from "../common/Inputs/CustomTextInput";
import Close from "../../component/asset/close.svg";
import {
  createProgress,
  deleteProgress,
  updateProgressImage,
  updateProgressVideo,
} from "../../service/progress";
import ConfirmDialog from "../common/Dialog/ConfirmDialog";
import ErrorText from "../common/ErrorText";
import GlobalToastController from "../common/Toast/GlobalToastController";
import Ionicons from "@expo/vector-icons/Ionicons";

interface IAddNewChallengeProgressModalProps {
  challengeId: string;
  isVisible: boolean;
  onClose: () => void;
  refetch: React.Dispatch<React.SetStateAction<boolean>>;
  setProgressLoading: React.Dispatch<React.SetStateAction<boolean>>;
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
  const handleRemoveItem = (id: string) => {
    const filteredMedia = selectedMedia.filter((media) => media.id !== id);
    setSelectedMedia(filteredMedia);
    onRemoveItem && onRemoveItem(filteredMedia);
  };

  // px-5 + gap-2 + gap-2 = 56
  const singleImageWidth = (screen.width - 56) / 3;

  return (
    <View className="flex flex-row flex-wrap justify-start gap-2 pt-5">
      {selectedMedia?.length > 0 &&
        selectedMedia.map((media: any) => (
          <View
            className="relative aspect-square"
            style={{ width: singleImageWidth }}
            key={media.id}
          >
            <View className="absolute right-1 top-2 z-10">
              <Button
                onPress={() => handleRemoveItem(media.id)}
                Icon={<Close fill={"white"} />}
              />
            </View>
            <Image
              source={{ uri: media.uri as any }}
              className="h-full w-full rounded-xl"
            />
          </View>
        ))}
    </View>
  );
};

export const AddNewChallengeProgressModal: FC<
  IAddNewChallengeProgressModalProps
> = ({ setProgressLoading, refetch, challengeId, isVisible, onClose }) => {
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
                handleCloseModal();
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
                handleCloseModal();
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

  const handleCloseModal = () => {
    setIsShowModal(false);
    onClose();
    setProgressLoading(true);
    refetch(true);
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={isVisible}
      className="h-full"
    >
      <SafeAreaView className="flex-1 bg-white">
        {isLoading && <Spinner visible={isLoading} />}
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
            onClosed={handleCloseModal}
            closeButtonLabel={t("dialog.got_it") || "Got it"}
          />
          <View className="mx-4  h-full rounded-t-xl">
            <Header
              title={t("challenge_detail_screen.new_progress") as string}
              rightBtn={
                t("challenge_detail_screen.new_progress_post") as string
              }
              leftBtn={t("add_new_challenge_progress_modal.cancel") || "Cancel"}
              onLeftBtnPress={onClose}
              onRightBtnPress={handleSubmit(onSubmit)}
              containerStyle={Platform.OS === "ios" ? "mt-5" : "mt-0"}
            />

            <View className="flex flex-col justify-between pt-4">
              <CustomTextInput
                title={
                  t("add_new_challenge_progress_modal.caption") || "Caption"
                }
                field="caption"
                placeholderClassName="h-32"
                placeholder={
                  t("add_new_challenge_progress_modal.caption_placeholder") ||
                  "What do you achieve?"
                }
                control={control}
                errors={errors.caption}
              />

              {selectedMedia && (
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
              )}

              <View>
                {isImageOrVideoLoading && (
                  <ActivityIndicator size="large" color="#C5C8D2" />
                )}
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
                {!isImageOrVideoLoading && errors?.media && (
                  <ErrorText message={errors.media.message} />
                )}
                {isImageOrVideoLoading && errors?.media && (
                  <Text className="pt-2 text-sm text-red-500">
                    <Ionicons
                      name="alert-circle-outline"
                      size={14}
                      color="#FF4949"
                    />
                    {t("image_picker.upload_a_video_waiting") as string}
                  </Text>
                )}
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
    </Modal>
  );
};
export default AddNewChallengeProgressModal;
