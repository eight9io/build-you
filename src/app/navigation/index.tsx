import { useEffect, useRef } from "react";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";

import * as Linking from "expo-linking";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, Text, Alert } from "react-native";
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
import { useDeepLinkStore } from "../store/deep-link-store";
import {
  checkIsCompleteProfileOrCompany,
  useUserProfileStore,
} from "../store/user-store";
import NavigatorService from "../utils/navigationService";
import {
  checkTokens,
  setAuthTokenToHttpHeader,
  setupInterceptor,
} from "../utils/refreshToken.util";
import { DeepLink } from "../utils/linking.util";
import { getLanguageLocalStorage } from "../utils/language";
import i18n from "../i18n/i18n";

import CartScreen from "../screen/ChallengesScreen/CartScreen";
import CompanyCartScreen from "../screen/ChallengesScreen/CompanyCartScreen";
import ChoosePackageScreen from "../screen/ChallengesScreen/ChoosePackageScreen";
import CreateChallengeScreenMain from "../screen/ChallengesScreen/CreateChallengeScreenMain";
import CreateCertifiedChallengeScreen from "../screen/ChallengesScreen/PersonalChallengesScreen/CreateCertifiedChallengeScreen/CreateCertifiedChallengeScreen";
import CreateCertifiedCompanyChallengeScreen from "../screen/ChallengesScreen/CompanyChallengesScreen/CreateCertifiedCompanyChallengeScreen/CreateCertifiedCompanyChallengeScreen";
import { setBadgeCount } from "../utils/notification.util";

const RootStack = createNativeStackNavigator<RootStackParamList>();

SplashScreen.preventAutoHideAsync();

export const RootNavigation = () => {
  const { t } = useTranslation();
  const {
    getAccessToken,
    getRefreshToken,
    setAccessToken,
    setRefreshToken,
    logout,
    _hasHydrated: authStoreHydrated,
  } = useAuthStore();
  const {
    getUserProfileAsync,
    onLogout: userProfileStoreOnLogout,
    getUserAllChallengeIdsAsync,
  } = useUserProfileStore();

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
        const isTokensValid = checkTokens({ getAccessToken, getRefreshToken });
        if (!isTokensValid) {
          logout();
          userProfileStoreOnLogout();
        }
        setupInterceptor(
          getRefreshToken,
          () => {
            logout();
            userProfileStoreOnLogout();
          },
          setAccessToken,
          setRefreshToken
        );
        setAuthTokenToHttpHeader(isLoggedin);

        getUserProfileAsync()
          .then(({ data: profile }) => {
            const isCompleteProfile = checkIsCompleteProfileOrCompany(profile);
            let navigateToRoute = isCompleteProfile
              ? "HomeScreen"
              : "CompleteProfileScreen";

            getUserAllChallengeIdsAsync(profile?.id);
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
        setBadgeCount(0); // Set badge count to 0 in case user reinstall the app and open app in the first time (store data has been cleared when uninstall app)
        setTimeout(() => {
          SplashScreen.hideAsync();
        }, 200);
      }
    }
  }, [authStoreHydrated]);

  useEffect(() => {
    const getLanguageFromStorage = async () => {
      const language = await getLanguageLocalStorage();
      if (language) {
        i18n.changeLanguage(language);
      } else {
        i18n.changeLanguage("it");
      }
    };
    getLanguageFromStorage();
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
                  text={t("button.back") || "Back"}
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
          <RootStack.Screen
            name="CreateChallengeScreenMain"
            component={CreateChallengeScreenMain}
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: () => (
                <AppTitle
                  title={t("new_challenge_screen.new_challenge") || ""}
                />
              ),
              headerLeft: ({}) => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text className="text-lg text-primary-default">Cancel</Text>
                </TouchableOpacity>
              ),
            })}
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
                  text={t("button.back") || "Back"}
                  onPress={() => navigation.navigate("IntroScreen")}
                  withBackIcon
                  testID="login_back_btn"
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
                  text={t("button.back") || "Back"}
                  onPress={() => navigation.goBack()}
                  withBackIcon
                  testID="email_registration_back_btn"
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
                  text={t("button.back") || "Back"}
                  onPress={() => navigation.goBack()}
                  withBackIcon
                  testID="forgot_password_back_btn"
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
                <AppTitle
                  title={t("new_challenge_screen.new_challenge") || ""}
                />
              ),
              headerLeft: ({}) => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  testID="user_create_challenge_close_btn"
                >
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
                <AppTitle
                  title={
                    t("new_challenge_screen.new_challenge") || "New challenge"
                  }
                />
              ),
              headerLeft: ({}) => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              ),
            })}
          />
          <RootStack.Screen
            name="CreateCertifiedChallengeScreen"
            component={CreateCertifiedChallengeScreen}
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: () => (
                <AppTitle
                  title={
                    t("new_challenge_screen.new_certified_challenge") ||
                    "New certified challenge"
                  }
                />
              ),
              headerLeft: ({}) => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              ),
            })}
          />
          <RootStack.Screen
            name="CreateCertifiedCompanyChallengeScreen"
            component={CreateCertifiedCompanyChallengeScreen}
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: () => (
                <AppTitle
                  title={
                    t("new_challenge_screen.new_certified_challenge") ||
                    "New certified challenge"
                  }
                />
              ),
              headerLeft: ({}) => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              ),
            })}
          />
          <RootStack.Screen
            name="ChoosePackageScreen"
            component={ChoosePackageScreen}
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: () => (
                <AppTitle
                  title={t("choose_packages_screen.package") || "Packages"}
                />
              ),
              headerLeft: ({}) => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              ),
            })}
          />
          <RootStack.Screen
            name="CartScreen"
            component={CartScreen}
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: () => (
                <AppTitle title={t("cart_screen.title") || "Summary"} />
              ),
              headerLeft: ({}) => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              ),
            })}
          />
          <RootStack.Screen
            name="CompanyCartScreen"
            component={CompanyCartScreen}
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: () => (
                <AppTitle title={t("cart_screen.title") || "Summary"} />
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
