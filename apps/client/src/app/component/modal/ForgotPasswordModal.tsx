import {
  View,
  Text,
  Modal,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';

import React, { useState } from 'react';
import Header from '../common/Header';
import NavButton from '../common/Buttons/NavButton';
import { useTranslation } from 'react-i18next';
import Spinner from 'react-native-loading-spinner-overlay';

import { Controller, useForm } from 'react-hook-form';
import { ResetPasswordValidationSchema } from '../../Validators/ResetPassword.validate';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '../common/Buttons/Button';
import ErrorText from '../common/ErrorText';
import TextInput from '../common/Inputs/TextInput';
import IconEyeOn from './asset/icon-eye.svg';
import IconEyeOff from './asset/eye-off.svg';
import Loading from '../common/Loading';
import { serviceChangePassword } from '../../service/auth';
import { err_server, errorMessage } from '../../utils/statusCode';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
interface Props {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  navigation?: any;
  email?: string;
}
type FormData = {
  code: any;
  password: string;
  repeat_password: string;
  email: string;
};
export default function ForgotPasswordModal({
  navigation,
  modalVisible,
  setModalVisible,
  email,
}: Props) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      code: '',
      password: '',
      repeat_password: '',
      email: email,
    },
    resolver: yupResolver(ResetPasswordValidationSchema()),
    reValidateMode: 'onChange',
    mode: 'onSubmit',
  });
  const [isLoading, setIsLoading] = useState(false);

  const [errMessage, setErrMessage] = useState('');
  const onSubmit = (data: FormData) => {
    setIsLoading(true);

    serviceChangePassword({
      code: data.code,
      email: email as string,
      password: data.password,
    })
      .then((res) => {
        if (res.status == 201) {
          setTimeout(() => {
            navigation.navigate('LoginScreen');
          }, 1500);
          setErrMessage('');
        } else {
          setErrMessage(err_server);
        }
      })
      .catch((error) => {
        setErrMessage(errorMessage(error, 'err_change_password') as string);
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      });
  };
  const [hidePassword, setHidePassword] = useState(true);
  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      presentationStyle="pageSheet"
      statusBarTranslucent={isLoading}
    >
      <View className="mx-1 h-full bg-white">
        <Header
          containerStyle="mx-4"
          title={t('forgot_password.title') as string}
          leftBtn={
            <NavButton
              text={t('button.back') as string}
              onPress={() => setModalVisible(false)}
              withBackIcon
            />
          }
        />
        <KeyboardAwareScrollView>
          <View className="h-full pt-5">
            <SafeAreaView>
              {isLoading && <Spinner visible={isLoading} />}

              <View className="flex-column h-full justify-between bg-white px-6  pb-14">
                <View>
                  <View className="flex-column items-center  ">
                    <Image
                      className=" mb-7 mt-10 h-[91px] w-[185px]"
                      source={require('./asset/buildYou1.png')}
                      contentFit="cover"
                    />
                    <Text className="text-h6 text-gray-dark px-2 text-center leading-6 ">
                      {t('forgot_password.sub_title')}
                    </Text>
                  </View>
                  {errMessage && (
                    <ErrorText
                      containerClassName="justify-center mt-4"
                      message={errMessage}
                    />
                  )}
                  <View className="mt-4 flex flex-col ">
                    {(
                      t('form', {
                        returnObjects: true,
                      }) as Array<any>
                    ).map((item, index) => {
                      if (item.name === 'email' || item.name === 'user') {
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
                              render={({
                                field: { onChange, onBlur, value },
                              }) => (
                                <View className="flex flex-col gap-1">
                                  <TextInput
                                    rightIcon={
                                      (item.name === 'repeat_password' ||
                                        item.name === 'password') &&
                                      (!hidePassword ? (
                                        <TouchableOpacity
                                          onPress={() =>
                                            setHidePassword(!hidePassword)
                                          }
                                          className=" mt-[2px]"
                                        >
                                          <IconEyeOn />
                                        </TouchableOpacity>
                                      ) : (
                                        <TouchableOpacity
                                          onPress={() =>
                                            setHidePassword(!hidePassword)
                                          }
                                          className=" mt-[2px]"
                                        >
                                          <IconEyeOff />
                                        </TouchableOpacity>
                                      ))
                                    }
                                    secureTextEntry={
                                      (item.name === 'password' ||
                                        item.name === 'repeat_password') &&
                                      hidePassword
                                        ? true
                                        : false
                                    }
                                    label={item.label}
                                    placeholder={item.placeholder}
                                    placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                                    onBlur={onBlur}
                                    onChangeText={(text) => onChange(text)}
                                    value={value}
                                  />
                                </View>
                              )}
                            />
                            {errors[item.name as keyof FormData] && (
                              <ErrorText
                                message={
                                  errors[item.name as keyof FormData]?.message
                                }
                              />
                            )}
                          </View>
                        );
                      }
                    })}
                  </View>
                </View>
                <View className="pb-10 pt-10">
                  <Button
                    containerClassName="bg-primary-default flex-none px-1 "
                    textClassName="line-[30px] text-center text-md font-medium text-white"
                    title={t('reset_password')}
                    onPress={handleSubmit(onSubmit)}
                  />
                </View>
              </View>
            </SafeAreaView>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </Modal>
  );
}
