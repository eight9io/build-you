import {
  View,
  Text,
  Modal,
  SafeAreaView,
  TextInput,
  Image,
  Dimensions,
  ScaledSize,
} from 'react-native';
import React, { FC, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';

import Header from '../../common/Header';

import Close from '../../../component/asset/close.svg';
import CustomTextInput from '../../common/Inputs/CustomTextInput';

interface IAddNewEmployeeModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const AddNewEmployeeModal: FC<IAddNewEmployeeModalProps> = ({
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
      goalName: '',
      uploadMedia: '',
      location: '',
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
        <View className="mt-6 flex  h-full rounded-t-xl bg-white">
          <Header
            title="New employee"
            rightBtn="SAVE"
            leftBtn={<Close fill={'black'} />}
            onLeftBtnPress={onClose}
          />
          <View className="px-4 pt-5">
            <CustomTextInput
              title="Email"
              placeholder="Enter employee email"
              control={control}
              maxChar={60}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
export default AddNewEmployeeModal;
