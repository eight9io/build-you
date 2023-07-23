import {
  NavigationProp,
  StackActions,
  useNavigation,
} from "@react-navigation/native";
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

import NavButton from "../../component/common/Buttons/NavButton";
import { useDebounce } from "../../hooks/useDebounce";
import { ISearchUserData } from "../../types/user";
import { servieGetUserOnSearch } from "../../service/search";

import clsx from "clsx";
import { RootStackParamList } from "../../navigation/navigation.type";
import { useUserProfileStore } from "../../store/user-data";

const MainSearchScreen = () => {
  const [isSearchLoadinging, setIsSearchLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<
    ISearchUserData[] | undefined
  >(undefined);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const isAndroid = Platform.OS === "android";

  const debouncedSearchQuery = useDebounce(searchText, 500); // Adjust the delay as needed
  const { getUserProfile } = useUserProfileStore();
  const userData = getUserProfile();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => (
        <Text className="text-lg font-semibold">Search User</Text>
      ),
      headerSearchBarOptions: {
        placeholder: t("search_screen.search") as string,
        onChangeText: (text: any) => {
          setSearchText(text.nativeEvent.text);
        },
        visible: true,
        focus: true,
        shouldShowHintSearchIcon: true,
        hideNavigationBar: false,
        tintColor: "#FF7B1C",
      },

      headerLeft: () => (
        <NavButton
          text={t("button.back") as string}
          onPress={() => navigation.goBack()}
          withBackIcon
        />
      ),
    });
  }, []);

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
    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.8}
        onPress={() => navigateToUserDetail(item.id)}
        className="flex items-center bg-white px-5 py-3"
      >
        <View className="relative flex flex-1 flex-row">
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
            {item.name}
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
        <View className="flex flex-1">
          {searchResults && searchResults.length > 0 && !isSearchLoadinging && (
            <View className="flex-1">
              <FlatList
                data={searchResults}
                className="flex flex-col bg-white"
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
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
