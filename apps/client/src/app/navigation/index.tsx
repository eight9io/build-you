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

import LoginModal from '../component/LoginModal';
import CreateChallengeScreen from '../screen/ChallengesScreen/CreateChallengeScreen';
import { View } from 'react-native';
import BackButton from '../component/common/BackButton';
import IconSearch from '../component/common/IconSearch/IconSearch';
import IconSetting from '../component/common/IconSetting/IconSetting';

import Register from '../screen/Register/RegisterScreen';
import AppTitle from '../component/common/AppTitle';
import HardSkillsStep3 from '../screen/HardSkills/HardSkillsStep3';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const placeholder = () => <View />;

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
        <RootStack.Group>
          {/* <RootStack.Screen
            name="IntroScreen"
            component={IntroScreen}
            options={{
              headerShown: false,
            }}
          /> */}
          <RootStack.Screen
            name="RegisterScreen"
            component={Register}
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: () => (
                <AppTitle title={t('register_screen.title')} />
              ),

              headerLeft: (props) => (
                <BackButton
                  onPress={() =>
                    navigation.navigate('IntroScreen', { setModal: true })
                  }
                />
              ),
            })}
          />
        </RootStack.Group>
        <RootStack.Group>
          <RootStack.Screen
            name="SkillStepThreeScreen"
            component={HardSkillsStep3}
            options={{
              headerShown: true,
              headerTitle: () => <AppTitle title={t('modal_skill.title')} />,
              headerLeft: (props) => (
                <BackButton onPress={() => console.log('back')} />
              ),
            }}
          />
        </RootStack.Group>

        {/* <RootStack.Screen name="HomeScreen" component={BottomNavBar} /> */}
        {/* <RootStack.Screen
          name="CreateChallengeScreen"
          component={CreateChallengeScreen}
          options={{
            headerShown: false,  
          }}
        /> */}

        {/* <RootStack.Screen
          name="RegisterScreen"
          component={Register}
          options={{
            headerShown: true,
            headerTitle: () => (
              <Header title={t('challenge_detail_screen.title') || undefined} />
            ),
            headerLeft: (props) => {
              return <BackButton />;
            },
          }}
        /> */}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
export default RootNavigation;
