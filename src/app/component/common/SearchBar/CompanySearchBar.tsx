import React, { FC, useEffect, useRef, useState } from "react";
import { TextInput, View, Animated, Dimensions, Platform } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

interface ICompanySearchBarProps {
  focused: boolean;
  searchPhrase: string;
  setFocused: (focused: boolean) => void;
  setSearchPhrase: (searchPhrase: string) => void;
}
const { width } = Dimensions.get("window");
const PADDING = 16;
const SEARCH_FULL_WIDTH = width - PADDING * 2; //search_width when unfocused
const SEARCH_SHRINK_WIDTH = width - PADDING - 90; //search_width when focused

const CompanySearchBar: FC<ICompanySearchBarProps> = ({
  focused,
  searchPhrase,
  setFocused,
  setSearchPhrase,
}) => {
  const { t } = useTranslation();
  const inputLength = useRef(new Animated.Value(SEARCH_FULL_WIDTH)).current;

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  return (
    <View className="flex-1 flex-row items-center justify-start px-4">
      <Animated.View
        className="flex flex-1 flex-row items-center rounded-lg bg-gray-200 p-2"
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
          className="mt-1 w-11/12 flex-1 py-1"
          placeholder={t("search_company.placeholder")}
          value={searchPhrase}
          onChangeText={setSearchPhrase}
          onFocus={handleFocus}
          onBlur={handleBlur}
          textAlignVertical="top"
        />
        {/* cross Icon, depending on whether the search bar is focused or not */}
        {searchPhrase !== "" && (
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
      {/* cancel button, depending on whether the search bar is focused or not */}
      {/* {focused && (
        <Button title="Cancel" color="#FF7B1C" onPress={handleCancel} />
      )} */}
    </View>
  );
};

export default CompanySearchBar;
