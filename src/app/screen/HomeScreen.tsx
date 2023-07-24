/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useCallback, useEffect, useState } from "react";
import { View, FlatList, SafeAreaView, Text } from "react-native";
import clsx from "clsx";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { t } from "i18next";

import { RootStackParamList } from "../navigation/navigation.type";

import OtherUserProfileScreen from "./ProfileScreen/OtherUser/OtherUserProfileScreen";

import AppTitle from "../component/common/AppTitle";
import Button from "../component/common/Buttons/Button";
import FeedPostCard, {
  FeedPostCardUnregister,
} from "../component/Post/FeedPostCard";
import NavButton from "../component/common/Buttons/NavButton";
import IconSearch from "../component/common/IconSearch/IconSearch";

import ShareIcon from "../../../assets/svg/share.svg";
import OtherUserProfileChallengeDetailsScreen from "./ProfileScreen/OtherUser/OtherUserProfileChallengeDetailsScreen";
import { serviceGetFeed, serviceGetFeedUnregistered } from "../service/feed";

import { useGetListFollowing } from "../hooks/useGetUser";
import GlobalDialogController from "../component/common/Dialog/GlobalDialogController";
import { useAuthStore } from "../store/auth-store";
import { useUserProfileStore } from "../store/user-store";
import {
  NavigationProp,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import MainSearchScreen from "./MainSearchScreen/MainSearchScreen";
import ProgressCommentScreen from "./ChallengesScreen/ProgressCommentScreen/ProgressCommentScreen";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { IFeedPostProps } from "../types/common";
import CompanyChallengeDetailScreen from "./ChallengesScreen/CompanyChallengesScreen/CompanyChallengeDetailScreen/CompanyChallengeDetailScreen";
import { useChallengeUpdateStore } from "../store/challenge-update-store";

const HomeScreenStack = createNativeStackNavigator<RootStackParamList>();

export const HomeFeed = () => {
  const [feedPage, setFeedPage] = useState<number>(1);
  const [feedData, setFeedData] = useState<any>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useGetListFollowing();
  // const isFocused = useIsFocused();
  const { getUserProfile } = useUserProfileStore();
  const userData = getUserProfile();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { getChallengeUpdateDetails } = useChallengeUpdateStore();
  const challgeneUpdateDetails = getChallengeUpdateDetails();

  const handleScroll = async () => {
    setIsRefreshing(true);
    await getInitialFeeds();
    setIsRefreshing(false);
  };

  const keyExtractor = useCallback(
    (item: any, index: number) => `${item.id}${index}` as unknown as string,
    []
  );

  const getInitialFeeds = async () => {
    await serviceGetFeed({
      page: 1,
      take: 20,
    })
      .then((res) => {
        if (res.data?.data) {
          setFeedData(res.data.data);
        }
      })
      .catch((err) => {
        GlobalDialogController.showModal({
          title: "Error",
          message:
            t("error_general_message") ||
            "Something went wrong. Please try again later!",
        });
      });
  };

  const getNewFeed = async () => {
    await serviceGetFeed({
      page: feedPage + 1,
      take: 20,
    }).then((res) => {
      if (res?.data?.data) {
        const newResDataIds = res.data.data.map((item: IFeedPostProps) => {
          return item.id;
        });
        // remove duplicate data in response
        const newResData = res.data.data.filter(
          (item: IFeedPostProps, index: number) => {
            return newResDataIds.indexOf(item.id) === index;
          }
        );
        setFeedData((prev: any) => [...prev, ...newResData]);
      }
      setFeedPage((prev) => prev + 1);
    });
  };

  useEffect(() => {
    if (challgeneUpdateDetails) {
      // update feedData according to challgeneUpdateDetails array
      const newFeedData = feedData.map((item: any) => {
        const index = challgeneUpdateDetails.findIndex(
          (challenge: any) => challenge.challengeId === item.challenge.id
        );
        if (index !== -1) {
          return {
            ...item,
            challenge: {
              ...item.challenge,
              goal: challgeneUpdateDetails[index].goal,
            },
          };
        }
        return item;
      });
      setFeedData(newFeedData);
    }
  }, []);

  useEffect(() => {
    getInitialFeeds();
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <FeedPostCard
        itemFeedPostCard={item}
        userId={userData?.id}
        isFocused={true}
        navigation={navigation}
      />
    ),
    []
  );

  return (
    <SafeAreaView className={clsx("bg-white")}>
      <View className={clsx("h-full w-full bg-gray-50 pb-[70px]")}>
        <FlatList
          data={feedData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReached={getNewFeed}
          onEndReachedThreshold={3}
          onRefresh={handleScroll}
          refreshing={isRefreshing}
        />
      </View>
    </SafeAreaView>
  );
};

export const HomeFeedUnregister = () => {
  const [feedData, setFeedData] = useState<any>([]);
  const [feedPage, setFeedPage] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const getInitialFeeds = async () => {
    await serviceGetFeedUnregistered({
      page: 1,
      take: 5,
    })
      .then((res) => {
        if (res.data?.data) {
          setFeedData(res.data.data);
          setFeedPage(1);
        }
      })
      .catch((err) => {
        GlobalDialogController.showModal({
          title: "Error",
          message:
            t("error_general_message") ||
            "Something went wrong. Please try again later!",
        });
      });
  };

  useEffect(() => {
    getInitialFeeds();
  }, []);

  const getNewFeed = async () => {
    await serviceGetFeedUnregistered({
      page: feedPage + 1,
      take: 5,
    }).then((res) => {
      if (res?.data?.data) {
        setFeedData((prev: any) => [...prev, ...res.data.data]);
      }
      setFeedPage((prev) => prev + 1);
    });
  };

  const handleScroll = async () => {
    setIsRefreshing(true);
    await getInitialFeeds();
    setIsRefreshing(false);
  };

  return (
    <SafeAreaView className={clsx("bg-white")}>
      <View className={clsx("h-full w-full bg-gray-50")}>
        <FlatList
          data={feedData}
          renderItem={({ item }) => (
            <FeedPostCardUnregister itemFeedPostCard={item} />
          )}
          keyExtractor={(item) => item.id as unknown as string}
          onEndReached={getNewFeed}
          onEndReachedThreshold={0.5}
          onRefresh={handleScroll}
          refreshing={isRefreshing}
        />
      </View>
    </SafeAreaView>
  );
};

const HomeScreen = ({ navigation }: BottomTabScreenProps<any>) => {
  return (
    <HomeScreenStack.Navigator
      screenOptions={{
        headerBackVisible: false,
        headerTitleAlign: "center",
        headerShown: false,
      }}
    >
      <HomeScreenStack.Screen
        name="FeedScreenUnregister"
        component={HomeFeedUnregister}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => <AppTitle title={t("your_feed.header")} />,
          headerRight: () => (
            <NavButton
              withIcon
              icon={
                <IconSearch
                  onPress={() =>
                    navigation.navigate("CompleteProfileStep3Screen")
                  }
                />
              }
            />
          ),
        })}
      />
      <HomeScreenStack.Screen
        name="FeedScreen"
        component={HomeFeed}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => <AppTitle title={t("your_feed.header")} />,
          headerRight: (props) => (
            <NavButton
              withIcon
              icon={
                <IconSearch
                  onPress={() => navigation.navigate("MainSearchScreen")}
                />
              }
            />
          ),
        })}
      />

      <HomeScreenStack.Screen
        name="MainSearchScreen"
        component={MainSearchScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => (
            <Text className="text-lg font-semibold">Search User</Text>
          ),
          headerSearchBarOptions: {
            hideNavigationBar: false,
          },
          headerLeft: () => (
            <NavButton
              text={t("button.back") as string}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
        })}
      />

      <HomeScreenStack.Screen
        name="OtherUserProfileScreen"
        component={OtherUserProfileScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => "",
          headerLeft: (props) => (
            <NavButton
              text={t("button.back") as string}
              onPress={() => {
                navigation.goBack();
              }}
              withBackIcon
            />
          ),
        })}
      />

      <HomeScreenStack.Screen
        name="OtherUserProfileChallengeDetailsScreen"
        component={OtherUserProfileChallengeDetailsScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => "",
          headerLeft: (props) => (
            <NavButton
              text={t("button.back") as string}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
          headerRight: () => {
            return (
              <View>
                <Button
                  Icon={<ShareIcon />}
                  onPress={() => console.log("press share")}
                />
              </View>
            );
          },
        })}
      />

      <HomeScreenStack.Screen
        name="CompanyChallengeDetailScreen"
        component={CompanyChallengeDetailScreen}
        options={{
          headerShown: true,
          headerTitle: () => "",
          headerLeft: (props) => (
            <NavButton
              text={t("button.back") as string}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
        }}
      />

      <HomeScreenStack.Screen
        name="ProgressCommentScreen"
        component={ProgressCommentScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => "",
          headerLeft: (props) => (
            <NavButton
              text={t("button.back") as string}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
        })}
      />
    </HomeScreenStack.Navigator>
  );
};

export default HomeScreen;
