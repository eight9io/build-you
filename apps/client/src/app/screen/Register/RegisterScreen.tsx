import { View, Text, Image, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import TextInput from '../../component/common/Input/TextInput';
import { CheckBox, Icon } from '@rneui/themed';
import { yupResolver } from '@hookform/resolvers/yup';
import { RegisterValidationSchema } from '../../Validators/Register.validate';
import Button from '../../component/common/Buttons/Button';
import { useNavigation } from '@react-navigation/native';
import PolicyModal from '../../component/modal/PolicyModal';
import RegisterCreating from '../../component/modal/RegisterCreating';
export default function index({ navigation }: { navigation: any }) {
  const { t } = useTranslation();
  const [ruleBtnChecked, setRuleBtnChecked] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    email: string;
    password: string;
    re_password: string;
    check_policy: boolean;
  }>({
    defaultValues: {
      email: '',
      password: '',
      re_password: '',
      check_policy: false,
    },
    resolver: yupResolver(RegisterValidationSchema()),
    reValidateMode: 'onChange',
    mode: 'onSubmit',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalRegisterCreating, setModalRegisterCreating] = useState(true);

  return (
    <SafeAreaView>
      <View className="flex-column h-full justify-between bg-white px-6  pb-14">
        <View>
          <View className="flex-column items-center ">
            <Image
              className=" mb-7 mt-10 h-[91px] w-[185px]"
              source={require('./asset/buildYou.png')}
              resizeMode="cover"
            />
            <Text className="text-h6 text-gray-dark px-24 text-center leading-6 ">
              {t('register_screen.sub_title')}
            </Text>
          </View>
          <View className="mt-4 flex flex-col ">
            {(
              t('register_screen.form', {
                returnObjects: true,
              }) as Array<any>
            ).map((item, index) => {
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
                          onChangeText={onChange}
                          value={value}
                          className="border-gray-medium bg-gray-veryLight flex w-full rounded-[10px] border-[1px] px-3 py-3 text-base font-normal"
                        />
                      </View>
                    )}
                  />
                </View>
              );
            })}
            <Controller
              control={control}
              name="check_policy"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="">
                  <CheckBox
                    title={
                      <View className="gray-black-light ml-3 flex-row flex-wrap  text-sm leading-6 ">
                        <Text className="">{t('register_screen.policy')}</Text>
                        <Text
                          className="cursor-pointer font-medium  underline underline-offset-1"
                          onPress={() => setModalVisible(true)}
                        >
                          {t('register_screen.policy_link')}
                        </Text>
                        <Text className=""> {t('and')} </Text>
                        <Text
                          className="cursor-pointer font-medium underline underline-offset-auto"
                          onPress={() => setModalVisible(true)}
                        >
                          {t('register_screen.terms_link')}
                        </Text>
                        <Text className=""> {t('and')} </Text>
                        <Text
                          className="cursor-pointer  font-medium underline underline-offset-1"
                          onPress={() => setModalVisible(true)}
                        >
                          {t('register_screen.conditions_link')}
                        </Text>
                      </View>
                    }
                    containerStyle={{
                      backgroundColor: 'transparent',

                      paddingLeft: 0,
                      marginTop: 10,
                    }}
                    checked={ruleBtnChecked}
                    onPress={() => setRuleBtnChecked(!ruleBtnChecked)}
                    iconType="material-community"
                    checkedIcon="checkbox-marked"
                    uncheckedIcon="checkbox-blank-outline"
                    checkedColor="blue"
                  />
                </View>
              )}
            />
          </View>
        </View>
        <Button
          containerClassName="  bg-primary-default flex-none px-1 "
          textClassName="line-[30px] text-center text-md font-medium text-white"
          title={t('button.next')}
          onPress={() => {}}
        />
        <PolicyModal
          navigation={navigation}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
        <RegisterCreating
          navigation={navigation}
          modalVisible={modalRegisterCreating}
          setModalVisible={setModalRegisterCreating}
        />
      </View>
    </SafeAreaView>
  );
}
