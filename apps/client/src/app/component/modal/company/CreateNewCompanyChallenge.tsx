import { View, Text, Modal, SafeAreaView, ScrollView } from 'react-native';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import dayjs from 'dayjs';
import Spinner from 'react-native-loading-spinner-overlay';

import { useNav } from '../../../navigation/navigation.type';
import { ICreateCompanyChallenge } from '../../../types/challenge';

import { CreateCompanyChallengeValidationSchema } from '../../../Validators/CreateChallenge.validate';

import Header from '../../common/Header';
import CustomSwitch from '../../common/Switch';
import ErrorText from '../../common/ErrorText';
import ImagePicker from '../../common/ImagePicker';
import TextInput from '../../common/Inputs/TextInput';
import ConfirmDialog from '../../common/Dialog/ConfirmDialog';
import CustomTextInput from '../../common/Inputs/CustomTextInput';
import DateTimePicker2 from '../../common/BottomSheet/DateTimePicker2.tsx/DateTimePicker2';

import CalendarIcon from '../../asset/calendar.svg';
import { ICreateChallenge } from '../../../types/challenge';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  createCompanyChallenge,
  updateChallengeImage,
} from '../../../service/challenge';
import { AxiosResponse } from 'axios';
import httpInstance from '../../../utils/http';
import GlobalDialogController from '../../common/Dialog/GlobalDialogController';
import GlobalToastController from '../../common/Toast/GlobalToastController';

interface ICreateChallengeForm
  extends Omit<ICreateChallenge, 'achievementTime'> {
  achievementTime: Date;
  image?: string | undefined;
  public: boolean;
  maximumPeople: number | undefined;
}

interface ICreateChallengeModalProps {
  onClose: () => void;
}

