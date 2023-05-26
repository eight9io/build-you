import React, { FC, useState } from 'react';
import { View, Switch, StyleSheet, Text } from 'react-native';

interface ICustomSwitchProps {
  onValueChange?: any;
  textEnable?: string;
  textDisable?: string;
}

const CustomSwitch: FC<ICustomSwitchProps> = ({
  onValueChange,
  textEnable,
  textDisable,
}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <View className='flex flex-row items-center'>
      <Switch
        trackColor={{ false: '#787880', true: '#34C759' }}
        thumbColor={'#FFFFFF'}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
      <Text className='pl-2 text-md font-medium leading-5'>{isEnabled ? textEnable : textDisable}</Text>
    </View>
  );
};

export default CustomSwitch;
