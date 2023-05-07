import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Swiper from 'react-native-swiper';

// import { useNavigation } from '@react-navigation/native';
// import type { NavigationProp } from '@react-navigation/native';

// import { RootStackParamList } from '../navigation';

export const LoginScreen = () => {
  const { t } = useTranslation();

  return (
    <View className="flex-1 justify-content: space-between">
      <View className="flex-1">
        <Image
          className="w-[100%] h-[100%] rounded-xl z-10"
          source={require('./asset/banner.png')}
          resizeMode="cover"
        />
        <Image
          className="z-20 position: absolute bottom-7 left-[34%]"
          source={require('./asset/logo.png')}
          resizeMode="cover"
        />
        <View className="bg-[#FF7B1C] opacity-40 w-[100%] h-[100%] rounded-xl position: absolute top-3" />
        <View className="bg-[#FFA41B] opacity-30 w-[100%] h-[100%] rounded-xl position: absolute top-5" />
      </View>
      <View className="h-[350px] justify-between items-center mt-7 mb-7 p-5">
        <Text className="font-medium text-[21px] line-[30px] text-center mb-5">
          {t('login_screen.title')}
        </Text>

        <View className="h-[120px]">
          <Swiper className="justify-center">
            <Text className="font-normal text-[16px] line-[22.4px] text-center">
              {t('login_screen.description')}
            </Text>
            <Text className="font-normal text-[16px] line-[22.4px] text-center">
              {t('login_screen.description')}
            </Text>
            <Text className="font-normal text-[16px] line-[22.4px] text-center">
              {t('login_screen.description')}
            </Text>
          </Swiper>
        </View>

        <View className="flex-row">
          <TouchableOpacity className="flex-1 bg-primary h-[48px] justify-center rounded-[24px] mr-1">
            <Text className="line-[30px] text-center text-white">
              {t('login_screen.register')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 border-primary border-[1px] h-[48px] justify-center rounded-[24px] ml-1">
            <Text className="line-[30px] text-center text-primary">
              {t('login_screen.login')}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Text className="text-[#90969E]">
            {t('login_screen.explore_no_account')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
