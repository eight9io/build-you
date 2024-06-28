import { FC, useEffect, useState } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import {
  BottomTabBar,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

import { View, Text, Dimensions } from "react-native";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import HomeScreen from "../../screen/HomeScreen";
import NotificationsScreen from "../../screen/NotificationsScreen/NotificationsScreen";
import PersonalProfileScreen from "../../screen/ProfileScreen/Personal/PersonalProfileScreen";
import CompanyProfileScreen from "../../screen/ProfileScreen/Company/CompanyProfileScreen";
import PersonalChallengesNavigator from "../../screen/ChallengesScreen/PersonalChallengesScreen/PersonalChallengesNavigator";
import CompanyChallengesScreen from "../../screen/ChallengesScreen/CompanyChallengesScreen/CompanyChallengsNavigator";

import BuildYouLogo from "../../common/svg/buildYou_logo_top_app.svg";
import FeedSvg from "./asset/feed.svg";
import FeedFillSvg from "./asset/feed-fill.svg";
import CreateSvg from "./asset/create.svg";
import CreateFillSvg from "./asset/create-fill.svg";
import ChallengesSvg from "./asset/challenges.svg";
import ChallengesFillSvg from "./asset/challenges-fill.svg";
import ProfileSvg from "./asset/profile.svg";
import ProfileFillSvg from "./asset/profile-fill.svg";
import NotificationIcon from "./asset/noti.svg";
import NotificationFillIcon from "./asset/noti-fill.svg";
import NewNotificationIcon from "../asset/new-notification-icon.svg";

import { useUserProfileStore } from "../../store/user-store";
import { useNotificationStore } from "../../store/notification-store";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/navigation.type";
import { getLastNotiIdFromLocalStorage } from "../../utils/notification.util";
import { getNotifications } from "../../service/notification";
import CreateChallengeScreen from "../../screen/ChallengesScreen/CreateChallengeScreenMain";
import { ScreenWithDrawerWrapper } from "../ScreenWrapper";
import { LAYOUT_THRESHOLD } from "../../common/constants";

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

interface IBottomNavBarProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "BottomNavBar">;
}

const SCREENS_TO_HIDE_TAB_BAR = [
  "PersonalChallengeDetailScreen",
  "CompanyChallengeDetailScreen",
  "ProgressCommentScreen",
  "MainSearchScreen",
  "PersonalCoachChallengeDetailScreen",
  "SettingsScreenRoot",
  "CreateChallengeScreen",
  "CreateCertifiedChallengeScreen",
  "CreateCompanyChallengeScreen",
  "CreateCertifiedCompanyChallengeScreen",
  "ChoosePackageScreen",
  "CartScreen",
  "CompanyCartScreen",
  "EditPersonalProfileScreen",
  "EditCompanyProfileScreen",
  "AddNewChallengeProgressScreen",
  "EditChallengeProgressScreen",
  "EditChallengeScreen",
  "ConfirmVideoCoachScreen",
  "CoachRateCompanyChallengeScreen",
  "CoachRateChallengeScreen",
  "AddHardSkillsScreen",
  "AddManualSkillScreen",
  "EditScheduleLinkScreen",
  "ScheduleDetailScreen",
  "CoachCreateScheduleScreen",
  "EditScheduleScreen",
  "AddScheduleLinkScreen",
  "AddNewEmployeeScreen",
  "AddNewParticipantScreen"
];

