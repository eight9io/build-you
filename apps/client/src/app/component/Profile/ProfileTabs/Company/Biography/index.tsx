import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import clsx from 'clsx';

const Biography = () => {
  return (
    <View className="justify-content: space-between">
      <View className={clsx(' flex flex-col pr-4')}>
        <Text className={clsx('text-h6 text-gray-dark')}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </Text>
      </View>
    </View>
  );
};

export default Biography;
