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
import ChallengeDetailScreen from '../screen/ChallengeDetailScreen';
import TabAvvisi from '../screen/TabAvvisi';
import LoginModal from '../component/LoginModal';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigation = () => {
  const { t } = useTranslation();
  return (
    <NavigationContainer>
      {/* <Stack.Navigator>
        <Stack.Screen
          name="Intro"
          component={IntroScreen}
          options={{
            headerShown: false,
          }}
        />
        {/* <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        /> */}
      {/* <Stack.Screen name="Inner" component={InnerScreen} /> */}
      {/* <Stack.Screen
          name="ChallengeDetail"
          component={ChallengeDetailScreen}
        />
      </Stack.Navigator> */}
      <BottomNavBar />
    </NavigationContainer>
  );
};
export default RootNavigation;
