import { View, Modal, SafeAreaView } from 'react-native';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Spinner from 'react-native-loading-spinner-overlay';

import { IUpdateProgress } from '../../types/progress';
import { IProgressChallenge } from '../../types/challenge';
import { EditProgressValidationSchema } from '../../Validators/EditProgress.validate';

import useModal from '../../hooks/useModal';
import { updateProgress } from '../../service/progress';

import Header from '../common/Header';
import ImageSwiper from '../common/ImageSwiper';
import VideoPlayer from '../common/VideoPlayer';
import TextInput from '../common/Inputs/TextInput';
import ErrorText from '../common/ErrorText';
import ConfirmDialog from '../common/Dialog/ConfirmDialog';

import CloseIcon from '../asset/close.svg';

interface IEditChallengeProgressModalProps {
  progress: IProgressChallenge;
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const EditChallengeProgressModal: FC<
  IEditChallengeProgressModalProps
> = ({ progress, isVisible, onClose, onConfirm }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {
    isVisible: isConfirmModalVisible,
    openModal: openConfirmModal,
    closeModal: closeConfirmModal,
  } = useModal();
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
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    if (progress) {
      setValue('caption', progress?.caption);
    }
  }, [progress]);

  const onSubmit = async (data: IUpdateProgress) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await updateProgress(progress.id, {
        ...data,
      });
      if (res.status === 200) {
        openConfirmModal();
      } else {
        setErrorMessage(t('errorMessage:500') || '');
      }
    } catch (error) {
      setErrorMessage(t('errorMessage:500') || '');
    }
    setIsLoading(false);
  };

  const handleCloseConfirmModal = () => {
    closeConfirmModal();
    onConfirm();
  };
  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={isVisible}
      statusBarTranslucent={isLoading}
    >
      <SafeAreaView className=" bg-white">
        {isLoading && <Spinner visible={isLoading} />}

        <View className="mx-4 flex h-full flex-col rounded-t-xl bg-white">
          <Header
            title={t('challenge_detail_screen.edit_progress') || ''}
            rightBtn={t('edit_progress_modal.save_button').toLocaleUpperCase()}
            leftBtn={<CloseIcon width={24} height={24} fill={'#34363F'} />}
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
                  label={t('edit_progress_modal.caption') || ''}
                  placeholder={
                    t('edit_progress_modal.caption_placeholder') || ''
                  }
                  placeholderTextColor={'#6C6E76'}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  multiline
                  textAlignVertical="top"
                  className="h-32"
                />
              )}
              name={'caption'}
            />
            {errors.caption ? (
              <ErrorText message={errors.caption.message} />
            ) : null}
          </View>
          {progress?.image ? (
            <View className="mt-5 aspect-square w-full">
              <ImageSwiper imageSrc={progress?.image.replace(';', '') || ''} />
            </View>
          ) : progress.video ? (
            <View className="mt-5 aspect-square w-full">
              <VideoPlayer src={progress.video} />
            </View>
          ) : null}
        </View>
        <ConfirmDialog
          title={(!errorMessage ? t('success') : t('error')) || ''}
          description={
            (!errorMessage
              ? t('edit_progress_modal.edit_success')
              : t('errorMessage:500')) || ''
          }
          isVisible={isConfirmModalVisible}
          onClosed={handleCloseConfirmModal}
          closeButtonLabel={t('close') || ''}
        />
      </SafeAreaView>
    </Modal>
  );
};
export default EditChallengeProgressModal;
