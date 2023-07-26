import React from "react";
import { TouchableOpacity, View } from "react-native";
import SearchIcon from "./asset/search.svg";
interface ISearchIcon {
  onPress?: any;
}
export const IconSearch: React.FC<ISearchIcon> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} className="p-2 pr-0">
      <View className="flex-row ">
        <SearchIcon />
      </View>
    </TouchableOpacity>
  );
};

export default IconSearch;
