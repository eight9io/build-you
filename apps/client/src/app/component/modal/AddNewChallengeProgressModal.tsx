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
import VideoPicker from '../common/VideoPicker';

interface IAddNewChallengeProgressModalProps {
  isVisible: boolean;
  onClose: () => void;
}
export const AddNewChallengeProgressModal: FC<
  IAddNewChallengeProgressModalProps
> = ({ isVisible, onClose }) => {
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
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={isVisible}
    >
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

          <View className=" flex flex-col px-5 pt-2">
            <View className="pt-5">
              <CustomTextInput
                title="Caption"
                placeholder="What do you achieve?"
                control={control}
              />
            </View>
            <View className="mt-5">
              <ImagePicker />
            </View>
            <View className="mt-5">
              <VideoPicker />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
export default AddNewChallengeProgressModal;
