import { FC, useState } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import {
  BottomTabBar,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { View, Text, Platform } from "react-native";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import HomeScreen from "../../screen/HomeScreen";
import NotificationsScreen from "../../screen/NotificationsScreen/NotificationsScreen";
import PersonalProfileScreen from "../../screen/ProfileScreen/Personal/PersonalProfileScreen";
import CompanyProfileScreen from "../../screen/ProfileScreen/Company/CompanyProfileScreen";
import PersonalChallengesNavigator from "../../screen/ChallengesScreen/PersonalChallengesScreen/PersonalChallengesScreen";
import CompanyChallengesScreen from "../../screen/ChallengesScreen/CompanyChallengesScreen/CompanyChallengesScreen";

import FeedSvg from "./asset/feed.svg";
import FeedFillSvg from "./asset/feed-fill.svg";
import CreateSvg from "./asset/create.svg";
import CreateFillSvg from "./asset/create-fill.svg";
import ChallengesSvg from "./asset/challenges.svg";
import ProfileSvg from "./asset/profile.svg";
import ProfileFillSvg from "./asset/profile-fill.svg";
import NotificationIcon from "./asset/noti.svg";
import NotificationFillIcon from "./asset/noti-fill.svg";
import NewNotificationIcon from "../asset/new-notification-icon.svg";

import { useGetUserData } from "../../hooks/useGetUser";
import { useUserProfileStore } from "../../store/user-store";
import { useNotificationStore } from "../../store/notification-store";

const Tab = createBottomTabNavigator();

interface IBottomNavBarProps {}

const SCREENS_TO_HIDE_TAB_BAR = ["ProgressCommentScreen", "MainSearchScreen"];

const BottomNavBar: FC<IBottomNavBarProps> = () => {
  const { t } = useTranslation();
  const isAndroid = Platform.OS === "android";
  useGetUserData();
  const [shouldHideTabBar, setShouldHideTabBar] = useState(false);

  const { getUserProfile } = useUserProfileStore();
  const { getHasNewNotification } = useNotificationStore();
  const currentUser = getUserProfile();
  const hasNewNotification = getHasNewNotification();
  const isCompany = currentUser && currentUser?.companyAccount;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: true,
        headerTitleAlign: "center",
        tabBarStyle: {
          display: shouldHideTabBar ? "none" : "flex",
          backgroundColor: "#FFFFFF",
          height: isAndroid ? 68 : 102,
          paddingBottom: isAndroid ? 0 : 30,
          position: "absolute", // Fix tab bar showing as grey bar but no content during the show/hide process. Reference: https://stackoverflow.com/a/76670272
        },
        headerRightContainerStyle: {
          paddingRight: 10,
        },
      }}
      screenListeners={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route);
        if (routeName && SCREENS_TO_HIDE_TAB_BAR.includes(routeName)) {
          setShouldHideTabBar(true);
        } else {
          setShouldHideTabBar(false);
        }
        return {};
      }}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      <Tab.Screen
        name="Feed"
        component={HomeScreen}
        options={() => ({
          headerShown: false,

          tabBarIcon: ({ focused }) => (
            <View className={clsx("flex flex-col items-center justify-center")}>
              {focused ? (
                <FeedFillSvg fill={"#FF7B1C"} />
              ) : (
                <FeedSvg fill={"#6C6E76"} />
              )}
              <Text
                className={clsx(
                  "pt-1.5 text-xs font-semibold text-gray-bottomBar",
                  focused && "text-primary-default"
                )}
              >
                {t("bottom_nav.feed")}
              </Text>
            </View>
          ),
        })}
      />
      <Tab.Screen
        name="Challenges"
        component={
          isCompany ? CompanyChallengesScreen : PersonalChallengesNavigator
        }
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View className={clsx("flex flex-col items-center justify-center")}>
              <ChallengesSvg fill={focused ? "#FF7B1C" : "#6C6E76"} />
              <Text
                className={clsx(
                  "pt-1.5 text-xs font-semibold text-gray-bottomBar",
                  focused && "text-primary-default"
                )}
              >
                {t("bottom_nav.challenges")}
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Create Challenge"
        component={() => undefined}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            if (isCompany) navigation.navigate("CreateCompanyChallengeScreen");
            else navigation.navigate("CreateChallengeScreen");
          },
        })}
        options={{
          tabBarIcon: ({ focused }) => (
            <View className={clsx("flex flex-col items-center justify-center")}>
              <CreateSvg fill={"#6C6E76"} />
              <Text
                className={clsx(
                  "pt-1.5 text-xs font-semibold text-gray-bottomBar",
                  focused && "text-primary-default"
                )}
              >
                {t("bottom_nav.create")}
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View className={clsx("flex flex-col items-center justify-center")}>
              {hasNewNotification ? (
                <NewNotificationIcon fill={"#6C6E76"} />
              ) : focused ? (
                <NotificationFillIcon fill={"#FF7B1C"} />
              ) : (
                <NotificationIcon fill={"#6C6E76"} />
              )}
              <Text
                className={clsx(
                  "pt-1.5 text-xs font-semibold text-gray-bottomBar",
                  focused && "text-primary-default"
                )}
              >
                {t("bottom_nav.noti")}
              </Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={!isCompany ? PersonalProfileScreen : CompanyProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View className={clsx("flex flex-col items-center justify-center")}>
              {focused ? (
                <ProfileFillSvg fill={"#FF7B1C"} />
              ) : (
                <ProfileSvg fill={"#6C6E76"} />
              )}
              <Text
                className={clsx(
                  "pt-1.5 text-xs font-semibold text-gray-bottomBar",
                  focused && "text-primary-default"
                )}
              >
                {t("bottom_nav.profile")}
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavBar;
