import React, { FC, useState } from 'react';
import { View, Switch, StyleSheet, Text } from 'react-native';

interface ICustomSwitchProps {
  onValueChange?: any;
  textEnable?: string;
  textDisable?: string;
  value?: boolean;
}

const CustomSwitch: FC<ICustomSwitchProps> = ({
  onValueChange,
  textEnable,
  textDisable,
  value,
}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <View className="flex flex-row items-center">
      <Switch
        trackColor={{ false: '#787880', true: '#34C759' }}
        thumbColor={'#FFFFFF'}
        onValueChange={onValueChange || toggleSwitch}
        value={value || isEnabled}
      />
      <Text className="text-md pl-2 font-medium leading-5">
        {isEnabled ? textEnable : textDisable}
      </Text>
    </View>
  );
};

export default CustomSwitch;
