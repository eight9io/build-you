import React, { useMemo } from "react";
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Path, Svg } from "react-native-svg";
import SearchIcon from "./asset/search.svg";
interface ISearchIcon {
  onPress?: any;
}
export const IconSearch: React.FC<ISearchIcon> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="flex-row ">
        <SearchIcon />
      </View>
    </TouchableOpacity>
  );
};

export default IconSearch;
