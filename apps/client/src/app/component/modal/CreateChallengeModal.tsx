import { View, Text, Modal, SafeAreaView, ScrollView } from 'react-native';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller, set } from 'react-hook-form';
import Header from '../common/Header';
import ImagePicker from '../common/ImagePicker';
import CloseIcon from '../asset/close.svg';
import TextInput from '../common/Inputs/TextInput';
import dayjs from '../../utils/date.util';
import CalendarIcon from '../asset/calendar.svg';
import DateTimePicker2 from '../common/BottomSheet/DateTimePicker2.tsx/DateTimePicker2';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreateChallengeValidationSchema } from '../../Validators/CreateChallenge.validate';
import ErrorText from '../common/ErrorText';
import { ICreateChallenge } from '../../types/challenge';
import { createChallenge, updateChallengeImage } from '../../service/challenge';
import { useNav } from '../../navigation/navigation.type';
import Loading from '../common/Loading';
import clsx from 'clsx';
import { getImageExtension } from '../../utils/uploadUserImage';
import { AxiosResponse } from 'axios';
import ConfirmDialog from '../common/Dialog/ConfirmDialog';
import httpInstance from '../../utils/http';
interface ICreateChallengeModalProps {
  onClose: () => void;
}

interface ICreateChallengeForm
  extends Omit<ICreateChallenge, 'achievementTime'> {
  achievementTime?: Date;
  image?: string;
}

