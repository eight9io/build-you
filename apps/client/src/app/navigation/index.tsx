/* eslint-disable jsx-a11y/accessible-emoji */
import { useEffect, useRef, useState } from 'react';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as TaskManager from 'expo-task-manager';
import * as Linking from 'expo-linking';
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
  handleBackgroundNotification,
  handleTapOnIncomingNotification,
  increaseBadgeCount,
  notificationPermissionIsAllowed,
  registerForPushNotificationsAsync,
} from '../utils/notification.util';
import { useNotificationStore } from '../store/notification';
import GlobalDialogController from '../component/common/Dialog/GlobalDialogController';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    // On Android, setting `shouldPlaySound: false` will result in the drop-down notification alert **not** showing, no matter what the priority is.
    // This setting will also override any channel-specific sounds you may have configured.
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
TaskManager.defineTask(
  BACKGROUND_NOTIFICATION_TASK,
  async ({ data, error, executionInfo }) => {
    await handleBackgroundNotification(data);
  }
);

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const prefix = Linking.createURL('/');

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
    setHasNewNotification,
    pushToken,
    revokePushToken,
    getPushToken,
  } = useNotificationStore();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const navigationRef =
    useRef<NavigationContainerRef<RootStackParamList>>(null);

  const logined = getAccessToken();

  const isCompleteProfile: boolean | null = getIsCompleteProfileStore();

  const linking = {
    //If you are using universal links, you need to add your domain to the prefixes as well:
    // prefixes: [Linking.createURL('/'), 'http://localhost:8081'],
    prefixes: [prefix],
    config: {
      screens: {
        NotFound: '*',
        HomeScreen: {
          path: 'home',
          screens: {
            OtherUserProfileChallengeDetailsScreen: {
              path: 'other-user-profile-challenge-details/:id',
              parse: {
                id: (id: string) => navigationRef?.current?.navigate('HomeScreen', { screen: 'OtherUserProfileChallengeDetailsScreen', params: { id } }), 
              },
            },
          },
        },
      },
    },
  };

  const url = Linking.useURL();
  console.log(url);

  // test cmd: npx uri-scheme open exp://127.0.0.1:8081/--/home/other-user-profile-challenge-details/123456 --ios

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

  // Handle notification permission change
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async (nextAppState) => {
        // Get the latest states because of closure
        const hasLogined = getAccessToken();
        const hasCompletedProfile = getIsCompleteProfileStore();
        const currentPushToken = getPushToken();
        if (
          hasLogined &&
          hasCompletedProfile &&
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          // App has come to the foreground => Check notification permission in case user change it in the setting
          const notificationIsPermitted =
            await notificationPermissionIsAllowed();
          if (!notificationIsPermitted && currentPushToken) {
            // Case user turn off notification in the setting then back to the app => revoke push token
            await revokePushToken();
          } else if (notificationIsPermitted && !currentPushToken) {
            // Case user turn on notification in the setting then back to the app => register push token
            try {
              await registerForPushNotificationsAsync(setPushToken);
            } catch (error: AxiosError | any) {
              console.log('error: ', error.response);
              if (error.response.status !== 403)
                GlobalDialogController.showModal({
                  title: 'Alert',
                  message: t(
                    'errorMessage:cannot_register_notification'
                  ) as string,
                });
            }
          }
        }
        appState.current = nextAppState;
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    // Only init notification when user logined and complete profile
    (async () => {
      if (logined && isCompleteProfile && navigationRef?.current)
        await initNotification(navigationRef.current);
    })();
    return () => {
      // cleanup the listener and task registry
      if (notificationListener.current)
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      if (responseListener.current)
        Notifications.removeNotificationSubscription(responseListener.current);
    };
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
        // register task to run whenever is received while the app is in the background
        await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
      } catch (error) {
        console.log('error: ', error);
      }

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
    // listener triggered whenever a notification is received while the app is in the foreground
    notificationListener.current =
      Notifications.addNotificationReceivedListener(async (notification) => {
        console.log('notification: ', notification.request.content.data);
        await increaseBadgeCount();
        setHasNewNotification(true);
      });

    // listener triggered whenever a user taps on a notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        handleTapOnIncomingNotification(response, navigation);
        setHasNewNotification(false); // reset the new notification flag
      });
  };

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
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
