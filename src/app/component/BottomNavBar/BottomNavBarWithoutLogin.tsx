import React, { FC } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, Platform } from "react-native";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import HomeScreen from "../../screen/HomeScreen";
import FeedSvg from "./asset/feed.svg";
import CreateSvg from "./asset/create.svg";
import ChallengesSvg from "./asset/challenges.svg";
import ProfileSvg from "./asset/profile.svg";
import AlertSvg from "./asset/noti.svg";
import AppTitle from "../common/AppTitle";
import IconSearch from "../common/IconSearch/IconSearch";
import NavButton from "../common/Buttons/NavButton";

const Tab = createBottomTabNavigator();

interface IBottomNavBarProps {}
const EmptyPage = () => null;

const BottomNavBarWithoutLogin: FC<IBottomNavBarProps> = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        headerTitleAlign: "center",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          height: Platform.OS === "android" ? 68 : 102,
          paddingBottom: Platform.OS === "android" ? 0 : 30,
        },
        headerRightContainerStyle: {
          paddingRight: 10,
        },
        headerLeftContainerStyle: {
          paddingLeft: 10,
        },
      }}
    >
      <Tab.Screen
        name="Feed"
        component={HomeScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => <AppTitle title={t("your_feed.header")} />,
          headerRight: () => (
            <NavButton
              withIcon
              icon={
                <IconSearch
                  onPress={() => {
                    navigation.goBack();
                    navigation.navigate("LoginScreen");
                  }}
                />
              }
            />
          ),

          tabBarIcon: () => (
            <View className={clsx("flex flex-col items-center justify-center")}>
              <FeedSvg fill={"#FF7B1C"} />
              <Text className="pt-1.5 text-xs font-semibold text-primary-default">
                {t("bottom_nav.feed")}
              </Text>
            </View>
          ),
        })}
      />
      <Tab.Screen
        name="Challenges"
        component={EmptyPage}
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.goBack();
            navigation.navigate("LoginScreen");
          },
        })}
        options={() => ({
          tabBarIcon: () => (
            <View className={clsx("flex flex-col items-center justify-center")}>
              <ChallengesSvg fill="#6C6E76" />
              <Text className="pt-1.5 text-xs font-semibold text-gray-bottomBar">
                {t("bottom_nav.challenges")}
              </Text>
            </View>
          ),
        })}
      />
      <Tab.Screen
        name="Create Challenge"
        component={EmptyPage}
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.goBack();
            navigation.navigate("LoginScreen");
          },
        })}
        options={() => ({
          tabBarIcon: () => (
            <View className={clsx("flex flex-col items-center justify-center")}>
              <CreateSvg fill="#6C6E76" />
              <Text className="pt-1.5 text-xs font-semibold text-gray-bottomBar">
                {t("bottom_nav.create")}
              </Text>
            </View>
          ),
        })}
      />
      <Tab.Screen
        name="Notifications"
        component={EmptyPage}
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.goBack();
            navigation.navigate("LoginScreen");
          },
        })}
        options={() => ({
          tabBarIcon: () => (
            <View className={clsx("flex flex-col items-center justify-center")}>
              <AlertSvg fill="#6C6E76" />
              <Text className="pt-1.5 text-xs font-semibold text-gray-bottomBar">
                {t("bottom_nav.noti")}
              </Text>
            </View>
          ),
        })}
      />
      <Tab.Screen
        name="Profile"
        component={EmptyPage}
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.goBack();
            navigation.navigate("LoginScreen");
          },
        })}
        options={() => ({
          tabBarIcon: () => (
            <View className="flex flex-col items-center justify-center">
              <ProfileSvg fill="#6C6E76" />
              <Text className="pt-1.5 text-xs font-semibold text-gray-bottomBar">
                {t("bottom_nav.profile")}
              </Text>
            </View>
          ),
        })}
      />
    </Tab.Navigator>
  );
};

export default BottomNavBarWithoutLogin;
