/* eslint-disable jsx-a11y/accessible-emoji */
import clsx from "clsx";
import { t } from "i18next";
import {
  NavigationProp,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { View, FlatList, SafeAreaView, Text, Platform } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { isDevice } from "expo-device";

import { RootStackParamList } from "../navigation/navigation.type";
import { IFeedPostProps } from "../types/common";

import { useGetListFollowing } from "../hooks/useGetUser";
import { handleAppOpenOnNotificationPressed } from "../utils/notification.util";
import { serviceGetFeed, serviceGetFeedUnregistered } from "../service/feed";

import { useUserProfileStore } from "../store/user-store";
import { useChallengeUpdateStore } from "../store/challenge-update-store";

import MainSearchScreen from "./MainSearchScreen/MainSearchScreen";
import OtherUserProfileScreen from "./ProfileScreen/OtherUser/OtherUserProfileScreen";
import ProgressCommentScreen from "./ChallengesScreen/ProgressCommentScreen/ProgressCommentScreen";
import CompanyChallengeDetailScreen from "./ChallengesScreen/CompanyChallengesScreen/CompanyChallengeDetailScreen/CompanyChallengeDetailScreen";

import AppTitle from "../component/common/AppTitle";
import FeedPostCard, {
  FeedPostCardUnregister,
} from "../component/Post/FeedPostCard";
import NavButton from "../component/common/Buttons/NavButton";
import IconSearch from "../component/common/IconSearch/IconSearch";
import GlobalDialogController from "../component/common/Dialog/GlobalDialog/GlobalDialogController";
import AdCard from "../component/Post/AdCard";

import PersonalChallengeDetailScreen from "./ChallengesScreen/PersonalChallengesScreen/PersonalChallengeDetailScreen/PersonalChallengeDetailScreen";
import PersonalCoachChallengeDetailScreen from "./ChallengesScreen/CoachChallengesScreen/PersonalCoach/PersonalCoachChallengeDetailScreen";
import { useNotificationStore } from "../store/notification-store";
import OtherUserProfileChallengeDetailsScreen from "./ProfileScreen/OtherUser/OtherUserProfileChallengeDetailsScreen/OtherUserProfileChallengeDetailsScreen";
import { useDeepLinkStore } from "../store/deep-link-store";
import { handleDeepLinkNavigation } from "../utils/linking.util";
import AddNewChallengeProgressScreen from "./ChallengesScreen/AddNewChallengeProgressScreen";
import EditChallengeScreen from "./ChallengesScreen/EditChallengeScreen";
import EditChallengeProgressScreen from "./ChallengesScreen/EditChallengeProgressScreen";
import ConfirmVideoCoachScreen from "./ChallengesScreen/ConfirmVideoCoachScreen";
import CoachRateCompanyChallengeScreen from "./ChallengesScreen/CoachRateCompanyChallengeScreen";
import CoachRateChallengeScreen from "./ChallengesScreen/CoachRateChallengeScreen";
import EditScheduleLinkScreen from "./ChallengesScreen/EditScheduleLinkScreen";
import ScheduleDetailScreen from "./ChallengesScreen/ScheduleDetailScreen";
import CoachCreateScheduleScreen from "./ChallengesScreen/CoachCreateScheduleScreen";
import EditScheduleScreen from "./ChallengesScreen/EditScheduleScreen";
import AddScheduleLinkScreen from "./ChallengesScreen/AddScheduleLinkScreen";
import { RefreshProvider } from "../context/refresh.context";

const HomeScreenStack = createNativeStackNavigator<RootStackParamList>();

export const HomeFeed = () => {
  const [feedPage, setFeedPage] = useState<number>(1);
  const [feedData, setFeedData] = useState<any>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useGetListFollowing();
  const { getUserProfile, getUserAllChallengeIds } = useUserProfileStore();
  const userData = getUserProfile();
  const { getDeepLink } = useDeepLinkStore();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {
    getChallengeUpdateDetails,
    getChallengeUpdateLike,
    getChallengeUpdateComment,
  } = useChallengeUpdateStore();
  const challgeneUpdateDetails = getChallengeUpdateDetails();
  const challgeneUpdateLike = getChallengeUpdateLike();
  const challgeneUpdateComment = getChallengeUpdateComment();
  const currentUserAllChallengeIds = getUserAllChallengeIds();

  const isFocused = useIsFocused();

  const handleScroll = async () => {
    setIsRefreshing(true);
    await getInitialFeeds();
    setIsRefreshing(false);
  };

  const keyExtractor = useCallback(
    (item: any, index: number) => `${item?.id}${index}` as unknown as string,
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
          title: t("dialog.err_title"),
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
          return item?.id;
        });
        // remove duplicate data in response
        const newResData = res.data.data.filter(
          (item: IFeedPostProps, index: number) => {
            return newResDataIds.indexOf(item?.id) === index;
          }
        );
        setFeedData((prev: any) => [...prev, ...newResData]);
      }
      setFeedPage((prev) => prev + 1);
    });
  };

  useEffect(() => {
    if (challgeneUpdateDetails && challgeneUpdateDetails?.length > 0) {
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
  }, [isFocused]);

  useEffect(() => {
    if (isDevice && Platform.OS === "android")
      handleAppOpenOnNotificationPressed(useNotificationStore); // Handle app open on notification pressed when app is killed on Android
    getInitialFeeds();

    // Handle deep link navigation
    const deepLink = getDeepLink();
    if (deepLink) {
      handleDeepLinkNavigation(deepLink);
      return;
    }
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      if (!item?.id) return null;
      if (item?.isAd) return <AdCard item={item} />;

      const isCurrentUserChallenge = currentUserAllChallengeIds?.includes(
        item.challenge.id
      );

      return (
        <FeedPostCard
          itemFeedPostCard={item}
          currentUserId={userData?.id}
          isFocused={true}
          navigation={navigation}
          challgeneUpdateLike={challgeneUpdateLike}
          challengeUpdateComment={challgeneUpdateComment}
          isCurrentUserChallenge={isCurrentUserChallenge}
        />
      );
    },
    [challgeneUpdateLike, challgeneUpdateComment]
  );

  return (
    <SafeAreaView className={clsx("flex-1 bg-white")} testID="home_feed">
      <View className={clsx("h-full w-full bg-gray-50")}>
        <FlatList
          data={feedData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListFooterComponent={<View className={clsx("h-16")} />}
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
          title: t("dialog.err_title"),
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

  const renderItem = ({ item }) => {
    if (!item?.id) return null;
    return <FeedPostCardUnregister itemFeedPostCard={item} />;
  };

  return (
    <SafeAreaView className={clsx("flex-1 bg-white")}>
      <View className={clsx("h-full w-full bg-gray-50 ")}>
        <FlatList
          data={feedData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id as unknown as string}
          ListFooterComponent={<View className={clsx("h-16")} />}
          onEndReached={getNewFeed}
          onEndReachedThreshold={3}
          onRefresh={handleScroll}
          refreshing={isRefreshing}
        />
      </View>
    </SafeAreaView>
  );
};

const HomeScreen = ({ navigation }: BottomTabScreenProps<any>) => {
  return (
    <RefreshProvider>
      <HomeScreenStack.Navigator
        screenOptions={{
          headerBackVisible: false,
          headerTitleAlign: "center",
          headerShown: false,
        }}
      >
        <HomeScreenStack.Screen
          name="FeedScreen"
          component={HomeFeed}
          options={({ navigation }) => ({
            headerShown: true,
            contentStyle: {
              display: "flex",
              justifyContent: "center",
            },
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
              <Text className="text-lg font-semibold">
                {t("main_search_screen.search") || "Search user"}
              </Text>
            ),

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
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  } else {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "FeedScreen" }],
                    });
                  }
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
                onPress={() => {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  } else {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "FeedScreen" }],
                    });
                  }
                }}
                withBackIcon
              />
            ),
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

        <HomeScreenStack.Screen
          name="PersonalChallengeDetailScreen"
          component={PersonalChallengeDetailScreen}
          options={({ navigation }) => ({
            headerShown: true,
            headerTitle: () => "",
            headerLeft: () => (
              <NavButton
                text={t("button.back") as string}
                onPress={() => {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  } else {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "FeedScreen" }],
                    });
                  }
                }}
                withBackIcon
              />
            ),
          })}
        />
        <HomeScreenStack.Screen
          name="PersonalCoachChallengeDetailScreen"
          component={PersonalCoachChallengeDetailScreen}
          options={({ navigation }) => ({
            headerShown: true,
            headerTitle: () => "",
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
          name="AddNewChallengeProgressScreen"
          component={AddNewChallengeProgressScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <HomeScreenStack.Screen
          name="EditChallengeScreen"
          component={EditChallengeScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <HomeScreenStack.Screen
          name="EditChallengeProgressScreen"
          component={EditChallengeProgressScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <HomeScreenStack.Screen
          name="ConfirmVideoCoachScreen"
          component={ConfirmVideoCoachScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <HomeScreenStack.Screen
          name="CoachRateCompanyChallengeScreen"
          component={CoachRateCompanyChallengeScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <HomeScreenStack.Screen
          name="CoachRateChallengeScreen"
          component={CoachRateChallengeScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <HomeScreenStack.Screen
          name="EditScheduleLinkScreen"
          component={EditScheduleLinkScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <HomeScreenStack.Screen
          name="ScheduleDetailScreen"
          component={ScheduleDetailScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <HomeScreenStack.Screen
          name="CoachCreateScheduleScreen"
          component={CoachCreateScheduleScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <HomeScreenStack.Screen
          name="EditScheduleScreen"
          component={EditScheduleScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <HomeScreenStack.Screen
          name="AddScheduleLinkScreen"
          component={AddScheduleLinkScreen}
          options={() => ({
            headerShown: false,
          })}
        />
      </HomeScreenStack.Navigator>
    </RefreshProvider>
  );
};

export default HomeScreen;