export const CreateChallengeModal: FC<ICreateChallengeModalProps> = ({
  onClose,
}) => {
  const { t } = useTranslation();
  const navigation = useNav();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [isRequestSuccess, setIsRequestSuccess] = useState<boolean | null>(
    null
  );
  const [newChallengeId, setNewChallengeId] = useState<string | undefined>(
    undefined
  );
  const {
    control,
    getValues,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateChallengeForm>({
    defaultValues: {
      goal: '',
      benefits: '',
      reasons: '',
      achievementTime: undefined,
      image: '',
    },
    resolver: yupResolver(CreateChallengeValidationSchema()),
  });

  const handleShowDatePicker = () => {
    setShowDatePicker(true);
  };

  const handleDatePicked = (date?: Date) => {
    if (date) {
      setValue('achievementTime', date, {
        shouldValidate: true,
      });
    }
    setShowDatePicker(false);
  };

  const handleImagesSelected = (images: string[]) => {
    setValue('image', images[0], {
      shouldValidate: true,
    });
  };

  const handleRemoveSelectedImage = (index: number) => {
    setValue('image', undefined, {
      shouldValidate: true,
    });
  };

  const onSubmit = async (data: ICreateChallengeForm) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const { image, ...rest } = data; // Images upload will be handle separately
      const payload = {
        ...rest,
        achievementTime: data.achievementTime as Date,
      };

      // Create a challenge without image
      const challengeCreateResponse = await createChallenge(payload);
      // If challenge created successfully, upload image
      if (challengeCreateResponse.status === 200 || 201) {
        setNewChallengeId(challengeCreateResponse.data.id);
        if (image) {
          const challengeImageResponse = (await updateChallengeImage(
            {
              id: challengeCreateResponse.data.id,
            },
            image
          )) as AxiosResponse;

          if (challengeImageResponse.status === 200 || 201) {
            setIsRequestSuccess(true);
            setIsShowModal(true);
            return;
          }
          setIsRequestSuccess(false);
          setIsShowModal(true);
          httpInstance.delete(
            `/challenge/delete/${challengeCreateResponse.data.id}`
          );
          setErrorMessage(t('errorMessage:500') || '');
        }
        setIsRequestSuccess(true);
        setIsShowModal(true);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(t('errorMessage:500') || '');
    }
    setIsLoading(false);
  };
  // TODO: handle change CREATE text color when input is entered

  const handleCloseModal = (newChallengeId: string | undefined) => {
    setIsShowModal(false);
    console.log('newChallengeId', newChallengeId);
    if (isRequestSuccess && newChallengeId) {
      onClose();
      navigation.navigate('Challenges', {
        screen: 'PersonalChallengeDetailScreen',
        params: { challengeId: newChallengeId },
      });
    }
  };

  return (
    <Modal animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView className="bg-white">
        <ScrollView>
          <ConfirmDialog
            title={isRequestSuccess ? 'Success' : 'Error'}
            description={
              isRequestSuccess
                ? 'Your progress has been created successfully'
                : 'Something went wrong. Please try again later.'
            }
            isVisible={isShowModal}
            onClosed={() => handleCloseModal(newChallengeId)}
            closeButtonLabel="Got it"
          />
          <View className="mx-4  flex h-full  rounded-t-xl bg-white">
            <View>
              <Header
                title={t('new_challenge_screen.title') || ''}
                rightBtn={t(
                  'new_challenge_screen.create_button'
                ).toLocaleUpperCase()}
                leftBtn={<CloseIcon width={24} height={24} fill={'#34363F'} />}
                onLeftBtnPress={onClose}
                onRightBtnPress={handleSubmit(onSubmit)}
                containerStyle="mt-5"
              />
            </View>

            <View className="flex flex-col px-5 py-5">
              <Text className="text-gray-dark text-md font-normal leading-5">
                {t('new_challenge_screen.description')}
              </Text>
              {errorMessage && (
                <ErrorText
                  containerClassName="justify-center "
                  message={errorMessage}
                />
              )}
            </View>

            <View className="flex flex-col  py-5">
              <Text className="text-gray-dark text-md font-normal leading-5">
                {t('new_challenge_screen.description')}
              </Text>
              {errorMessage && (
                <ErrorText
                  containerClassName="justify-center "
                  message={errorMessage}
                />
              )}
              <View className="pt-5">
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label={t('new_challenge_screen.your_goal') || ''}
                      placeholder={
                        t('new_challenge_screen.your_goal_placeholder') || ''
                      }
                      placeholderTextColor={'#6C6E76'}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      className={clsx(errors.goal && 'border-1 border-red-500')}
                    />
                  )}
                  name={'goal'}
                />
                {errors.goal ? (
                  <ErrorText message={errors.goal.message} />
                ) : null}
              </View>
              <View className="pt-5">
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label={t('new_challenge_screen.benefits') || ''}
                      placeholder={
                        t('new_challenge_screen.benefits_placeholder') || ''
                      }
                      placeholderTextColor={'#6C6E76'}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      multiline
                      textAlignVertical="top"
                      editable={false}
                      value={value && dayjs(value).format('DD/MM/YYYY')}
                      rightIcon={<CalendarIcon />}
                      onPress={handleShowDatePicker}
                      className={clsx(
                        'h-24',
                        errors.benefits && 'border-1 border-red-500'
                      )}
                    />
                  )}
                  name={'benefits'}
                />
                {errors.benefits ? (
                  <ErrorText message={errors.benefits.message} />
                ) : null}
              </View>

              <View className="pt-5">
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                      <TextInput
                        label={t('new_challenge_screen.reasons') || ''}
                        placeholder={
                          t('new_challenge_screen.reasons_placeholder') || ''
                        }
                        placeholderTextColor={'#6C6E76'}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        multiline
                        textAlignVertical="top"
                        className={clsx(
                          'h-24',
                          errors.reasons && 'border-1 border-red-500'
                        )}
                      />
                      <DateTimePicker2
                        shouldMinus16Years={false}
                        selectedDate={value as Date}
                        setSelectedDate={handleDatePicked}
                        setShowDateTimePicker={setShowDatePicker}
                        showDateTimePicker={showDatePicker}
                      />
                    </View>
                  )}
                  name={'reasons'}
                />
                {errors.reasons ? (
                  <ErrorText message={errors.reasons.message} />
                ) : null}
              </View>

              <View className="mt-5">
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <TextInput
                        label={
                          t('new_challenge_screen.time_to_reach_goal') || ''
                        }
                        placeholder={
                          t(
                            'new_challenge_screen.time_to_reach_goal_placeholder'
                          ) || ''
                        }
                        placeholderTextColor={'#6C6E76'}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        editable={false}
                        value={value ? dayjs(value).format('DD/MM/YYYY') : ''}
                        rightIcon={<CalendarIcon />}
                        onPress={handleShowDatePicker}
                        className={clsx(
                          errors.achievementTime && 'border-1 border-red-500'
                        )}
                      />
                      <DateTimePicker2
                        selectedDate={value as Date}
                        setSelectedDate={handleDatePicked}
                        setShowDateTimePicker={setShowDatePicker}
                        showDateTimePicker={showDatePicker}
                        minimumDate={new Date()}
                      />
                    </>
                  )}
                  name={'achievementTime'}
                />
                {errors.achievementTime ? (
                  <ErrorText message={errors.achievementTime.message} />
                ) : null}
              </View>
              <View className="mt-5">
                <ImagePicker
                  images={getValues('image') ? [getValues('image')!] : []}
                  onImagesSelected={handleImagesSelected}
                  onRemoveSelectedImage={handleRemoveSelectedImage}
                  base64
                />
                {errors.image ? (
                  <ErrorText message={errors.image.message} />
                ) : null}
              </View>
            </View>
          </View>
        </ScrollView>
        {isLoading && <Loading containerClassName="absolute top-0 left-0" />}
      </SafeAreaView>
    </Modal>
  );
};
export default CreateChallengeModal;
