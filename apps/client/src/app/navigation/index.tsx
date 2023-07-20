/* eslint-disable jsx-a11y/accessible-emoji */
import { useEffect, useRef, useState } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import * as SplashScreen from 'expo-splash-screen';
import * as Device from 'expo-device';
import { AxiosError } from 'axios';
import { AppState } from 'react-native';
import { RootStackParamList } from './navigation.type';

import Header from '../component/common/Header';
import AppTitle from '../component/common/AppTitle';
import NavButton from '../component/common/Buttons/NavButton';
import BottomNavBar from '../component/BottomNavBar/BottomNavBar';

import IntroScreen from '../screen/IntroScreen/IntroScreen';
import SettingsScreen from '../screen/SettingsScreen/SettingsScreen';
import CompleteProfileScreen from '../screen/OnboardingScreens/CompleteProfile/CompleteProfile';
import PersonalProfileScreenLoading from '../screen/ProfileScreen/Personal/PersonalProfileScreenLoading';
import EditCompanyProfileScreen from '../screen/ProfileScreen/Company/EditCompanyProfileScreen/EditCompanyProfileScreen';
import EditPersonalProfileScreen from '../screen/ProfileScreen/Personal/EditPersonalProfileScreen/EditPersonalProfileScreen';
import CreateChallengeScreen from '../screen/ChallengesScreen/PersonalChallengesScreen/CreateChallengeScreen/CreateChallengeScreen';
import CreateCompanyChallengeScreen from '../screen/ChallengesScreen/CompanyChallengesScreen/CreateCompanyChallengeScreen/CreateCompanyChallengeScreen';

import Login from '../screen/LoginScreen/LoginScreen';
import Register from '../screen/RegisterScreen/RegisterScreen';
import ForgotPassword from '../screen/ForgotPassword/ForgotPassword';

import { checkUserCompleProfileAndCompany } from '../utils/checkUserCompleProfile';
import { checkAccessTokenLocal } from '../utils/checkAuth';

import { useAuthStore } from '../store/auth-store';
import { useIsCompleteProfileStore } from '../store/is-complete-profile';
import BottomNavBarWithoutLogin from '../component/BottomNavBar/BottomNavBarWithoutLogin';
import GlobalDialog from '../component/common/Dialog/GlobalDialog';
import {
  addNotificationListener,
  registerForPushNotificationsAsync,
} from '../utils/notification.util';
import { useNotificationStore } from '../store/notification';
import GlobalDialogController from '../component/common/Dialog/GlobalDialogController';

