import { View, Text, Modal, SafeAreaView, TextInput } from 'react-native';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { FillButton, OutlineButton } from '../../component/common/Button';
import Header from '../common/Header';
import ImagePicker from '../ImagePicker';

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
  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <SafeAreaView className="bg-[#D8D8D8]">
        <View className="mt-4 flex h-full  rounded-t-xl bg-white">
          <View className="mt-6">
            <Header
              title="New challenge"
              rightBtnText="Annulla"
              onRightBtnPress={onClose}
            />
          </View>

          <View className="mt-7 px-5 py-5">
            <View>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="flex flex-col gap-1">
                    <Text className="text-primary-dark text-sm font-semibold">
                      Set a concrete goal
                    </Text>
                    <TextInput
                      placeholder={'Enter a concrete goal'}
                      placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      className="border-gray-medium bg-gray-veryLight flex h-12 w-full rounded-sm border-[1px] px-3 py-2 text-base font-normal"
                      multiline
                    />
                  </View>
                )}
                name="concreteGoal"
              />
            </View>
            <View className="mt-5">
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="flex flex-col gap-1">
                    <Text className="text-primary-dark text-sm font-semibold">
                      List the benefits you will get upon achievement
                    </Text>
                    <TextInput
                      placeholder={'List the benefits'}
                      placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      className="border-gray-medium bg-gray-veryLight flex h-24 w-full rounded-sm border-[1px] px-3 py-3 text-base font-normal"
                      multiline
                    />
                  </View>
                )}
                name="listOfBenefits"
              />
            </View>
            <View className="mt-5">
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="flex flex-col gap-1">
                    <Text className="text-primary-dark text-sm font-semibold">
                      Indicate the reasons that push you to achieve it
                    </Text>
                    <TextInput
                      placeholder={'Indicate the reasons'}
                      placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      className="border-gray-medium bg-gray-veryLight flex h-24 w-full rounded-sm border-[1px] px-3 py-3 text-base font-normal"
                      multiline
                    />
                  </View>
                )}
                name="reason"
              />
            </View>
            {/* <View className="mt-5">
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="flex flex-col gap-1">
                    <Text className="text-primary-dark text-sm font-semibold">
                      Indicate the time to reach your goal
                    </Text>
                    <TextInput
                      placeholder={'Indicate the reasons'}
                      placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      className="border-gray-medium bg-gray-veryLight flex h-24 w-full rounded-sm border-[1px] px-3 py-3 text-base font-normal"
                      multiline
                        />
                        
                  </View>
                )}
                name="timeToReachGoal"
              />
            </View> */}
            <View className="bg-gray-veryLight mt-5 h-28 rounded-xl">
              <ImagePicker />
            </View>

            <View className="mt-8 flex h-full w-full flex-row" style={{gap: 16}}>
              <OutlineButton title="Back" onPress={onClose}/>
              <FillButton title="Next" onPress={handleSubmit(onSubmit)}/>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
export default CreateChallengeModal;
