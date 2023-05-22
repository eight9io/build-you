/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from './navigation.type';
import Header from '../component/common/Header';

import BottomNavBar from '../component/BottomNavBar';

import IntroScreen, { LoginScreen } from '../screen/IntroScreen';
import ChallengeDetailScreen from '../screen/ChallengesScreen/ChallengeDetailScreen';
import AlertsScreen from '../screen/AlertsScreen';

import CompleteProfileScreen from '../screen/OnboardingScreens/CompleteProfile';

import CreateChallengeScreen from '../screen/ChallengesScreen/CreateChallengeScreen';
import NavButton from '../component/common/Buttons/NavButton';

import Register from '../screen/RegisterScreen/RegisterScreen';
import Login from '../screen/LoginScreen/Login';
import ForgotPassword from '../screen/ForgotPassword';
import AppTitle from '../component/common/AppTitle';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigation = () => {
  const { t } = useTranslation();

  const accessToken = false;

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {accessToken ? (
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
              name="CompleteProfileScreen"
              component={CompleteProfileScreen}
            />
            <RootStack.Screen
              name="ChallengeDetailScreen"
              component={ChallengeDetailScreen}
              options={{
                headerShown: false,
              }}
            />
            <RootStack.Screen
              name="AlertsScreen"
              component={AlertsScreen}
              options={{
                headerShown: false,
              }}
            />
          </>
        ) : (
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
                    onPress={() =>
                      navigation.navigate('IntroScreen', { setModal: true })
                    }
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
