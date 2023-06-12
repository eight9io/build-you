import {
  View,
  Text,
  Modal,
  SafeAreaView,
  Image,
  Dimensions,
  ScaledSize,
  Platform,
} from 'react-native';
import React, { FC, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import CloseIcon from '../asset/close.svg';

import { yupResolver } from '@hookform/resolvers/yup';

import { useUserProfileStore } from '../../store/user-data';

import { IUploadMediaWithId } from '../../types/media';

import { getRandomId } from '../../utils/common';
import { CreateProgressValidationSchema } from '../../Validators/CreateProgress.validate';

import Header from '../common/Header';
import Button from '../common/Buttons/Button';
import ImagePicker from '../common/ImagePicker';
import VideoPicker from '../common/VideoPicker';
import LocationInput from '../common/Inputs/LocationInput';
import CustomTextInput from '../common/Inputs/CustomTextInput';

import Close from '../../component/asset/close.svg';
import httpInstance from '../../utils/http';
import {
  createProgress,
  updateProgressImage,
  updateProgressVideo,
} from '../../service/progress';
import { getImageExtension } from '../../utils/uploadUserImage';
import { AxiosResponse } from 'axios';
import ConfirmDialog from '../common/Dialog/ConfirmDialog';
import Loading from '../common/Loading';

interface IAddNewChallengeProgressModalProps {
  challengeId: string;
  isVisible: boolean;
  onClose: () => void;
}

interface IRenderSelectedMediaProps {
  screen: ScaledSize;
  selectedMedia: IUploadMediaWithId[];
  setSelectedMedia: (prev: IUploadMediaWithId[]) => void;
}

const RenderSelectedMedia: FC<IRenderSelectedMediaProps> = ({
  screen,
  selectedMedia,
  setSelectedMedia,
}) => {
  const handleRemoveItem = (id: string) => {
    const filteredMedia = selectedMedia.filter((media) => media.id !== id);
    setSelectedMedia(filteredMedia);
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
                Icon={<Close fill={'white'} />}
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
> = ({ challengeId, isVisible, onClose }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedMedia, setSelectedMedia] = useState<IUploadMediaWithId[]>([]);
  const [isSelectedImage, setIsSelectedImage] = useState<boolean | null>(null);
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [isRequestSuccess, setIsRequestSuccess] = useState<boolean | null>(
    null
  );

  const { getUserProfile } = useUserProfileStore();
  const userProfile = getUserProfile();

  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      challenge: '',
      caption: '',
      location: '',
    },
    resolver: yupResolver(CreateProgressValidationSchema()),
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    if (selectedMedia.length === 0) {
      setIsSelectedImage(null);
    }
  }, [selectedMedia]);

  const onSubmit = async (data: any) => {
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
      createProgressResponse.status === 200 ||
      (201 && selectedMedia.length > 0)
    ) {
      const progressId = createProgressResponse.data.id;
      if (isSelectedImage) {
        const addImageProgressResponse = (await updateProgressImage(
          progressId,
          selectedMedia
        )) as AxiosResponse;
        if (addImageProgressResponse.status === 200 || 201) {
          setIsRequestSuccess(true);
          setIsShowModal(true);
        } else {
          setIsRequestSuccess(false);
          setIsShowModal(true);
        }
      } else {
        const addVideoProgressResponse = (await updateProgressVideo(
          progressId,
          selectedMedia[0]
        )) as AxiosResponse;
        if (addVideoProgressResponse.status === 200 || 201) {
          setIsRequestSuccess(true);
          setIsShowModal(true);
        } else {
          setIsRequestSuccess(false);
          setIsShowModal(true);
        }
      }
    } else {
      setIsRequestSuccess(false);
      setIsShowModal(true);
    }
    setIsLoading(false);
  };
  // TODO: handle change CREATE text color when input is entered

  const screen = Dimensions.get('window');

  const handleCloseModal = () => {
    setIsShowModal(false);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={isVisible}
      className="h-full"
    >
      <SafeAreaView className="relative bg-white">
        {isLoading && (
          <Loading containerClassName="absolute top-0 left-0 z-10" />
        )}
        <ConfirmDialog
          title={isRequestSuccess ? 'Success' : 'Error'}
          description={
            isRequestSuccess
              ? 'Your progress has been created successfully'
              : 'Something went wrong. Please try again later.'
          }
          isVisible={isShowModal}
          onClosed={handleCloseModal}
          closeButtonLabel="Got it"
        />
        <View className="mx-4  h-full rounded-t-xl bg-white">
          <Header
            title={t('challenge_detail_screen.new_progress') as string}
            rightBtn={t('challenge_detail_screen.new_progress_post') as string}
            leftBtn="Cancel"
            onLeftBtnPress={onClose}
            onRightBtnPress={handleSubmit(onSubmit)}
            containerStyle={Platform.OS === 'ios' ? 'mt-5' : 'mt-0'}
          />

          <View className="flex flex-col justify-between px-5 pt-4">
            <CustomTextInput
              title="Caption"
              placeholderClassName="h-32"
              placeholder="What do you achieve?"
              control={control}
              errors={errors.caption}
            />

            {selectedMedia && (
              <RenderSelectedMedia
                screen={screen}
                selectedMedia={selectedMedia}
                setSelectedMedia={setSelectedMedia}
              />
            )}

            <View className="">
              <ImagePicker
                onImagesSelected={(images) => {
                  images.forEach((uri: string) => {
                    const id = getRandomId();
                    console.log('id', id);
                    setSelectedMedia((prev: IUploadMediaWithId[]) => [
                      ...prev,
                      { id, uri: uri },
                    ]);
                  });
                }}
                allowsMultipleSelection
                isSelectedImage={isSelectedImage}
                setIsSelectedImage={setIsSelectedImage}
              />
            </View>

            <View className="flex flex-col">
              <VideoPicker
                setExternalVideo={setSelectedMedia}
                isSelectedImage={isSelectedImage}
                setIsSelectedImage={setIsSelectedImage}
              />
            </View>

            <View className="flex flex-col pt-4">
              <LocationInput control={control} errors={errors.location} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
export default AddNewChallengeProgressModal;
