import clsx from "clsx";
import { FC } from "react";
import { FlatList, Text, TouchableOpacity, View, Image } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { IUserData } from "../../../../../types/user";
import { RootStackParamList } from "../../../../../navigation/navigation.type";

import Empty from "../asset/emptyFollow.svg";
interface IFollowingProps {
  following: IUserData[] | null;
  isRefreshing?: boolean;
  getFollowingList?: () => void;
}

const Following: FC<IFollowingProps> = ({
  following = [],
  isRefreshing = false,
  getFollowingList,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <View className="flex-1">
      {following && following.length > 0 ? (
        <FlatList
          data={following}
          contentContainerStyle={{
            paddingBottom: 20,
            paddingTop: 12,
            rowGap: 20,
          }}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={true}
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
          onRefresh={getFollowingList}
          refreshing={isRefreshing}
          ListFooterComponent={<View className="h-20" />}
        />
      ) : null}
      {following && following.length == 0 ? (
        <View className="mt-2 h-full flex-1 items-center justify-center">
          <FlatList
            data={[]}
            renderItem={() => <></>}
            showsVerticalScrollIndicator={true}
            ListFooterComponent={
              <View className="mt-6 items-center justify-center pt-10">
                <Empty />
                <Text className="text-h6 font-light leading-10 text-[#6C6E76]">
                  {t("empty_following")}
                </Text>
              </View>
            }
            onRefresh={getFollowingList}
            refreshing={isRefreshing}
          />
        </View>
      ) : null}
    </View>
  );
};

export default Following;
