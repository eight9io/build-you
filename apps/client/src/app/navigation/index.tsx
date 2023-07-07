/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useEffect, useRef, useState } from 'react';
import {
  NavigationContainer,
  NavigationContainerRef,
  useNavigation,
} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as TaskManager from 'expo-task-manager';
import { RootStackParamList } from './navigation.type';

import Header from '../component/common/Header';
import AppTitle from '../component/common/AppTitle';
import NavButton from '../component/common/Buttons/NavButton';
import BottomNavBar from '../component/BottomNavBar/BottomNavBar';

import IntroScreen from '../screen/IntroScreen/IntroScreen';
import SettingsScreen from '../screen/SettingsScreen/SettingsScreen';
import MainSearchScreen from '../screen/MainSearchScreen/MainSearchScreen';
import CompleteProfileScreen from '../screen/OnboardingScreens/CompleteProfile/CompleteProfile';
import PersonalProfileScreenLoading from '../screen/ProfileScreen/Personal/PersonalProfileScreenLoading';
import ProgressCommentScreen from '../screen/ChallengesScreen/ProgressCommentScreen/ProgressCommentScreen';
import EditCompanyProfileScreen from '../screen/ProfileScreen/Company/EditCompanyProfileScreen/EditCompanyProfileScreen';
import EditPersonalProfileScreen from '../screen/ProfileScreen/Personal/EditPersonalProfileScreen/EditPersonalProfileScreen';
import CreateChallengeScreen from '../screen/ChallengesScreen/PersonalChallengesScreen/CreateChallengeScreen/CreateChallengeScreen';
import CreateCompanyChallengeScreen from '../screen/ChallengesScreen/CompanyChallengesScreen/CreateCompanyChallengeScreen/CreateCompanyChallengeScreen';
import CompanyChallengeDetailScreen from '../screen/ChallengesScreen/CompanyChallengesScreen/CompanyChallengeDetailScreen/CompanyChallengeDetailScreen';

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
  handleNewNotification,
  handleTapOnIncomingNotification,
  registerForPushNotificationsAsync,
} from '../utils/notification.util';
import { useNotificationStore } from '../store/notification';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true, // Set to true to display notifications in foreground, issue: https://github.com/expo/expo/issues/20351
    shouldSetBadge: false,
  }),
});

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export const RootNavigation = () => {
  const { t } = useTranslation();
  const [isMainAppLoading, setIsMainAppLoading] = useState<boolean>(true);

  const { setAccessToken, getAccessToken } = useAuthStore();
  const { setIsCompleteProfileStore, getIsCompleteProfileStore } =
    useIsCompleteProfileStore();
  const { setPushToken, setHasNewNotification } = useNotificationStore();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const navigationRef =
    useRef<NavigationContainerRef<RootStackParamList>>(null);
  TaskManager.defineTask(
    BACKGROUND_NOTIFICATION_TASK,
    ({ data, error, executionInfo }) => handleNewNotification(data.notification)
  );

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
    if (logined && isCompleteProfile && navigationRef?.current)
      initNotification(navigationRef.current);
    return () => {
      // cleanup the listener and task registry
      if (notificationListener.current)
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      if (responseListener.current)
        Notifications.removeNotificationSubscription(responseListener.current);
      Notifications.unregisterTaskAsync(BACKGROUND_NOTIFICATION_TASK);
    };
  }, [logined, isCompleteProfile, navigationRef]);

  useEffect(() => {
    if (!isMainAppLoading && isCompleteProfile !== null && logined !== null) {
      const hideSplashScreen = async () => {
        await SplashScreen.hideAsync();
      };
      hideSplashScreen();
      // setTimeout(() => {
      //   hideSplashScreen();
      // }, 700);
    }
  }, [isMainAppLoading, isCompleteProfile]);

  const initNotification = (
    navigation: NavigationContainerRef<RootStackParamList>
  ) => {
    if (!Device.isDevice) return;

    // register task to run whenever is received while the app is in the background
    Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

    registerForPushNotificationsAsync().then((token) => {
      if (token) setPushToken(token);
    });

    // listener triggered whenever a notification is received while the app is in the foreground
    Notifications.addNotificationReceivedListener((notification) => {
      console.log('notification: ', notification.request.content.data);
      setHasNewNotification(true);
    });

    // listener triggered whenever a user taps on a notification
    Notifications.addNotificationResponseReceivedListener((response) => {
      handleTapOnIncomingNotification(response, navigation);
      setHasNewNotification(false); // reset the new notification flag
    });
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
              name="ProgressCommentScreen"
              component={ProgressCommentScreen}
              options={({ navigation }) => ({
                headerShown: true,
                headerTitle: () => '',
                headerLeft: (props) => (
                  <NavButton
                    text={t('button.back') as string}
                    onPress={() => navigation.goBack()}
                    withBackIcon
                  />
                ),
              })}
            />
            <RootStack.Screen
              name="CreateCompanyChallengeScreen"
              component={CreateCompanyChallengeScreen}
              options={{
                headerShown: false,
              }}
            />
            <RootStack.Screen
              name="CompanyChallengeDetailScreen"
              component={CompanyChallengeDetailScreen}
              options={{
                headerShown: false,
              }}
            />

            <RootStack.Screen
              name="SettingsScreen"
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
