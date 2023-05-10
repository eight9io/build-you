import React from 'react';
import { View, Text } from 'react-native';

import clsx from 'clsx';

import Accordition from '../common/Accordition';

const Settings = () => {
  return (
    <View className={clsx('px-7')}>
      <Accordition />
    </View>
  );
};

export default Settings;