const BottomNavBar: FC<IBottomNavBarProps> = () => {
  const { t } = useTranslation();
  const [isDesktopView, setIsDesktopView] = useState(false);
  const [shouldHideTabBar, setShouldHideTabBar] = useState(false);
  const [lastNotiId, setLastNotiId] = useState<string>("");
  const { getNewestNotificationId, setNewestNotificationId } =
    useNotificationStore();

  const { getUserProfile } = useUserProfileStore();
  const { numOfNewNotifications, refreshNumOfNewNotifications } =
    useNotificationStore();
  const currentUser = getUserProfile();
  const isCompany = currentUser && currentUser?.companyAccount;

  const newestNotiId = getNewestNotificationId();

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      if (data.length > 0) {
        setNewestNotificationId(`${data[0]?.id}`);
      }
    } catch (_) {}
  };

  useEffect(() => {
    fetchNotifications();
    getLastNotiIdFromLocalStorage().then((id) => setLastNotiId(id));
  }, []);

  const isUserHasNewNotification =
    numOfNewNotifications > 0 ||
    (lastNotiId !== null &&
      newestNotiId !== null &&
      lastNotiId.toString() !== newestNotiId.toString());

  useEffect(() => {
    // Check device width to determine if it's desktop view on the first load
    if (Dimensions.get("window").width <= LAYOUT_THRESHOLD) {
      setIsDesktopView(false);
    } else setIsDesktopView(true);
    // Add event listener to check if the device width is changed when the app is running
    const unsubscribeDimensions = Dimensions.addEventListener(
      "change",
      ({ window }) => {
        if (window.width <= LAYOUT_THRESHOLD) {
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
        initialRouteName="BottomNavBar"
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: true,
          headerTitleAlign: "center",
          tabBarStyle: {
            display: shouldHideTabBar ? "none" : "flex",
            backgroundColor: "#FFFFFF",
            position: "absolute", // Fix tab bar showing as grey bar but no content during the show/hide process. Reference: https://stackoverflow.com/a/76670272
            height: 86,
          },
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          tabBarIconStyle: {
            width: "100%", // Make sure the tab bar item stretch in large screens
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
        tabBar={(props) => (
          <View
            style={{
              display: shouldHideTabBar ? "none" : "flex",
              backgroundColor: "#FFFFFF",
              position: "relative", // Make sure all the screen is above the tab bar and not be hidden by it
            }}
          >
            <BottomTabBar {...props} />
          </View>
        )}
      >
        <Tab.Screen
          name="Feed"
          component={HomeScreen}
          options={() => ({
            headerShown: false,

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
          component={
            isCompany ? CompanyChallengesScreen : PersonalChallengesNavigator
          }
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <View
                className={clsx("flex flex-col items-center justify-center")}
              >
                {focused ? (
                  <ChallengesFillSvg fill={"#FF7B1C"} />
                ) : (
                  <ChallengesSvg fill={"#6C6E76"} />
                )}
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
          component={CreateChallengeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                className={clsx("flex flex-col items-center justify-center")}
                testID="bottom_nav_bar_create_challenge_btn"
              >
                {focused ? (
                  <CreateFillSvg fill={"#FF7B1C"} />
                ) : (
                  <CreateSvg fill={"#6C6E76"} />
                )}
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
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Notifications"
          component={NotificationsScreen}
          listeners={() => ({
            tabPress: () => {
              if (numOfNewNotifications > 0) refreshNumOfNewNotifications();
            },
          })}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <View
                className={clsx("flex flex-col items-center justify-center")}
              >
                {focused ? (
                  <NotificationFillIcon fill={"#FF7B1C"} />
                ) : isUserHasNewNotification ? (
                  <NewNotificationIcon fill={"#6C6E76"} />
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
              <View
                className={clsx("flex flex-col items-center justify-center")}
                testID="profile_tab_btn"
              >
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
        // component={HomeScreen}
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
      >
        {(props) => (
          <ScreenWithDrawerWrapper>
            <HomeScreen {...props} />
          </ScreenWithDrawerWrapper>
        )}
      </Drawer.Screen>
      <Drawer.Screen
        name="Challenges"
        // component={
        //   isCompany ? CompanyChallengesScreen : PersonalChallengesNavigator
        // }
        options={{
          headerShown: false,
          drawerIcon: ({ focused }) => (
            <>
              {focused ? (
                <ChallengesFillSvg fill={"#FF7B1C"} />
              ) : (
                <ChallengesSvg fill={"#6C6E76"} />
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
              {t("bottom_nav.challenges")}
            </Text>
          ),
        }}
      >
        {(props) => (
          <ScreenWithDrawerWrapper>
            {isCompany ? (
              <CompanyChallengesScreen {...(props as any)} />
            ) : (
              <PersonalChallengesNavigator {...(props as any)} />
            )}
          </ScreenWithDrawerWrapper>
        )}
      </Drawer.Screen>
      <Drawer.Screen
        name="Create Challenge"
        // component={CreateChallengeScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <View testID="bottom_nav_bar_create_challenge_btn">
              {focused ? (
                <CreateFillSvg fill={"#FF7B1C"} />
              ) : (
                <CreateSvg fill={"#6C6E76"} />
              )}
            </View>
          ),
          drawerLabel: ({ focused }) => (
            <Text
              className={clsx(
                "-ml-5 text-base font-normal text-black-light",
                focused && "font-bold text-primary-default"
              )}
            >
              {t("bottom_nav.create")}
            </Text>
          ),
          headerShown: false,
        }}
      >
        {(props) => (
          <ScreenWithDrawerWrapper>
            <CreateChallengeScreen {...(props as any)} />
          </ScreenWithDrawerWrapper>
        )}
      </Drawer.Screen>
      <Drawer.Screen
        name="Notifications"
        // component={NotificationsScreen}
        listeners={() => ({
          drawerItemPress: () => {
            if (numOfNewNotifications > 0) refreshNumOfNewNotifications();
          },
        })}
        options={{
          headerShown: false,
          drawerIcon: ({ focused }) => (
            <>
              {focused ? (
                <NotificationFillIcon fill={"#FF7B1C"} />
              ) : isUserHasNewNotification ? (
                <NewNotificationIcon fill={"#6C6E76"} />
              ) : (
                <NotificationIcon fill={"#6C6E76"} />
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
              {t("bottom_nav.noti")}
            </Text>
          ),
        }}
      >
        {(props) => (
          <ScreenWithDrawerWrapper>
            <NotificationsScreen {...(props as any)} />
          </ScreenWithDrawerWrapper>
        )}
      </Drawer.Screen>

      <Drawer.Screen
        name="Profile"
        // component={!isCompany ? PersonalProfileScreen : CompanyProfileScreen}
        options={{
          headerShown: false,
          drawerIcon: ({ focused }) => (
            <View testID="profile_tab_btn">
              {focused ? (
                <ProfileFillSvg fill={"#FF7B1C"} />
              ) : (
                <ProfileSvg fill={"#6C6E76"} />
              )}
            </View>
          ),
          drawerLabel: ({ focused }) => (
            <Text
              className={clsx(
                "-ml-5 text-base font-normal text-black-light",
                focused && "font-bold text-primary-default"
              )}
            >
              {t("bottom_nav.profile")}
            </Text>
          ),
        }}
      >
        {(props) => (
          <ScreenWithDrawerWrapper>
            {!isCompany ? (
              <PersonalProfileScreen {...(props as any)} />
            ) : (
              <CompanyProfileScreen {...(props as any)} />
            )}
          </ScreenWithDrawerWrapper>
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

export default BottomNavBar;
