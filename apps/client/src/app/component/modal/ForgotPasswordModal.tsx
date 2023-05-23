import {
  View,
  Text,
  Modal,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import Header from '../common/Header';
import NavButton from '../common/Buttons/NavButton';
import { useTranslation } from 'react-i18next';
import IconLoading from './asset/loading.svg';
import { Controller, useForm } from 'react-hook-form';
import { ResetPasswordValidationSchema } from '../../Validators/ResetPassword.validate';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '../common/Buttons/Button';
import ErrorText from '../common/ErrorText';
import TextInput from '../common/Inputs/TextInput';
import IconEyeOn from './asset/icon-eye.svg';
import IconEyeOff from './asset/eye-off.svg';
interface Props {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  navigation?: any;
}
type FormData = {
  code: any;
  password: string;
  repeat_password: string;
};
export default function ForgotPasswordModal({
  navigation,
  modalVisible,
  setModalVisible,
}: Props) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      repeat_password: '',
    },
    resolver: yupResolver(ResetPasswordValidationSchema()),
    reValidateMode: 'onChange',
    mode: 'onSubmit',
  });
  const onSubmit = (data: FormData) => {
    console.log(data);
  };
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      presentationStyle="pageSheet"
    >
      <View className=" bg-white ">
        <View className="h-full pt-5">
          <Header
            title={t('forgot_password.title') as string}
            leftBtn={<NavButton onPress={() => setModalVisible(false)} />}
          />

          <SafeAreaView>
            <View className="flex-column h-full justify-between bg-white px-6  pb-14">
              <View>
                <View className="flex-column items-center  ">
                  <Image
                    className=" mb-7 mt-10 h-[91px] w-[185px]"
                    source={require('./asset/buildYou1.png')}
                    resizeMode="cover"
                  />
                </View>

                <View className="mt-4 flex flex-col ">
                  {(
                    t('form', {
                      returnObjects: true,
                    }) as Array<any>
                  ).map((item, index) => {
                    if (item.name === 'email') {
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
                                    (!showPassword ? (
                                      <TouchableOpacity
                                        onPress={() =>
                                          setShowPassword(!showPassword)
                                        }
                                        className=" mt-[2px]"
                                      >
                                        <IconEyeOn />
                                      </TouchableOpacity>
                                    ) : (
                                      <TouchableOpacity
                                        onPress={() =>
                                          setShowPassword(!showPassword)
                                        }
                                        className=" mt-[2px]"
                                      >
                                        <IconEyeOff />
                                      </TouchableOpacity>
                                    ))
                                  }
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
              <View>
                <Button
                  containerClassName="  bg-primary-default flex-none px-1 "
                  textClassName="line-[30px] text-center text-md font-medium text-white"
                  title={t('send_code')}
                  onPress={handleSubmit(onSubmit)}
                />
              </View>
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}
