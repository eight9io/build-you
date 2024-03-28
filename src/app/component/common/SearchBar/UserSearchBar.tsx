import React, { useEffect, useRef, useState } from "react";
import { TextInput, View, Animated, Dimensions } from "react-native";
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
    <View className="m-[15] flex-row items-center justify-start">
      <Animated.View
        className="relative flex flex-1 flex-row items-center rounded-lg bg-gray-200"
        style={[
          {
            width: inputLength,
            alignSelf: "center",
          },
          focused === true ? undefined : { justifyContent: "center" },
        ]}
      >
        {/* search Icon */}
        <View className="absolute left-2">
          <Feather name="search" size={18} color="#6C6E76" className="" />
        </View>
        {/* Input field */}
        <TextInput
          className="w-full rounded-lg px-8 py-4"
          placeholder="Search"
          value={searchPhrase}
          onChangeText={setSearchPhrase}
          onFocus={handleFocus}
          textAlignVertical="top"
        />
        {/* cross Icon, depending on whether the search bar is focused or not */}
        {searchPhrase !== "" ? (
          <View className="absolute right-2">
            <Entypo
              name="cross"
              size={20}
              color="#6C6E76"
              className="p-[1]"
              onPress={() => {
                setSearchPhrase("");
              }}
            />
          </View>
        ) : null}
      </Animated.View>
      {/* cancel button, depending on whether the search bar is focused or not */}
      {/* {focused && (
        <Button title="Cancel" color="#FF7B1C" onPress={handleCancel} />
      )} */}
    </View>
  );
};

export default UserSearchBar;
