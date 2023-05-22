import {
  View,
  Text,
  Image,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import TextInput from '../../component/common/Inputs/TextInput';
import { CheckBox, Icon } from '@rneui/themed';
import { yupResolver } from '@hookform/resolvers/yup';
import { RegisterValidationSchema } from '../../Validators/Register.validate';
import Button from '../../component/common/Buttons/Button';

import PolicyModal from '../../component/modal/PolicyModal';
import RegisterCreating from '../../component/modal/RegisterCreating';
import ErrorText from '../../component/common/ErrorText';

import { LoginValidationSchema } from '../../Validators/Login.validate';
import ForgotPasswordModal from '../../component/modal/ForgotPasswordModal';
import { ForgotPasswordValidationSchema } from '../../Validators/ForgotPassword.validate';
type FormData = {
  email: string;
};
export default function index({ navigation }: { navigation: any }) {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      email: '',
    },
    resolver: yupResolver(ForgotPasswordValidationSchema()),
    reValidateMode: 'onChange',
    mode: 'onSubmit',
  });
  const onSubmit = (data: FormData) => {
    console.log(data);
  };
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView>
      <View className="flex-column h-full justify-between bg-white px-6  pb-14">
        <View>
          <View className="flex-column items-center  ">
            <Image
              className=" mb-7 mt-10 h-[91px] w-[185px]"
              source={require('./asset/buildYou.png')}
              resizeMode="cover"
            />
          </View>

          <View className="mt-4 flex flex-col ">
            {(
              t('form', {
                returnObjects: true,
              }) as Array<any>
            ).map((item, index) => {
              if (
                item.name === 'check_policy' ||
                item.name === 'repeat_password' ||
                item.name === 'password' ||
                item.name === 'code'
              ) {
                return;
              } else {
                return (
                  <View className="pt-5" key={index}>
                    <Controller
                      control={control}
                      name={item.name}
                      rules={{
                        required: true,
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <View className="flex flex-col gap-1">
                          <TextInput
                            label={item.label}
                            placeholder={item.placeholder}
                            placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                            onBlur={onBlur}
                            onChangeText={(text) => onChange(text)}
                            value={value}
                            className="  border-gray-medium bg-gray-veryLight  w-full rounded-[10px] border-[1px] p-4  "
                          />
                        </View>
                      )}
                    />
                    {errors[item.name as keyof FormData] && (
                      <ErrorText
                        message={errors[item.name as keyof FormData]?.message}
                      />
                    )}
                  </View>
                );
              }
            })}
          </View>
        </View>
        <View>
          <Button
            containerClassName="  bg-primary-default flex-none px-1 "
            textClassName="line-[30px] text-center text-md font-medium text-white"
            title={t('send_code')}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
        <ForgotPasswordModal
          navigation={navigation}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      </View>
    </SafeAreaView>
  );
}
