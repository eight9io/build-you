import clsx from "clsx";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import SearchSvg from "./asset/search.svg";
import SettingsSvg from "./asset/settings.svg";

interface IButtonWithIconProps {
  icon: "search" | "setting";
  onPress?: () => void;
  testID?: string;
}

const ButtonWithIcon: React.FC<IButtonWithIconProps> = ({ icon, onPress, testID }) => {
  const ImageSourceFromAssets =
    icon === "search" ? <SearchSvg /> : <SettingsSvg />;

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} testID={testID}>
      <View className="flex flex-row items-center">
        {ImageSourceFromAssets}
      </View>
    </TouchableOpacity>
  );
};

export default ButtonWithIcon;
