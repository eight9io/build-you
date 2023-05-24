import { View, Modal, SafeAreaView } from 'react-native';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import CustomTextInput from '../../../common/Inputs/CustomTextInput';
import Header from '../../../common/Header';

interface IEditCompanyProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const EditCompanyProfileModal: FC<IEditCompanyProfileModalProps> = ({
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
      caption: '',
    },
  });

  const onSubmit = (data: any) => console.log(data);

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={isVisible}
    >
      <SafeAreaView className="mx-4 bg-white">
        <View className="mt-6 flex h-full flex-col rounded-t-xl bg-white">
          <Header
            title="Edit profile"
            rightBtn="SAVE"
            leftBtn="Cancel"
            onLeftBtnPress={onClose}
          />

          <View className="flex flex-col justify-between pt-4">
            <CustomTextInput
              title="Company Name"
              placeholder="Enter company name"
              control={control}
            />
          </View>

          <View className="flex flex-col justify-between pt-4">
            <CustomTextInput
              title="Biography"
              placeholderClassName="h-32"
              placeholder="Tell us about your company"
              control={control}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
export default EditCompanyProfileModal;
