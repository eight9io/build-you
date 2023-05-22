/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from './navigation.type';
import Header from '../component/common/Header';

import BottomNavBar from '../component/BottomNavBar';

import HomeScreen from '../screen/HomeScreen';
import IntroScreen from '../screen/IntroScreen';
import InnerScreen from '../screen/TestScreen';
import ChallengeDetailScreen from '../screen/ChallengesScreen/ChallengeDetailScreen';
import AlertsScreen from '../screen/AlertsScreen';

import CompleteProfileScreen from '../screen/OnboardingScreens/CompleteProfile';

import LoginModal from '../component/modal/LoginModal';
import CreateChallengeScreen from '../screen/ChallengesScreen/CreateChallengeScreen';
import { View } from 'react-native';
import NavButton from '../component/common/Buttons/NavButton';
import IconSearch from '../component/common/IconSearch/IconSearch';
import IconSetting from '../component/common/IconSetting/IconSetting';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigation = () => {
  const { t } = useTranslation();
  return (
    <NavigationContainer>
      {/* <Stack.Navigator>
        <Stack.Screen
          name='Intro'
          component={IntroScreen}
          options={{
            headerShown: false,
          }}
        />
        {/* <Stack.Screen
          name='Home'
          component={HomeScreen}
          options={{
            headerTitle: () => <AppTitle title={t('your_feed.header')} />,
            headerLeft: (props) => (
              <IconSearch onPress={() => console.log('search')} />
            ),
            headerRight: (props) => (
              <IconSetting onPress={() => console.log('setting')} />
            ),
          }}
        /> */}
      {/* <Stack.Screen name='Inner' component={InnerScreen} /> */}
      {/* <Stack.Screen
          name='CreateChallengeScreen'
          component={CreateChallengeScreen}
        />
      </Stack.Navigator> */}

      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* <RootStack.Screen
          name='HomeScreen'
          component={BottomNavBar}
          options={{
            headerShown: false,
            headerTitle: () => (
              <Header title={t('challenge_detail_screen.title') || undefined} />
            ),
            headerLeft: (props) => {
              return <NavButton />;
            },
          }}
        />
        <RootStack.Screen
          name='CreateChallengeScreen'
          component={CreateChallengeScreen}
          options={{
            headerShown: false,
          }}
        /> */}

        <RootStack.Screen
          name="CompleteProfileScreen"
          component={CompleteProfileScreen}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
export default RootNavigation;
