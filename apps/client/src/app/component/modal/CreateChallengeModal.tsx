import { View, Text, Modal, SafeAreaView, TextInput } from 'react-native';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import {
  FillButton,
  OutlineButton,
} from '../../component/common/Buttons/Button';
import Header from '../common/Header';
import ImagePicker from '../common/ImagePicker';
import CustomTextInput from '../common/CustomTextInput';

interface ICreateChallengeModalProps {
  isVisible: boolean;
  onClose: () => void;
}
export const CreateChallengeModal: FC<ICreateChallengeModalProps> = ({
  isVisible,
  onClose,
}) => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      concreteGoal: '',
      listOfBenefits: '',
      reason: '',
      timeToReachGoal: '',
    },
  });
  const onSubmit = (data: any) => console.log(data);
  // TODO: handle change CREATE text color when input is entered
  return (
    <Modal animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView className="bg-white">
        <View className="mt-4 flex h-full  rounded-t-xl bg-white">
          <View className="mt-6">
            <Header
              title="New challenge"
              rightBtn="CREATE"
              leftBtn="Cancel"
              onLeftBtnPress={onClose}
            />
          </View>

          <View className="mt-7 flex flex-col px-5 py-5">
            <Text className="text-gray-dark text-md font-normal leading-5">
              Create a new challenge for yourself with a concrete goal and time
              to reach it.{' '}
            </Text>
            <View className="pt-5">
              <CustomTextInput
                title="Your goal"
                placeholder="Set a concrete goal"
                control={control}
              />
            </View>
            <View className="pt-5">
              <CustomTextInput
                title="The benefits"
                placeholder="List the benefits you will get upon achievement"
                placeholderClassName="h-24"
                control={control}
              />
            </View>

            <View className="pt-5">
              <CustomTextInput
                title="The reasons"
                placeholder="Indicate the reasons that push you to achieve it"
                placeholderClassName="h-24"
                control={control}
              />
            </View>

            {/* <View className='mt-5'>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className='flex flex-col gap-1'>
                    <Text className='text-primary-dark text-sm font-semibold'>
                      Indicate the time to reach your goal
                    </Text>
                    <TextInput
                      placeholder={'Indicate the reasons'}
                      placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      className='border-gray-medium bg-gray-veryLight flex h-24 w-full rounded-sm border-[1px] px-3 py-3 text-base font-normal'
                      multiline
                        />
                        
                  </View>
                )}
                name='timeToReachGoal'
              />
            </View> */}
            <View className="mt-5">
              <ImagePicker />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
export default CreateChallengeModal;
