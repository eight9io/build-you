/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screen/HomeScreen';
import IntroScreen from '../screen/IntroScreen';
import InnerScreen from '../screen/TestScreen';

export type RootStackParamList = {
  Intro: undefined;
  Home: undefined;
  Inner: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigation = () => {
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default RootNavigation;
