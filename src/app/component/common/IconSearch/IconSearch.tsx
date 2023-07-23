import React, { useMemo } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import SearchIcon from "./asset/search.svg";
interface ISearchIcon {
  onPress?: any;
}
export const IconSearch: React.FC<ISearchIcon> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="flex-row ">
        {/* <SearchIcon /> */}
        <Image source={SearchIcon} />
      </View>
    </TouchableOpacity>
  );
};

export default IconSearch;
