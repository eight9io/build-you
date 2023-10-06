import React, { FC, useState } from "react";
<<<<<<< HEAD
import { View, Switch, Text } from "react-native";
=======
import { View, Switch, StyleSheet, Text } from "react-native";
>>>>>>> main

interface ICustomSwitchProps {
  onValueChange?: any;
  textEnable?: string;
  textDisable?: string;
  value?: boolean;
  setValue?: any;
}

const CustomSwitch: FC<ICustomSwitchProps> = ({
  onValueChange,
  textEnable,
  textDisable,
  value,
  setValue,
}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    setValue && setValue("public", !isEnabled);
  };

  return (
    <View className="flex flex-row items-center">
      <Switch
        trackColor={{ false: "#787880", true: "#34C759" }}
        thumbColor={"#FFFFFF"}
        onValueChange={onValueChange || toggleSwitch}
        value={value || isEnabled}
      />
      <Text className="pl-2 text-md font-medium leading-5">
        {isEnabled ? textEnable : textDisable}
      </Text>
    </View>
  );
};

export default CustomSwitch;
