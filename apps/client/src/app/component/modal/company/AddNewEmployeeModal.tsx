import { View, Modal } from 'react-native';
import React, { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { serviceAddEmployee } from '../../../service/company';

import { AddNewEmployeeValidationSchema } from '../../../Validators/validators';

import Header from '../../common/Header';
import ErrorText from '../../common/ErrorText';
import TextInput from '../../common/Inputs/TextInput';
import Close from '../../../component/asset/close.svg';
import ConfirmDialog from '../../common/Dialog/ConfirmDialog';
import { useUserProfileStore } from '../../../store/user-data';

interface IAddNewEmployeeModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const AddNewEmployeeModal: FC<IAddNewEmployeeModalProps> = ({
  isVisible,
  onClose,
}) => {
  const [isSuccessDialogVisible, setIsSuccessDialogVisible] =
    useState<boolean>(false);
  const [isErrorDialogVisible, setIsErrorDialogVisible] =
    useState<boolean>(false);
  const { t } = useTranslation();

  const { getUserProfile } = useUserProfileStore();
  const userData = getUserProfile();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
    },
    resolver: yupResolver(AddNewEmployeeValidationSchema()),
  });

  // add company id
  const onSubmit = (data: any) => {
    if (!userData?.id) {
      setIsErrorDialogVisible(true);
      return;
    }
    const dataToSend = {
      user: data.email,
      companyMobile: userData?.id,
    };
    serviceAddEmployee(dataToSend)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsSuccessDialogVisible(true);
        }
      })
      .catch((err) => {
        setIsErrorDialogVisible(true);
      });
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={isVisible}
    >
      <ConfirmDialog
        title={t('success') as string}
        description={'Employee added successfully'}
        isVisible={isSuccessDialogVisible}
        onClosed={() => {
          setIsSuccessDialogVisible(false);
          onClose();
        }}
        closeButtonLabel={t('close') || ''}
      />
      <ConfirmDialog
        title={t('error') as string}
        description={t('error_general_message') as string}
        isVisible={isErrorDialogVisible}
        onClosed={() => {
          setIsErrorDialogVisible(false);
          onClose();
        }}
        closeButtonLabel={t('close') || ''}
      />
      <View className=" flex h-full rounded-t-xl bg-white px-4">
        <Header
          title="New employee"
          rightBtn="SAVE"
          leftBtn={<Close fill={'black'} />}
          onLeftBtnPress={onClose}
          onRightBtnPress={handleSubmit(onSubmit)}
        />
        <View className="px-2 pt-8">
          <Controller
            control={control}
            name={'email'}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="flex flex-col gap-1">
                <TextInput
                  label="Email"
                  placeholder={'Enter employee email'}
                  placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                  onBlur={onBlur}
                  onChangeText={(text) => onChange(text)}
                  value={value}
                />
              </View>
            )}
          />
          {errors.email && <ErrorText message={errors.email?.message} />}
        </View>
      </View>
    </Modal>
  );
};
export default AddNewEmployeeModal;
