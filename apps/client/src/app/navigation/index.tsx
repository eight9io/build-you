/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from './navigation.type';
import AppTitle from '../component/common/AppTitle';

import BottomNavBar from '../component/common/BottomNavBar';

import HomeScreen from '../screen/HomeScreen';
import IntroScreen from '../screen/IntroScreen';
import InnerScreen from '../screen/TestScreen';
import ChallengeDetailScreen from '../screen/ChallengeDetailScreen';
import TabAvvisi from '../screen/TabAvvisi';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigation = () => {
  const { t } = useTranslation();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Intro"
          component={IntroScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Inner" component={InnerScreen} />
        <Stack.Screen
          name="ChallengeDetail"
          component={ChallengeDetailScreen}
          options={{
            headerTitle: () => (
              <AppTitle title={t('challenge_detail_screen.title')} />
            ),
          }}
        />
      </Stack.Navigator>
      {/* <BottomNavBar /> */}
    </NavigationContainer>
  );
};
export default RootNavigation;
