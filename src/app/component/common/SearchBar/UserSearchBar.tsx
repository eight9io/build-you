import React, { useRef } from "react";
import {
  TextInput,
  View,
  Keyboard,
  Button,
  Animated,
  Dimensions,
} from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const PADDING = 16;
const SEARCH_FULL_WIDTH = width - PADDING * 2; //search_width when unfocused
const SEARCH_SHRINK_WIDTH = width - PADDING - 90; //search_width when focused

const UserSearchBar = ({
  focused,
  searchPhrase,
  setFocused,
  setSearchPhrase,
}) => {
  const inputLength = useRef(new Animated.Value(SEARCH_FULL_WIDTH)).current;

  const handleFocus = () => {
    setFocused(true);
  };

  return (
    <View className="m-[15] w-[90%] flex-row items-center justify-start">
      <Animated.View
        className={`flex flex-row items-center rounded-lg bg-gray-200 p-[6]`}
        style={[
          {
            width: inputLength,
            alignSelf: "center",
          },
          focused === true ? undefined : { justifyContent: "center" },
        ]}
      >
        {/* search Icon */}
        <Feather name="search" size={18} color="#6C6E76" className="ml-[6]" />
        {/* Input field */}
        <TextInput
          style={{
            marginLeft: 10,
          }}
          className="w-11/12 flex-1 py-1"
          placeholder="Search"
          value={searchPhrase}
          onChangeText={setSearchPhrase}
          onFocus={handleFocus}
          textAlignVertical="top"
        />
        {/* cross Icon, depending on whether the search bar is focused or not */}
        {focused && (
          <Entypo
            name="cross"
            size={20}
            color="#6C6E76"
            className="p-[1]"
            onPress={() => {
              setSearchPhrase("");
            }}
          />
        )}
      </Animated.View>
    </View>
  );
};

export default UserSearchBar;
