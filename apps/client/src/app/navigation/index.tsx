/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useCallback, useEffect, useState } from 'react';
import { Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import * as SplashScreen from 'expo-splash-screen';

import { RootStackParamList } from './navigation.type';

import Header from '../component/common/Header';
import AppTitle from '../component/common/AppTitle';
import NavButton from '../component/common/Buttons/NavButton';
import BottomNavBar from '../component/BottomNavBar/BottomNavBar';

import IntroScreen from '../screen/IntroScreen/IntroScreen';
import ChallengeDetailScreen from '../screen/ChallengesScreen/PersonalChallengesScreen/ChallengeDetailScreen/ChallengeDetailScreen';
import ChallengeDetailScreenViewOnly from '../screen/ChallengeDetailScreen/ChallengeDetailScreenViewOnly/ChallengeDetailScreenViewOnly';
import ChallengeDetailComment from '../screen/ChallengeDetailScreen/ChallengeDetailComment/ChallengeDetailComment';
import NotificationsScreen from '../screen/NotificationsScreen/NotificationsScreen';
import SettingsScreen from '../screen/SettingsScreen/SettingsScreen';

import CompleteProfileScreen from '../screen/OnboardingScreens/CompleteProfile/CompleteProfile';
import CreateChallengeScreen from '../screen/ChallengesScreen/PersonalChallengesScreen/CreateChallengeScreen/CreateChallengeScreen';
import CreateCompanyChallengeScreen from '../screen/ChallengesScreen/CompanyChallengesScreen/CreateCompanyChallengeScreen/CreateCompanyChallengeScreen';
import CompanyChallengeDetailScreen from '../screen/ChallengesScreen/CompanyChallengesScreen/CompanyChallengeDetailScreen/CompanyChallengeDetailScreen';

import Login from '../screen/LoginScreen/LoginScreen';
import Register from '../screen/RegisterScreen/RegisterScreen';
import ForgotPassword from '../screen/ForgotPassword/ForgotPassword';

import { checkUserCompleProfile } from '../utils/checkUserCompleProfile';
import { checkAccessTokenLocal } from '../utils/checkAuth';

import { useAuthStore } from '../store/auth-store';
import { useIsCompleteProfileStore } from '../store/is-complete-profile';

const RootStack = createNativeStackNavigator<RootStackParamList>();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export const RootNavigation = () => {
  const [isMainAppLoading, setIsMainAppLoading] = useState<boolean>(true);

  const { setAccessToken, getAccessToken } = useAuthStore();
  const { setIsCompleteProfileStore, getIsCompleteProfileStore } = useIsCompleteProfileStore();
  
  const logined = getAccessToken();
  const isCompleteProfile = getIsCompleteProfileStore();

  const { t } = useTranslation();

  useEffect(() => {
    checkAccessTokenLocal(setAccessToken);
  }, []);

  useEffect(() => {
    if (logined) {
      checkUserCompleProfile(setIsCompleteProfileStore, setIsMainAppLoading);
    } else {
      setIsMainAppLoading(false);
    }
  }, [logined]);

  useEffect(() => {
    if (!isMainAppLoading && isCompleteProfile !== null) {
      const hideSplashScreen = async () => {
        await SplashScreen.hideAsync();
      };
      setTimeout(() => {
        hideSplashScreen();
      }, 500);
    } 
  }, [isMainAppLoading]);

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
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
              name="CompanyChallengeDetailScreen"
              component={CompanyChallengeDetailScreen}
              options={{
                headerShown: false,
              }}
            />
            <RootStack.Screen
              name="ChallengeDetailScreenViewOnly"
              component={ChallengeDetailScreenViewOnly}
              options={{
                headerShown: false,
              }}
            />
            <RootStack.Screen
              name="ChallengeDetailComment"
              component={ChallengeDetailComment}
              options={{
                headerShown: false,
              }}
            />
            <RootStack.Screen
              name="SettingsScreen"
              component={SettingsScreen}
              options={{
                headerShown: false,
              }}
            />
            <RootStack.Screen
              name="ChallengeDetailScreen"
              component={ChallengeDetailScreen}
              options={{
                headerShown: false,
              }}
            />
            <RootStack.Screen
              name="NotificationsScreen"
              component={NotificationsScreen}
              options={{
                headerShown: false,
              }}
            />
          </>
        )}
        {logined && !isCompleteProfile && (
          <>
            <RootStack.Screen
              name="CompleteProfileScreen"
              component={CompleteProfileScreen}
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
                headerTitle: () => <AppTitle title={t('login')} />,

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
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
export default RootNavigation;