const RootStack = createNativeStackNavigator<RootStackParamList>();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export const RootNavigation = () => {
  const { t } = useTranslation();
  const [isMainAppLoading, setIsMainAppLoading] = useState<boolean>(true);
  const appState = useRef(AppState.currentState);
  const { setAccessToken, getAccessToken } = useAuthStore();
  const { setIsCompleteProfileStore, getIsCompleteProfileStore } =
    useIsCompleteProfileStore();
  const {
     _hasHydrated: notificationStoreHasHydrated,
    setPushToken,
    pushToken,
  } = useNotificationStore();
  const navigationRef =
    useRef<NavigationContainerRef<RootStackParamList>>(null);

  const logined = getAccessToken();

  const isCompleteProfile: boolean | null = getIsCompleteProfileStore();

  useEffect(() => {
    checkAccessTokenLocal(setAccessToken);
  }, []);

  useEffect(() => {
    if (logined) {
      setIsCompleteProfileStore(null);
      checkUserCompleProfileAndCompany(
        setIsCompleteProfileStore,
        setIsMainAppLoading
      );
    } else if (!logined && logined !== null) {
      setIsCompleteProfileStore(false);
      setIsMainAppLoading(false);
    }
  }, [logined]);

  useEffect(() => {
    // Only init notification when user logined and complete profile
    (async () => {
      if (logined && isCompleteProfile && navigationRef?.current)
        await initNotification(navigationRef.current);
    })();
  }, [logined, isCompleteProfile, navigationRef]);

  useEffect(() => {
    if (
      !isMainAppLoading &&
      isCompleteProfile !== null &&
      logined !== null &&
      notificationStoreHasHydrated
    ) {
      const hideSplashScreen = async () => {
        await SplashScreen.hideAsync();
      };
      hideSplashScreen();
    }
  }, [isMainAppLoading, isCompleteProfile, notificationStoreHasHydrated]);

  const initNotification = async (
    navigation: NavigationContainerRef<RootStackParamList>
  ) => {
    if (!Device.isDevice) return;

    if (!pushToken) {
      try {
        await registerForPushNotificationsAsync(setPushToken);
      } catch (error: AxiosError | any) {
        console.log('error: ', error.response);
        if (error.response.status !== 403)
          GlobalDialogController.showModal({
            title: 'Alert',
            message: t('errorMessage:cannot_register_notification') as string,
          });
      }
    }
    // Register notification listener
    addNotificationListener(navigation);
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <GlobalDialog />
      <RootStack.Navigator
        screenOptions={{
          headerBackVisible: false,
          headerTitleAlign: 'center',
          headerShown: false,
        }}
      >
        {logined && isCompleteProfile && (
          <>
            <RootStack.Screen
              name="HomeScreen"
              component={BottomNavBar}
              options={{
                headerShown: false,
                headerTitle: () => (
                  <Header
                    title={t('challenge_detail_screen.title') || undefined}
                  />
                ),
                headerLeft: (props) => {
                  return <NavButton />;
                },
              }}
            />
            <RootStack.Screen
              name="CreateChallengeScreen"
              component={CreateChallengeScreen}
              options={{
                headerShown: false,
              }}
            />

            <RootStack.Screen
              name="CreateCompanyChallengeScreen"
              component={CreateCompanyChallengeScreen}
              options={{
                headerShown: false,
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
                headerLeft: (props) => (
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
                headerLeft: (props) => (
                  <NavButton
                    text="Back"
                    onPress={() => navigation.goBack()}
                    withBackIcon
                  />
                ),
              })}
            />
          </>
        )}
        {logined && !isCompleteProfile && isCompleteProfile !== null && (
          <>
            <RootStack.Screen
              name="CompleteProfileScreen"
              component={CompleteProfileScreen}
              options={{
                headerShown: false,
              }}
            />
          </>
        )}

        {logined && isCompleteProfile === null && (
          <>
            <RootStack.Screen
              name="ProfileScreenLoading"
              component={PersonalProfileScreenLoading}
              options={{
                headerShown: false,
              }}
            />
          </>
        )}

        {!logined && (
          <>
            <RootStack.Screen
              name="IntroScreen"
              component={IntroScreen}
              options={{
                headerShown: false,
              }}
            />
            <RootStack.Screen
              name="LoginScreen"
              component={Login}
              options={({ navigation }) => ({
                headerShown: true,
                headerTitle: () => <AppTitle title={t('login_screen.login')} />,

                headerLeft: (props) => (
                  <NavButton
                    text={t('button.back') as string}
                    onPress={() => navigation.navigate('IntroScreen')}
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
                  <AppTitle title={t('register_screen.title')} />
                ),

                headerLeft: (props) => (
                  <NavButton
                    text={t('button.back') as string}
                    onPress={() =>
                      navigation.navigate('IntroScreen', { setModal: true })
                    }
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
                  <AppTitle title={t('forgot_password.title')} />
                ),

                headerLeft: (props) => (
                  <NavButton
                    text={t('button.back') as string}
                    onPress={() => navigation.navigate('LoginScreen')}
                    withBackIcon
                  />
                ),
              })}
            />
            <RootStack.Screen
              name="HomeScreenWithoutLogin"
              component={BottomNavBarWithoutLogin}
              options={{
                headerShown: false,
                headerTitle: () => (
                  <Header
                    title={t('challenge_detail_screen.title') || undefined}
                  />
                ),
                headerLeft: (props) => {
                  return <NavButton />;
                },
              }}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
export default RootNavigation;
