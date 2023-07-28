import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";

import * as Linking from "expo-linking";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as SplashScreen from "expo-splash-screen";
import { CommonActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { RootStackParamList } from "./navigation.type";

import Header from "../component/common/Header";
import AppTitle from "../component/common/AppTitle";
import NavButton from "../component/common/Buttons/NavButton";
import BottomNavBar from "../component/BottomNavBar/BottomNavBar";
import GlobalDialog from "../component/common/Dialog/GlobalDialog";
import BottomNavBarWithoutLogin from "../component/BottomNavBar/BottomNavBarWithoutLogin";

import Login from "../screen/LoginScreen/LoginScreen";
import IntroScreen from "../screen/IntroScreen/IntroScreen";
import Register from "../screen/RegisterScreen/RegisterScreen";
import ForgotPassword from "../screen/ForgotPassword/ForgotPassword";
import SettingsScreen from "../screen/SettingsScreen/SettingsScreen";
import CompleteProfileScreen from "../screen/OnboardingScreens/CompleteProfile/CompleteProfile";
import EditCompanyProfileScreen from "../screen/ProfileScreen/Company/EditCompanyProfileScreen/EditCompanyProfileScreen";
import EditPersonalProfileScreen from "../screen/ProfileScreen/Personal/EditPersonalProfileScreen/EditPersonalProfileScreen";
import CreateChallengeScreen from "../screen/ChallengesScreen/PersonalChallengesScreen/CreateChallengeScreen/CreateChallengeScreen";
import CreateCompanyChallengeScreen from "../screen/ChallengesScreen/CompanyChallengesScreen/CreateCompanyChallengeScreen/CreateNewCompanyChallenge";

import { useAuthStore } from "../store/auth-store";
import {
  checkIsCompleteProfileOrCompany,
  useUserProfileStore,
} from "../store/user-store";
import NavigatorService from "../utils/navigationService";
import {
  setAuthTokenToHttpHeader,
  setupInterceptor,
} from "../utils/refreshToken.util";
import { DeepLink } from "../utils/linking.util";
import { useDeepLinkStore } from "../store/deep-link-store";
import { addNotificationListener } from "../utils/notification.util";
import { useNotificationStore } from "../store/notification-store";

const RootStack = createNativeStackNavigator<RootStackParamList>();

SplashScreen.preventAutoHideAsync();

export const RootNavigation = () => {
  const { t } = useTranslation();
  const {
    getAccessToken,
    getRefreshToken,
    logout,
    _hasHydrated: authStoreHydrated,
  } = useAuthStore();
  const { getUserProfileAsync, onLogout: userProfileStoreOnLogout } =
    useUserProfileStore();

  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>();
  const isLoggedin = getAccessToken();

  const isNavigationReadyRef = useRef(false);
  const { setDeepLink } = useDeepLinkStore();

  const getInitialURL = async () => {
    const url = await Linking.getInitialURL();
    if (url) {
      isNavigationReadyRef.current = true;
    }
    return url;
  };

  const link = {
    ...DeepLink,
    getInitialURL,
  };

  useEffect(() => {
    if (authStoreHydrated) {
      if (!!isLoggedin) {
        if (navigationRef.current)
          setupInterceptor(getRefreshToken, () => {
            logout();
            userProfileStoreOnLogout();
          });
        setAuthTokenToHttpHeader(isLoggedin);

        getUserProfileAsync()
          .then(({ data: profile }) => {
            const isCompleteProfile = checkIsCompleteProfileOrCompany(profile);
            let navigateToRoute = isCompleteProfile
              ? "HomeScreen"
              : "CompleteProfileScreen";
            if (isCompleteProfile && isNavigationReadyRef?.current) {
              return profile;
            } else if (!isCompleteProfile) {
              //get challenge id from deep link
              link.getInitialURL().then((url) => {
                if (url) {
                  const challengeId = url.split("/").pop();
                  if (challengeId) {
                    setDeepLink({
                      challengeId,
                    });
                  }
                }
              });
            }

            navigationRef.current.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: navigateToRoute }],
              })
            );
            return profile;
          })
          .finally(() => {
            setTimeout(() => {
              SplashScreen.hideAsync();
            }, 200);
          });
      } else {
        SplashScreen.hideAsync();
      }
    }
  }, [authStoreHydrated]);

  useEffect(() => {
    const unsubscribe = addNotificationListener(navigationRef.current, useNotificationStore);
    return () => {
      unsubscribe();
    }
  }, []);

  return (
    <NavigationContainer
      ref={(navigation: NavigationContainerRef<RootStackParamList>) => {
        NavigatorService.setContainer(navigation);
        navigationRef.current = navigation;
      }}
      linking={isLoggedin && (link as any)}
    >
      <GlobalDialog />
      <RootStack.Navigator
        initialRouteName="IntroScreen"
        screenOptions={{
          headerBackVisible: false,
          headerTitleAlign: "center",
          headerShown: false,
        }}
      >
        <RootStack.Group>
          <RootStack.Screen
            name="IntroScreen"
            component={IntroScreen}
            options={{
              headerShown: false,
            }}
          />

          <RootStack.Screen
            name="HomeScreen"
            component={BottomNavBar}
            options={{
              headerShown: false,
              headerTitle: () => (
                <Header
                  title={t("challenge_detail_screen.title") || undefined}
                />
              ),
            }}
          />

          <RootStack.Screen
            name="SettingsScreenRoot"
            component={SettingsScreen}
          />

          <RootStack.Screen
            name="EditPersonalProfileScreen"
            component={EditPersonalProfileScreen}
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: () => <AppTitle title="Edit profile" />,
              headerLeft: () => (
                <NavButton
                  text="Back"
                  onPress={() => navigation.goBack()}
                  withBackIcon
                />
              ),
            })}
          />
          <RootStack.Screen
            name="EditCompanyProfileScreen"
            component={EditCompanyProfileScreen}
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: () => <AppTitle title="Edit profile" />,
              headerLeft: () => (
                <NavButton
                  text="Back"
                  onPress={() => navigation.goBack()}
                  withBackIcon
                />
              ),
            })}
          />

          <RootStack.Screen
            name="CompleteProfileScreen"
            component={CompleteProfileScreen}
            options={{
              headerShown: false,
            }}
          />
          <RootStack.Screen
            name="HomeScreenWithoutLogin"
            component={BottomNavBarWithoutLogin}
            options={{
              headerShown: false,
              headerTitle: () => (
                <Header
                  title={t("challenge_detail_screen.title") || undefined}
                />
              ),
              headerLeft: () => {
                return <NavButton />;
              },
            }}
          />
        </RootStack.Group>

        <RootStack.Group screenOptions={{ presentation: "modal" }}>
          <RootStack.Screen
            name="LoginScreen"
            component={Login}
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: () => <AppTitle title={t("login_screen.login")} />,

              headerLeft: (props) => (
                <NavButton
                  text={t("button.back")}
                  onPress={() => navigation.navigate("IntroScreen")}
                  withBackIcon
                />
              ),
            })}
          />
          <RootStack.Screen
            name="RegisterScreen"
            component={Register}
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: () => (
                <AppTitle title={t("register_screen.title")} />
              ),

              headerLeft: () => (
                <NavButton
                  text={t("button.back")}
                  onPress={() => navigation.goBack()}
                  withBackIcon
                />
              ),
            })}
          />

          <RootStack.Screen
            name="ForgotPasswordScreen"
            component={ForgotPassword}
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: () => (
                <AppTitle title={t("forgot_password.title")} />
              ),

              headerLeft: () => (
                <NavButton
                  text={t("button.back")}
                  onPress={() => navigation.goBack()}
                  withBackIcon
                />
              ),
            })}
          />

          <RootStack.Screen
            name="CreateChallengeScreen"
            component={CreateChallengeScreen}
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: () => (
                <AppTitle title={t("new_challenge_screen.title") || ""} />
              ),
              headerLeft: ({}) => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              ),
            })}
          />

          <RootStack.Screen
            name="CreateCompanyChallengeScreen"
            component={CreateCompanyChallengeScreen}
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: () => (
                <AppTitle title={t("new_challenge_screen.title") || ""} />
              ),
              headerLeft: ({}) => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              ),
            })}
          />
        </RootStack.Group>
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
export default RootNavigation;
