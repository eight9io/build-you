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
import GlobalDialogController from "../component/common/Dialog/GlobalDialogController";
import AdCard from "../component/Post/AdCard";

import BuildYouLogo from "../common/svg/buildYou_logo_top_app.svg";
import PersonalChallengeDetailScreen from "./ChallengesScreen/PersonalChallengesScreen/PersonalChallengeDetailScreen/PersonalChallengeDetailScreen";
import PersonalCoachChallengeDetailScreen from "./ChallengesScreen/CoachChallengesScreen/PersonalCoach/PersonalCoachChallengeDetailScreen";
import { useNotificationStore } from "../store/notification-store";
import OtherUserProfileChallengeDetailsScreen from "./ProfileScreen/OtherUser/OtherUserProfileChallengeDetailsScreen/OtherUserProfileChallengeDetailsScreen";

const HomeScreenStack = createNativeStackNavigator<RootStackParamList>();

export const HomeFeed = () => {
  const [feedPage, setFeedPage] = useState<number>(1);
  const [feedData, setFeedData] = useState<any>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useGetListFollowing();
  const { getUserProfile } = useUserProfileStore();
  const userData = getUserProfile();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {
    getChallengeUpdateDetails,
    getChallengeUpdateLike,
    getChallengeUpdateComment,
  } = useChallengeUpdateStore();
  const challgeneUpdateDetails = getChallengeUpdateDetails();
  const challgeneUpdateLike = getChallengeUpdateLike();
  const challgeneUpdateComment = getChallengeUpdateComment();

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
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      if (!item?.id) return null;
      if (item?.isAd) return <AdCard item={item} />;

      return (
        <FeedPostCard
          itemFeedPostCard={item}
          userId={userData?.id}
          isFocused={true}
          navigation={navigation}
          challgeneUpdateLike={challgeneUpdateLike}
          challengeUpdateComment={challgeneUpdateComment}
        />
      );
    },
    [challgeneUpdateLike, challgeneUpdateComment]
  );

  return (
    <SafeAreaView className={clsx("bg-white")} testID="home_feed">
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
    <SafeAreaView className={clsx("bg-white")}>
      <View className={clsx("h-full w-full bg-gray-50 ")}>
        <FlatList
          data={feedData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id as unknown as string}
          ListFooterComponent={<View className={clsx("h-16")} />}
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
        name="FeedScreen"
        component={HomeFeed}
        options={({ navigation }) => ({
          headerShown: true,
          contentStyle: {
            display: "flex",
            justifyContent: "center",
          },
          headerTitle: () => <AppTitle title={t("your_feed.header")} />,
          headerLeft: () => (
            <View className="">
              <BuildYouLogo width={90} />
            </View>
          ),
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
              onPress={() => navigation.goBack()}
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
    </HomeScreenStack.Navigator>
  );
};

export default HomeScreen;
