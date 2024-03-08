import { FC } from "react";
import { FlatList, Text, TouchableOpacity, View, Image } from "react-native";

import Empty from "../asset/emptyFollow.svg";
import { useTranslation } from "react-i18next";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../../../navigation/navigation.type";
import { IUserData } from "../../../../../types/user";
import clsx from "clsx";

interface IFollowersProps {
  followers: IUserData[];
  isRefreshing?: boolean;
  getFollowerList?: () => void;
}

const Followers: FC<IFollowersProps> = ({
  followers = [],
  isRefreshing = false,
  getFollowerList,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <View className="flex-1">
      {followers.length > 0 ? (
        <FlatList
          data={followers}
          contentContainerStyle={{
            paddingBottom: 20,
            paddingTop: 12,
            rowGap: 20,
          }}
          showsVerticalScrollIndicator={true}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate("OtherUserProfileScreen", {
                    userId: item.id,
                  })
                }
                className="flex flex-row items-center space-x-3 px-4"
              >
                <View className="relative">
                  <Image
                    className="h-10 w-10 rounded-full"
                    source={require("../asset/avatar-load.png")}
                  />
                  {item?.avatar ? (
                    <Image
                      source={{ uri: item.avatar.trim() }}
                      className={clsx(
                        "absolute left-0  top-0 h-10 w-10  rounded-full"
                      )}
                    />
                  ) : null}
                </View>
                <Text className="text-base font-semibold text-basic-black">
                  {item.name + " " + item.surname}
                </Text>
              </TouchableOpacity>
            );
          }}
          onRefresh={getFollowerList}
          refreshing={isRefreshing}
          ListFooterComponent={<View className="h-20" />}
        />
      ) : null}
      {followers.length == 0 ? (
        <View className="mt-2 h-full flex-1 items-center justify-center">
          <FlatList
            data={[]}
            renderItem={() => <></>}
            showsVerticalScrollIndicator={true}
            ListFooterComponent={
              <View className="mt-6 items-center justify-center pt-10">
                <Empty />
                <Text className="text-h6 font-light leading-10 text-[#6C6E76]">
                  {t("empty_followers")}
                </Text>
              </View>
            }
            onRefresh={getFollowerList}
            refreshing={isRefreshing}
          />
        </View>
      ) : null}
    </View>
  );
};

export default Followers;
