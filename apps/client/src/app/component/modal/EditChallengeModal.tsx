import { View, Modal, SafeAreaView } from 'react-native';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import Header from '../common/Header';
import CloseIcon from '../asset/close.svg';
import TextInput from '../common/Inputs/TextInput';
import dayjs from '../../utils/date.util';
import CalendarIcon from '../asset/calendar.svg';
import DateTimePicker2 from '../common/BottomSheet/DateTimePicker2.tsx/DateTimePicker2';
import { yupResolver } from '@hookform/resolvers/yup';
import ErrorText from '../common/ErrorText';
import { IChallenge, IEditChallenge } from '../../types/challenge';
import { useNav } from '../../navigation/navigation.type';
import Loading from '../common/Loading';
import { EditChallengeValidationSchema } from '../../Validators/EditChallenge.validate';
import { ScrollView } from 'react-native-gesture-handler';
import ConfirmDialog from '../common/Dialog/ConfirmDialog';
import useModal from '../../hooks/useModal';
import { updateChallenge } from '../../service/challenge';
interface IEditChallengeModalProps {
  challenge: IChallenge;
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const EditChallengeModal: FC<IEditChallengeModalProps> = ({
  challenge,
  visible,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const navigation = useNav();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {
    isVisible: isConfirmModalVisible,
    openModal: openConfirmModal,
    closeModal: closeConfirmModal,
  } = useModal();

  const {
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<IEditChallenge>({
    defaultValues: {
      goal: challenge.goal,
      benefits: challenge.benefits,
      reasons: challenge.reasons,
      achievementTime: dayjs(challenge.achievementTime).format('YYYY-MM-DD'),
    },
    resolver: yupResolver(EditChallengeValidationSchema()),
  });

  const handleShowDatePicker = () => {
    setShowDatePicker(true);
    console.log('show date picker');
  };

  const handleDatePicked = (date?: Date) => {
    if (date) {
      setValue('achievementTime', dayjs(date).format('YYYY-MM-DD'), {
        shouldValidate: true,
      });
    }
    setShowDatePicker(false);
  };

  const onSubmit = async (data: IEditChallenge) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await updateChallenge(challenge.id, {
        ...data,
      });
      if (res.status === 200) {
        openConfirmModal();
      } else {
        setErrorMessage(t('errorMessage:500') || '');
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(t('errorMessage:500') || '');
    }
    setIsLoading(false);
  };

  const handleCloseConfirmModal = (challengeId: string) => {
    closeConfirmModal();
    // Close edit challenge modal and navigate to challenge detail screen
    onConfirm();
    navigation.navigate('PersonalChallengeDetailScreen', {
      challengeId: challengeId,
    });
  };
  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      statusBarTranslucent={isLoading}
      visible={visible}
    >
      {' '}
      <ScrollView>
        <SafeAreaView>
          <View className="mx-4 flex h-full rounded-t-xl bg-white">
            <View>
              <Header
                title={t('edit_challenge_screen.title') || ''}
                rightBtn={t(
                  'edit_challenge_screen.save_button'
                ).toLocaleUpperCase()}
                leftBtn={<CloseIcon width={24} height={24} fill={'#34363F'} />}
                onLeftBtnPress={onClose}
                onRightBtnPress={handleSubmit(onSubmit)}
                containerStyle="mt-2"
              />
            </View>

            <View className="flex flex-1 flex-col px-5 py-5">
              <View className="pt-5">
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label={t('edit_challenge_screen.your_goal') || ''}
                      placeholder={
                        t('edit_challenge_screen.your_goal_placeholder') || ''
                      }
                      placeholderTextColor={'#6C6E76'}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
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
                      label={t('edit_challenge_screen.benefits') || ''}
                      placeholder={
                        t('edit_challenge_screen.benefits_placeholder') || ''
                      }
                      placeholderTextColor={'#6C6E76'}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      multiline
                      textAlignVertical="top"
                      className="h-24"
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
                    <TextInput
                      label={t('edit_challenge_screen.reasons') || ''}
                      placeholder={
                        t('edit_challenge_screen.reasons_placeholder') || ''
                      }
                      placeholderTextColor={'#6C6E76'}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      multiline
                      textAlignVertical="top"
                      className="h-24"
                    />
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
                          t('edit_challenge_screen.time_to_reach_goal') || ''
                        }
                        placeholder={
                          t(
                            'edit_challenge_screen.time_to_reach_goal_placeholder'
                          ) || ''
                        }
                        placeholderTextColor={'#6C6E76'}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        editable={false}
                        value={value ? dayjs(value).format('DD/MM/YYYY') : ''}
                        rightIcon={<CalendarIcon />}
                        onPress={handleShowDatePicker}
                      />
                      <DateTimePicker2
                        selectedDate={dayjs(value).toDate()}
                        setSelectedDate={handleDatePicked}
                        setShowDateTimePicker={setShowDatePicker}
                        showDateTimePicker={showDatePicker}
                      />
                    </>
                  )}
                  name={'achievementTime'}
                />
                {errors.achievementTime ? (
                  <ErrorText message={errors.achievementTime.message} />
                ) : null}
              </View>
            </View>
          </View>
          <ConfirmDialog
            title={(!errorMessage ? t('success') : t('error')) || ''}
            description={
              (!errorMessage
                ? t('edit_challenge_screen.edit_success')
                : t('errorMessage:500')) || ''
            }
            isVisible={isConfirmModalVisible}
            onClosed={() => handleCloseConfirmModal(challenge.id)}
            closeButtonLabel={t('close') || ''}
          />
        </SafeAreaView>
      </ScrollView>
      {isLoading && <Loading containerClassName="absolute top-0 left-0" />}
    </Modal>
  );
};
export default EditChallengeModal;
