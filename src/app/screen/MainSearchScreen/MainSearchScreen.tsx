import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  ListRenderItem,
} from "react-native";
import { Image } from "expo-image";

import { useDebounce } from "../../hooks/useDebounce";
import { ISearchUserData } from "../../types/user";
import { servieGetUserOnSearch } from "../../service/search";

import clsx from "clsx";
import { RootStackParamList } from "../../navigation/navigation.type";
import { useUserProfileStore } from "../../store/user-store";
import UserSearchBar from "../../component/common/SearchBar/UserSearchBar";

const MainSearchScreen = () => {
  const [isSearchLoadinging, setIsSearchLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [searchResults, setSearchResults] = useState<
    ISearchUserData[] | undefined
  >(undefined);
  const [isSearchBarFocused, setIsSearchBarFocused] = useState<boolean>(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  const debouncedSearchQuery = useDebounce(searchText, 500); // Adjust the delay as needed
  const { getUserProfile } = useUserProfileStore();
  const userData = getUserProfile();

  useEffect(() => {
    if (debouncedSearchQuery) {
      setIsSearchLoading(true);
      servieGetUserOnSearch(debouncedSearchQuery).then((results) => {
        setIsSearchLoading(false);
        setSearchResults(results);
      });
    } else {
      setSearchResults(undefined);
    }
  }, [debouncedSearchQuery]);

  const navigateToUserDetail = (userId: string) => {
    if (userData?.id === userId) {
      navigation.navigate("HomeScreen", {
        screen: "Profile",
        params: {
          screen: "PersonalProfileScreen",
        },
      });
      return;
    }
    navigation.navigate("OtherUserProfileScreen", { userId });
  };

  const renderItem: ListRenderItem<ISearchUserData> = ({
    item,
  }: {
    item: ISearchUserData;
  }) => {
    if (!item?.id) return null;
    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.8}
        onPress={() => navigateToUserDetail(item.id)}
        className="flex flex-1 bg-white px-5 py-3"
      >
        <View className="relative flex flex-1 flex-row items-center">
          {!item.avatar && (
            <Image
              className={clsx("h-12 w-12 rounded-full")}
              source={require("../../common/image/avatar-load.png")}
            />
          )}
          {item?.avatar && (
            <Image
              source={{ uri: item.avatar }}
              className="h-12 w-12 rounded-full"
            />
          )}
          <Text className="flex-1 pl-4 text-base font-semibold text-basic-black">
            {item.name} {item.surname}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="h-full flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <UserSearchBar
          focused={isSearchBarFocused}
          setFocused={setIsSearchBarFocused}
          searchPhrase={searchText}
          setSearchPhrase={setSearchText}
        />
        <View className="flex flex-1">
          {searchResults && searchResults.length > 0 && !isSearchLoadinging && (
            <View className="flex-1">
              <FlatList
                data={searchResults}
                className="flex flex-1 flex-col bg-white"
                renderItem={renderItem}
                keyExtractor={(item) => item.id + Math.random().toString()}
              />
            </View>
          )}
          {searchResults &&
            searchResults.length === 0 &&
            !isSearchLoadinging && (
              <View className="flex flex-1 items-center pt-6">
                <Text className="text-lg font-semibold text-gray-600">
                  {t("search_screen.no_result")}
                </Text>
              </View>
            )}

          {isSearchLoadinging && (
            <View className="flex flex-1 items-center justify-center">
              <ActivityIndicator size="large" />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MainSearchScreen;
