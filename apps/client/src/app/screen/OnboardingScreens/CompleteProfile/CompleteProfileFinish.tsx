import React, { FC } from 'react';
import { View, Text } from 'react-native';
import clsx from 'clsx';

import { CompleteProfileScreenNavigationProp } from './index';

import BuildYouLogo from './asset/buildYou_logo.svg';
import StarLogo from './asset/auto_awesome.svg';

interface CompleteProfileFinishProps {
  navigation: CompleteProfileScreenNavigationProp;
}

const CompleteProfileFinish: FC<CompleteProfileFinishProps> = ({
  navigation,
}) => {
  return (
    <View className="mt-28 flex h-full flex-col items-center">
      <View className="">
        <BuildYouLogo />
      </View>
      <View className="flex flex-col items-center justify-center pt-32">
        <StarLogo />

        <View>
          <Text className="text-gray-dark text-center text-lg pt-4 mx-12">
            Thank you for your information. We're personalizing your
            experience...
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CompleteProfileFinish;
