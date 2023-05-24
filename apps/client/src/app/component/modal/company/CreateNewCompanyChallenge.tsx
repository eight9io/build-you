import {
  View,
  Text,
  Modal,
  SafeAreaView,
  TextInput,
  ScrollView,
} from 'react-native';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import Header from '../../common/Header';
import ImagePicker from '../../common/ImagePicker';
import CustomTextInput from '../../common/Inputs/CustomTextInput';

import CustomSwitch from '../../common/Switch';

interface ICreateChallengeModalProps {
  onClose: () => void;
}
export const CreateChallengeModal: FC<ICreateChallengeModalProps> = ({
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
          <Header
            title="New challenge"
            rightBtn="CREATE"
            leftBtn="Cancel"
            onLeftBtnPress={onClose}
          />
          <ScrollView showsVerticalScrollIndicator>
            <View className="mb-10 mt-2 flex flex-col px-5">
              <Text className="text-gray-dark text-md font-normal leading-5">
                Create a new challenge for yourself with a concrete goal and
                time to reach it.{' '}
              </Text>
              <View className="pt-5">
                <CustomTextInput
                  title="Your goal"
                  placeholder="Set a concrete goal"
                  control={control}
                  maxChar={40}
                />
              </View>
              <View className="pt-2">
                <CustomTextInput
                  title="The benefits"
                  placeholder="List the benefits you will get upon achievement"
                  placeholderClassName="h-24"
                  control={control}
                  maxChar={300}
                />
              </View>

              <View className="pt-2">
                <CustomTextInput
                  title="The reasons"
                  placeholder="Indicate the reasons that push you to achieve it"
                  placeholderClassName="h-24"
                  control={control}
                  maxChar={300}
                />
              </View>

              <View className="pt-2">
                <CustomTextInput
                  title="Time to reach the goal"
                  placeholder="Select time"
                  control={control}
                  maxChar={40}
                />
              </View>

              <View className="pt-2">
                <CustomTextInput
                  title="Maximum people can join"
                  placeholder="Enter number of people"
                  control={control}
                />
              </View>

              <View className="flex flex-row items-center justify-start pt-5">
                <CustomSwitch textDisable="Private" textEnable="Public" />
              </View>

              <View className="">
                <ImagePicker isSelectedImage />
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
export default CreateChallengeModal;