export const CreateChallengeModal: FC<ICreateChallengeModalProps> = ({
  onClose,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [isRequestSuccess, setIsRequestSuccess] = useState<boolean | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const [newChallengeId, setNewChallengeId] = useState<string | undefined>(
    undefined
  );
  const [errorMessage, setErrorMessage] = useState('');

  const { t } = useTranslation();
  const navigation = useNav();

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<ICreateChallengeForm>({
    defaultValues: {
      goal: '',
      benefits: '',
      reasons: '',
      achievementTime: undefined,
      maximumPeople: undefined,
      public: false,
      image: '',
    },
    resolver: yupResolver(CreateCompanyChallengeValidationSchema()),
    reValidateMode: 'onChange',
  });

  const onSubmit = async (data: ICreateCompanyChallenge) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const { image, ...rest } = data; // Images upload will be handled separately
      const payload = {
        ...rest,
        achievementTime: data.achievementTime as Date,
      };
      const challengeCreateResponse = await createCompanyChallenge(payload);
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
            onClose();
            navigation.navigate('Challenges', {
              screen: 'PersonalChallengeDetailScreen',
              params: {
                challengeId: challengeCreateResponse.data.id as string,
              },
            });
            GlobalToastController.showModal({
              message:
                t('toast.create_challenge_success') ||
                'Your challenge has been created successfully !',
            });

            // setIsRequestSuccess(true);
            // setIsShowModal(true);
            setIsLoading(false);
            return;
          }
          setIsRequestSuccess(false);
          setIsShowModal(true);
          httpInstance.delete(
            `/challenge/delete/${challengeCreateResponse.data.id}`
          );
          GlobalDialogController.showModal({
            title: 'Error',
            message: t('errorMessage:500') || '',
          });
        }
        setIsLoading(false);
        setIsRequestSuccess(true);
        setIsShowModal(true);
      }
    } catch (error) {
      setIsLoading(false);
      GlobalDialogController.showModal({
        title: 'Error',
        message: t('errorMessage:500') || '',
      });
    }
  };

  const handleImagesSelected = (images: string[]) => {
    setValue('image', images[0], {
      shouldValidate: true,
    });
  };

  const handleCloseModal = (newChallengeId: string | undefined) => {
    setIsShowModal(false);
    if (isRequestSuccess && newChallengeId) {
      onClose();
      navigation.navigate('Challenges', {
        screen: 'PersonalChallengeDetailScreen',
        params: { challengeId: newChallengeId },
      });
    }
  };

  const handleDatePicked = (date?: any) => {
    if (typeof date.getMonth === 'function') {
      setValue('achievementTime', date, {
        shouldValidate: true,
      });
    }
    setShowDatePicker(false);
  };

  const handleRemoveSelectedImage = (index: number) => {
    setValue('image', '', {
      shouldValidate: true,
    });
  };

  return (
    <Modal animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView className="flex flex-col bg-white">
        {isLoading && <Spinner visible={isLoading} />}

        <ConfirmDialog
          title={isRequestSuccess ? 'Success' : 'Error'}
          description={
            isRequestSuccess
              ? 'Your challenge has been created successfully'
              : 'Something went wrong. Please try again later.'
          }
          isVisible={isShowModal}
          onClosed={() => handleCloseModal(newChallengeId)}
          closeButtonLabel="Got it"
        />
        <View className="px-4 ">
          <Header
            title="New challenge"
            rightBtn="CREATE"
            leftBtn="Cancel"
            onLeftBtnPress={onClose}
            onRightBtnPress={handleSubmit(onSubmit)}
          />
        </View>
        <KeyboardAwareScrollView extraHeight={150}>
          <View className=" flex h-full  rounded-t-xl bg-white">
            <ScrollView showsVerticalScrollIndicator>
              <View className="mb-10 mt-2 flex flex-col px-5">
                <Text className="text-gray-dark text-md font-normal leading-5">
                  Create a new challenge for yourself with a concrete goal and
                  time to reach it.{' '}
                </Text>
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
                        className={clsx(
                          errors.goal && 'border-1 border-red-500'
                        )}
                      />
                    )}
                    name={'goal'}
                  />
                  {errors.goal && <ErrorText message={errors.goal.message} />}
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
                        value={value}
                        className={clsx(
                          'h-24',
                          errors.benefits && 'border-1 border-red-500'
                        )}
                      />
                    )}
                    name={'benefits'}
                  />
                  {errors.benefits && (
                    <ErrorText message={errors.benefits.message} />
                  )}
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
                      </View>
                    )}
                    name={'reasons'}
                  />
                  {errors.reasons && (
                    <ErrorText message={errors.reasons.message} />
                  )}
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
                          onPress={() => setShowDatePicker(true)}
                          className={clsx(
                            errors.achievementTime && 'border-1 border-red-500'
                          )}
                        />
                        <DateTimePicker2
                          selectedDate={value}
                          setSelectedDate={handleDatePicked}
                          setShowDateTimePicker={setShowDatePicker}
                          showDateTimePicker={showDatePicker}
                          minimumDate={new Date()}
                        />
                      </>
                    )}
                    name={'achievementTime'}
                  />
                  {errors.achievementTime && (
                    <ErrorText message={errors.achievementTime.message} />
                  )}
                </View>

                <View className="pt-5">
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        label={t('new_challenge_screen.max_people') || ''}
                        placeholder={
                          t('new_challenge_screen.max_people_placeholder') || ''
                        }
                        placeholderTextColor={'#6C6E76'}
                        onChangeText={(number) => onChange(+number)}
                        onBlur={onBlur}
                        value={value ? value.toString() : ''}
                        keyboardType="number-pad"
                        className={clsx(
                          errors.goal && 'border-1 border-red-500'
                        )}
                      />
                    )}
                    name={'maximumPeople'}
                  />
                  {errors.maximumPeople && (
                    <ErrorText message={errors.maximumPeople.message} />
                  )}
                </View>

                <View className="flex flex-col justify-start pt-5">
                  <CustomSwitch
                    textDisable="Private"
                    textEnable="Public"
                    setValue={setValue}
                  />
                  <Text className="text-gray-dark pt-2 text-sm font-normal leading-4 ">
                    Everyone can join your public challenge while only user from
                    your company can join your private challenge.
                  </Text>
                </View>

                <View className="mt-5">
                  {/* <ImagePicker isSelectedImage /> */}
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
              <View className="h-20" />
            </ScrollView>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </Modal>
  );
};
export default CreateChallengeModal;
