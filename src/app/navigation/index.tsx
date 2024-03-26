import { useEffect, useRef, useState } from "react";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";

import * as Linking from "expo-linking";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as SplashScreen from "expo-splash-screen";
import { CommonActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { RootStackParamList } from "./navigation.type";

import Header from "../component/common/Header";
import AppTitle from "../component/common/AppTitle";
import NavButton from "../component/common/Buttons/NavButton";
import BottomNavBar from "../component/BottomNavBar/BottomNavBar";
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
import { LinkingConfig, isValidDeepLinkPath } from "../utils/linking.util";
import { getLanguageLocalStorage } from "../utils/language";
import i18n from "../i18n/i18n";

import CartScreen from "../screen/ChallengesScreen/CartScreen";
import CompanyCartScreen from "../screen/ChallengesScreen/CompanyCartScreen";
import ChoosePackageScreen from "../screen/ChallengesScreen/ChoosePackageScreen";
import CreateChallengeScreenMain from "../screen/ChallengesScreen/CreateChallengeScreenMain";
import CreateCertifiedChallengeScreen from "../screen/ChallengesScreen/PersonalChallengesScreen/CreateCertifiedChallengeScreen/CreateCertifiedChallengeScreen";
import CreateCertifiedCompanyChallengeScreen from "../screen/ChallengesScreen/CompanyChallengesScreen/CreateCertifiedCompanyChallengeScreen/CreateCertifiedCompanyChallengeScreen";
import { setBadgeCount } from "../utils/notification.util";
import ForgotPasswordConfirmScreen from "../screen/ForgotPassword/ForgotPasswordConfirmScreen";

const RootStack = createNativeStackNavigator<RootStackParamList>();

SplashScreen.preventAutoHideAsync();

export const RootNavigation = () => {
  const { t } = useTranslation();
  const [isHttpAuthHeaderSet, setIsHttpAuthHeaderSet] = useState(false);
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

  useEffect(() => {
    // Get deeplink before isHttpAuthHeaderSet is set to "true" to avoid initial URL to be overwritten by initialRouteName
    const getDeepLinkAsync = async () => {
      const deepLink = await getInitialURL(); // Get the URL that was used to launch the app if it was launched by a link
      const params = Linking.parse(deepLink);
      if (params) {
        const isValidDeepLink = isValidDeepLinkPath(params.path);
        if (!isValidDeepLink) return;
        setDeepLink(params.path);
      }
    };
    getDeepLinkAsync();
  }, []);

  // This useEffect include setting auth token to http header => need to be called after the getDeepLink useEffect
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
        setIsHttpAuthHeaderSet(true);

        getUserProfileAsync().then(({ data: profile }) => {
          const isCompleteProfile = checkIsCompleteProfileOrCompany(profile);
          let navigateToRoute = isCompleteProfile
            ? "HomeScreen"
            : "CompleteProfileScreen";

          getUserAllChallengeIdsAsync(profile?.id);

          // Check if there is history state in local storage, if yes, restore it (this is to handle the case when user reload the page or go back from external link)
          const historyState = JSON.parse(localStorage.getItem("historyState"));
          if (historyState)
            navigationRef.current.dispatch(
              CommonActions.reset({
                ...historyState,
              })
            );
          else
            navigationRef.current.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: navigateToRoute }],
              })
            );
          return profile;
        });
      } else {
        setBadgeCount(0); // Set badge count to 0 in case user reinstall the app and open app in the first time (store data has been cleared when uninstall app)
      }
    }
  }, []);

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
      // Deep link config should be set after setting auth token to http header
      // to avoid react navigation navigate to the route in the deep link before setting auth token to http header
      linking={
        isHttpAuthHeaderSet && {
          ...(LinkingConfig as any),
        }
      }
      onStateChange={async (state) => {
        // Persist navigation state to local storage so that we can restore it later in case user reload page or go back from external link
        localStorage.setItem("historyState", JSON.stringify(state));
      }}
    >
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
            name="ForgotPasswordConfirmScreen"
            component={ForgotPasswordConfirmScreen}
            options={({ navigation }) => ({
              headerShown: false,
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
                  className="ml-3"
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
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  className="ml-3"
                >
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
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  className="ml-3"
                >
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
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  className="ml-3"
                >
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
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  className="ml-3"
                >
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
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  className="ml-3"
                >
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
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  className="ml-3"
                >
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
