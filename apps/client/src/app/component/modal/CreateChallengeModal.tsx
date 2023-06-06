import { View, Text, Modal, SafeAreaView } from 'react-native';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
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
import { createChallenge } from '../../service/challenge';
import { useNav } from '../../navigation/navigation.type';
import Loading from '../common/Loading';
import { useUserProfileStore } from '../../store/user-data';
interface ICreateChallengeModalProps {
  onClose: () => void;
}

interface ICreateChallengeForm
  extends Omit<ICreateChallenge, 'achievementTime' | 'owner'> {
  achievementTime?: Date;
}

export const CreateChallengeModal: FC<ICreateChallengeModalProps> = ({
  onClose,
}) => {
  const { t } = useTranslation();
  const navigation = useNav();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { getUserProfile } = useUserProfileStore();

  const {
    control,
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

  const onSubmit = async (data: ICreateChallengeForm) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const payload = {
        ...data,
        achievementTime: data.achievementTime as Date,
        owner: getUserProfile().id,
      };
      console.log('payload: ', payload);
      // const res = await createChallenge(payload);
      // console.log('res: ', res);
      // if (res.status == 201) {
        
      //   // TODO: handle navigate to challenge detail screen
      // } else {
      //   setErrorMessage(t('errorMessage:500') || '');
      // }
    } catch (error) {
      console.log(error);
      setErrorMessage(t('errorMessage:500') || '');
    }
    setIsLoading(false);
  };
  // TODO: handle change CREATE text color when input is entered
  return (
    <Modal animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView className="bg-white">
        <View className="mt-4 flex h-full  rounded-t-xl bg-white">
          <View>
            <Header
              title={t('new_challenge_screen.title') || ''}
              rightBtn={t(
                'new_challenge_screen.create_button'
              ).toLocaleUpperCase()}
              leftBtn={<CloseIcon width={24} height={24} fill={'#34363F'} />}
              onLeftBtnPress={onClose}
              onRightBtnPress={handleSubmit(onSubmit)}
            />
          </View>

          <View className="flex flex-col px-5 py-5">
            <Text className="text-gray-dark text-md font-normal leading-5">
              {t('new_challenge_screen.description')}
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
                  />
                )}
                name={'goal'}
              />
              {errors.goal ? <ErrorText message={errors.goal.message} /> : null}
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
                      label={t('new_challenge_screen.time_to_reach_goal') || ''}
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
                    />
                    <DateTimePicker2
                      selectedDate={value as Date}
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
            <View className="mt-5">
              <ImagePicker isSelectedImage={true} />
            </View>
          </View>
        </View>
        {isLoading && (
          <Loading
            containerClassName="absolute top-0 left-0"
            text={t('register_screen.creating') as string}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};
export default CreateChallengeModal;
