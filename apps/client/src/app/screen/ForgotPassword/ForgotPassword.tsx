import { View, Image, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import TextInput from '../../component/common/Inputs/TextInput';

import { yupResolver } from '@hookform/resolvers/yup';

import Button from '../../component/common/Buttons/Button';

import ErrorText from '../../component/common/ErrorText';

import ForgotPasswordModal from '../../component/modal/ForgotPasswordModal';
import { ForgotPasswordValidationSchema } from '../../Validators/ForgotPassword.validate';
import { ForgotPasswordForm } from '../../types/auth';
import Loading from '../../component/common/Loading';
import { serviceForgotPassword } from '../../service/auth';
import { err_server, errorMessage } from '../../utils/statusCode';

export default function ForgotPassword({ navigation }: { navigation: any }) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordForm>({
    defaultValues: {
      email: '',
    },
    resolver: yupResolver(ForgotPasswordValidationSchema()),
    reValidateMode: 'onChange',
    mode: 'onSubmit',
  });
  const onSubmit = (data: ForgotPasswordForm) => {
    setIsLoading(true);

    serviceForgotPassword(data?.email as string)
      .then((res) => {
        if (res.status == 200) {
          setModalVisible(true);
          setErrMessage('');
        } else {
          setErrMessage(err_server);
        }
      })
      .catch((error) => {
        setErrMessage(errorMessage(error, 'err_forgot_password') as string);
      })
      .finally(() => {
        setIsLoading(false);
      });
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
              if (item.name === 'email') {
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
                    {errors[item.name as keyof ForgotPasswordForm] && (
                      <ErrorText
                        message={
                          errors[item.name as keyof ForgotPasswordForm]?.message
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
        {watch('email') && (
          <ForgotPasswordModal
            navigation={navigation}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            email={watch('email')}
          />
        )}
      </View>
      {isLoading && (
        <Loading
          containerClassName="absolute top-0 left-0"
          text={t('forgot_password.sub_title') as string}
        />
      )}
    </SafeAreaView>
  );
}
