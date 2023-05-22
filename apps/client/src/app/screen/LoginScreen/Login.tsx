import {
  View,
  Text,
  Image,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
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

import IconApple from './asset/Apple.svg';
import IconEyeOn from './asset/icon-eye.svg';
import IconEyeOff from './asset/eye-off.svg';
import IconGoogle from './asset/Google.svg';
import IconLinkedIn from './asset/LinkedIn.svg';
import { LoginValidationSchema } from '../../Validators/Login.validate';
type FormData = {
  email: string;
  password: string;
};
export default function Login({ navigation }: { navigation: any }) {
  const { t } = useTranslation();
  const arrayButton = [
    {
      containerClassName:
        'bg-black-default flex-row  items-center justify-center m-2',

      Icon: <IconApple />,
      onPress: () => {
        console.log('apple');
      },
    },
    {
      containerClassName: 'bg-sky-20 flex-row  items-center justify-center m-2',

      Icon: <IconLinkedIn />,
      onPress: () => {
        console.log('linked');
      },
    },
    {
      containerClassName:
        'bg-sky-default  flex-row  items-center justify-center m-2',

      Icon: <IconGoogle />,
      onPress: () => {
        console.log('google');
      },
    },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(LoginValidationSchema()),
    reValidateMode: 'onChange',
    mode: 'onSubmit',
  });
  const onSubmit = (data: FormData) => {
    console.log(data);
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [modalRegisterCreating, setModalRegisterCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
          <FlatList
            numColumns={3}
            className="mt-3"
            data={arrayButton}
            renderItem={({ item, index }) => (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  margin: 1,
                }}
              >
                <Button
                  key={index}
                  containerClassName={item.containerClassName}
                  Icon={item.Icon}
                  onPress={item.onPress}
                />
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <View className="mt-5 flex-row items-center justify-center px-6">
            <View className="bg-black-default h-[0.5px] w-[50%]"></View>
            <Text className="text-gray-dark mx-3 text-base font-normal">
              {t('register_screen.or')}
            </Text>
            <View className="bg-black-default h-[0.5px] w-[50%]"></View>
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
                            rightIcon={
                              item.name === 'password' &&
                              (!showPassword ? (
                                <TouchableOpacity
                                  onPress={() => setShowPassword(!showPassword)}
                                  className=" mt-[2px]"
                                >
                                  <IconEyeOn />
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity
                                  onPress={() => setShowPassword(!showPassword)}
                                  className=" mt-[2px]"
                                >
                                  <IconEyeOff />
                                </TouchableOpacity>
                              ))
                            }
                            secureTextEntry={
                              item.name === 'password' && showPassword
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
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPasswordScreen')}
          >
            <Text className="text-h6 text-gray-dark my-5 px-24 text-center leading-6">
              {t('forgot_password')}
            </Text>
          </TouchableOpacity>

          <Button
            containerClassName="  bg-primary-default flex-none px-1 "
            textClassName="line-[30px] text-center text-md font-medium text-white"
            title={t('login')}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  input: {
    height: 40,
    padding: 12,
    borderWidth: 1,
  },
});
