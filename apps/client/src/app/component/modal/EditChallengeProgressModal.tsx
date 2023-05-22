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

  return (
    <Modal
      animationType='slide'
      presentationStyle='pageSheet'
      visible={isVisible}
    >
      <SafeAreaView className='bg-white mx-4'>
        <View className='mt-6 flex h-full flex-col rounded-t-xl bg-white'>
          <Header
            title='New challenge'
            rightBtn='SAVE'
            leftBtn='Cancel'
            onLeftBtnPress={onClose}
          />

          <View className='flex flex-col justify-between pt-4'>
            <CustomTextInput
              title='Caption'
              placeholderClassName='h-32'
              placeholder='What do you achieve?'
              control={control}
            />
          </View>
          {imageSrc && (
              <View className='pt-5 w-full h-[430px]'>
                <ImageSwiper imageSrc={imageSrc} />
              </View>
            )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};
export default EditChallengeProgressModal;
