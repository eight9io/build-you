import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Spinner from 'react-native-loading-spinner-overlay';

import ErrorText from '../../component/common/ErrorText';
import Button from '../../component/common/Buttons/Button';
import TextInput from '../../component/common/Inputs/TextInput';
import AppleLoginButton from '../../component/common/Buttons/AppleLoginButton';
import LinkedInLoginButton from '../../component/common/Buttons/LinkedInLoginButton';
import GoogleLoginButton from '../../component/common/Buttons/GoogleLoginButton';

import { LoginForm } from '../../types/auth';

import { LoginValidationSchema } from '../../Validators/Login.validate';
import { serviceLogin } from '../../service/auth';
import { err_server, errorMessage } from '../../utils/statusCode';

import { useAuthStore } from '../../store/auth-store';
import { addAuthTokensLocalOnLogin } from '../../utils/checkAuth';

import IconApple from './asset/Apple.svg';
import IconEyeOff from './asset/eye-off.svg';
import IconGoogle from './asset/Google.svg';
import IconEyeOn from './asset/icon-eye.svg';
import IconLinkedIn from './asset/LinkedIn.svg';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function Login({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: {
        display: 'none',
      },
    });
  }, [navigation]);
  const { t } = useTranslation(['index', 'errorMessage']);
  const [errMessage, setErrMessage] = useState('');
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginForm>({
    defaultValues: {
      user: '',
      password: '',
    },
    resolver: yupResolver(LoginValidationSchema()),
    reValidateMode: 'onChange',
    mode: 'onSubmit',
  });
  const { setAccessToken, setRefreshToken } = useAuthStore();

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    serviceLogin(data)
      .then((res) => {
        if (res.status == 201) {
          setIsLoading(false);
          setAccessToken(res?.data.authorization || null);
          setRefreshToken(res?.data.refresh || null);
          addAuthTokensLocalOnLogin(
            res?.data.authorization || null,
            res?.data.refresh || null
          );
          setErrMessage('');
        } else {
          setErrMessage(err_server);
        }
      })
      .catch((error) => {
        setErrMessage(errorMessage(error, 'err_login') as string);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const [isLoading, setIsLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  return (
    <SafeAreaView className="relative h-full flex-1 bg-white">
      {isLoading && <Spinner visible={isLoading} />}
      <View className="relative h-full bg-white ">
        <KeyboardAwareScrollView>
          <View className="flex-column h-full justify-between bg-white px-6  pb-14">
            <View>
              <View className="flex-column items-center  ">
                <Image
                  className=" mb-7 mt-10 h-[91px] w-[185px]"
                  source={require('./asset/buildYou.png')}
                  contentFit="cover"
                />
              </View>
              <View className="flex-row">
                {Platform.OS === 'ios' ? <AppleLoginButton /> : null}
                <LinkedInLoginButton />
                {/* <GoogleLoginButton /> */}
              </View>
              <View className="mt-5 flex-row items-center justify-center px-6">
                <View className="bg-black-default h-[0.5px] w-[50%]"></View>
                <Text className="text-gray-dark mx-3 text-base font-normal">
                  {t('register_screen.or')}
                </Text>
                <View className="bg-black-default h-[0.5px] w-[50%]"></View>
              </View>

              {errMessage && (
                <ErrorText
                  containerClassName="justify-center "
                  message={errMessage}
                />
              )}

              <View className="mt-4 flex flex-col ">
                {(
                  t('form', {
                    returnObjects: true,
                  }) as Array<any>
                ).map((item, index) => {
                  if (item.name === 'password' || item.name === 'user') {
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
                                inputMode={
                                  item.name === 'user' ? 'email' : 'text'
                                }
                                rightIcon={
                                  item.name === 'password' &&
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
                                  item.name === 'password' && hidePassword
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
                        {errors[item.name as keyof LoginForm] && (
                          <ErrorText
                            message={
                              errors[item.name as keyof LoginForm]?.message
                            }
                          />
                        )}
                      </View>
                    );
                  } else {
                    return;
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

              <View className="pt-2">
                <Button
                  containerClassName="bg-primary-default flex-none px-1 "
                  textClassName="line-[30px] text-center text-md font-medium text-white"
                  title={t('login_screen.login')}
                  onPress={handleSubmit(onSubmit)}
                />
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
}
