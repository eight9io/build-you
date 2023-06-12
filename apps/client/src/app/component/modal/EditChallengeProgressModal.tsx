import {
  View,
  Text,
  Modal,
  SafeAreaView,
  TextInput,
  Image,
  Dimensions,
  ScaledSize,
} from 'react-native';
import React, { FC, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';

import Header from '../common/Header';
import Button from '../common/Buttons/Button';
import ImageSwiper from '../common/ImageSwiper';
import CustomTextInput from '../common/Inputs/CustomTextInput';

import { IUploadMediaWithId } from '../../types/media';
import Loading from '../common/Loading';

interface IEditChallengeProgressModalProps {
  imageSrc?: string;
  isVisible: boolean;
  onClose: () => void;
}

export const EditChallengeProgressModal: FC<
  IEditChallengeProgressModalProps
> = ({ imageSrc, isVisible, onClose }) => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      caption: '',
    },
  });

  const onSubmit = (data: any) => console.log(data);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={isVisible}
      statusBarTranslucent={isLoading}
    >
      <SafeAreaView className=" bg-white">
        <View className="mx-4 flex h-full flex-col rounded-t-xl bg-white">
          <Header
            title={t('challenge_detail_screen.edit_progress') || ''}
            rightBtn="SAVE"
            leftBtn="Cancel"
            onLeftBtnPress={onClose}
          />

          <View className="flex flex-col justify-between pt-4">
            <CustomTextInput
              title="Caption"
              placeholderClassName="h-32"
              placeholder="What do you achieve?"
              control={control}
            />
          </View>
          {imageSrc && (
            <View className="mt-5 aspect-square w-full">
              <ImageSwiper imageSrc={imageSrc} />
            </View>
          )}
        </View>
      </SafeAreaView>
      {isLoading && <Loading containerClassName="absolute top-0 left-0" />}
    </Modal>
  );
};
export default EditChallengeProgressModal;
