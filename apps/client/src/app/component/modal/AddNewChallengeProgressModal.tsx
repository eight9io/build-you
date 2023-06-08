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
import { useForm } from 'react-hook-form';
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
import { createProgress, updateProgressImage } from '../../service/progress';
import { getImageExtension } from '../../utils/uploadUserImage';
import { AxiosResponse } from 'axios';

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
  const [selectedMedia, setSelectedMedia] = useState<IUploadMediaWithId[]>([]);
  const [isSelectedImage, setIsSelectedImage] = useState<boolean | null>(null);

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
    //TODO: handle error
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
      const extension = getImageExtension(selectedMedia[0].uri);
      const imageData = new FormData();
      imageData.append('file', {
        uri: selectedMedia[0].uri,
        name: `${selectedMedia[0].id}.${extension}`,
        type: `image/${extension}`,
      } as any);
      const addImageProgressResponse = (await updateProgressImage(
        progressId,
        imageData
      )) as AxiosResponse;

      if (addImageProgressResponse.status === 200 || 201) {
        onClose();
      } else {
        //TODO: show error modal
      }
    } else {
      //TODO: show create progress error modal
    }
  };
  // TODO: handle change CREATE text color when input is entered

  const screen = Dimensions.get('window');
  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={isVisible}
      className="h-full"
    >
      <SafeAreaView className="bg-white">
        <View className="h-full rounded-t-xl bg-white">
          <Header
            title="New Progress"
            rightBtn="CREATE"
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
