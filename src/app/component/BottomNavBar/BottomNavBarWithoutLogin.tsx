import React, { FC, useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, Platform, Dimensions } from "react-native";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { HomeFeedUnregister } from "../../screen/HomeScreen";
import FeedFillSvg from "./asset/feed-fill.svg";
import FeedSvg from "./asset/feed.svg";
import CreateSvg from "./asset/create.svg";
import ChallengesSvg from "./asset/challenges.svg";
import ProfileSvg from "./asset/profile.svg";
import AlertSvg from "./asset/noti.svg";
import AppTitle from "../common/AppTitle";
import IconSearch from "../common/IconSearch/IconSearch";
import NavButton from "../common/Buttons/NavButton";
import BuildYouLogo from "../../common/svg/buildYou_logo_top_app.svg";

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

interface IBottomNavBarProps {}
const EmptyPage = () => null;

const BottomNavBarWithoutLogin: FC<IBottomNavBarProps> = () => {
  const { t } = useTranslation();
  const [isDesktopView, setIsDesktopView] = useState(false);

  useEffect(() => {
    // Check device width to determine if it's desktop view on the first load
    if (Dimensions.get("window").width <= 768) {
      setIsDesktopView(false);
    } else setIsDesktopView(true);
    // Add event listener to check if the device width is changed when the app is running
    const unsubscribeDimensions = Dimensions.addEventListener(
      "change",
      ({ window }) => {
        if (window.width <= 768) {
          setIsDesktopView(false);
        } else setIsDesktopView(true);
      }
    );

    return () => {
      unsubscribeDimensions.remove();
    };
  }, []);

  if (!isDesktopView)
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          headerTitleAlign: "center",
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            height: 86,
          },
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          tabBarIconStyle: {
            width: "100%", // Make sure the tab bar item stretch in large screens
          },
        }}
      >
        <Tab.Screen
          name="Feed"
          component={HomeFeedUnregister}
          options={({ navigation }) => ({
            headerShown: false,
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

            tabBarIcon: ({ focused }) => (
              <View
                className={clsx("flex flex-col items-center justify-center")}
              >
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
          component={EmptyPage}
          listeners={({ navigation }) => ({
            tabPress: () => {
              navigation.goBack();
              navigation.navigate("LoginScreen");
            },
          })}
          options={() => ({
            tabBarIcon: () => (
              <View
                className={clsx("flex flex-col items-center justify-center")}
              >
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
              <View
                className={clsx("flex flex-col items-center justify-center")}
              >
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
              <View
                className={clsx("flex flex-col items-center justify-center")}
              >
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

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        drawerType: "permanent",
        drawerActiveBackgroundColor: "transparent",
        drawerActiveTintColor: "#FF7B1C",
        drawerItemStyle: {
          marginHorizontal: 8,
          marginBottom: 8,
          marginTop: 0,
          padding: 4,
        },
        drawerStyle: {
          width: 240,
        },
      }}
      drawerContent={(props) => (
        <DrawerContentScrollView {...props}>
          <View className="mb-6 mt-8 pl-5 pr-8">
            <BuildYouLogo />
          </View>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
      )}
    >
      <Drawer.Screen
        name="Feed"
        component={HomeFeedUnregister}
        options={() => ({
          headerShown: false,
          drawerIcon: ({ focused }) => (
            <>
              {focused ? (
                <FeedFillSvg fill={"#FF7B1C"} /> // Set fixed width and height for the svg => Fix svg being cut off
              ) : (
                <FeedSvg fill={"#6C6E76"} />
              )}
            </>
          ),
          drawerLabel: ({ focused }) => (
            <Text
              className={clsx(
                "-ml-5 text-base font-normal text-black-light",
                focused && "font-bold text-primary-default"
              )}
            >
              {t("bottom_nav.feed")}
            </Text>
          ),
        })}
      />
      <Drawer.Screen
        name="Challenges"
        component={EmptyPage}
        listeners={({ navigation }) => ({
          drawerItemPress: () => {
            navigation.goBack();
            navigation.navigate("LoginScreen");
          },
        })}
        options={{
          headerShown: false,
          drawerIcon: () => <ChallengesSvg fill="#6C6E76" />,
          drawerLabel: () => (
            <Text className="-ml-5 text-base font-normal text-black-light">
              {t("bottom_nav.challenges")}
            </Text>
          ),
        }}
      />
      <Drawer.Screen
        name="Create Challenge"
        component={EmptyPage}
        listeners={({ navigation }) => ({
          drawerItemPress: () => {
            navigation.goBack();
            navigation.navigate("LoginScreen");
          },
        })}
        options={{
          drawerIcon: () => <CreateSvg fill="#6C6E76" />,
          drawerLabel: () => (
            <Text className="-ml-5 text-base font-normal text-black-light">
              {t("bottom_nav.create")}
            </Text>
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={EmptyPage}
        listeners={({ navigation }) => ({
          drawerItemPress: () => {
            navigation.goBack();
            navigation.navigate("LoginScreen");
          },
        })}
        options={{
          headerShown: false,
          drawerIcon: () => <AlertSvg fill="#6C6E76" />,
          drawerLabel: () => (
            <Text className="-ml-5 text-base font-normal text-black-light">
              {t("bottom_nav.noti")}
            </Text>
          ),
        }}
      />

      <Drawer.Screen
        name="Profile"
        component={EmptyPage}
        listeners={({ navigation }) => ({
          drawerItemPress: () => {
            navigation.goBack();
            navigation.navigate("LoginScreen");
          },
        })}
        options={{
          headerShown: false,
          drawerIcon: () => <ProfileSvg fill="#6C6E76" />,
          drawerLabel: () => (
            <Text className="-ml-5 text-base font-normal text-black-light">
              {t("bottom_nav.profile")}
            </Text>
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default BottomNavBarWithoutLogin;
