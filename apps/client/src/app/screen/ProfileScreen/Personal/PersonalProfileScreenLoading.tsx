import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import BuildYouLogo from '../../../common/svg/buildYou_logo.svg';
import StarLogo from '../../../common/svg/auto_awesome.svg';

const PersonalProfileScreenLoading = () => {
  const { t } = useTranslation();
  return (
    <SafeAreaView className="mt-28 flex h-full flex-col items-center">
      <View className="">
        <BuildYouLogo />
      </View>
      <View className="flex flex-col items-center justify-center pt-32">
        <StarLogo />

        <View>
          <Text className="text-gray-dark text-md mx-12 pt-4 text-center font-normal">
            Welcome
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PersonalProfileScreenLoading;
