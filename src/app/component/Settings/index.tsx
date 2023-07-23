import React from "react";
import { View, Text } from "react-native";

import clsx from "clsx";

import Accordition from "../common/Accordition/Accordition";
interface ISettingsProps {
  navigation: any;
}
const Settings = ({ navigation }: ISettingsProps) => {
  return (
    <View className={clsx("px-4")}>
      <Accordition navigation={navigation} />
    </View>
  );
};

export default Settings;
