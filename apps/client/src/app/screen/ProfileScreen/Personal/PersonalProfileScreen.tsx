import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { useUserProfileStore } from '../../../store/user-data';

import { RootStackParamList } from '../../../navigation/navigation.type';

import ProfileComponent from '../../../component/Profile';
import AppTitle from '../../../component/common/AppTitle';
import ButtonWithIcon from '../../../component/common/Buttons/ButtonWithIcon';
import { ScrollView } from 'react-native-gesture-handler';

const ProfileStack = createNativeStackNavigator<RootStackParamList>();

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProfileScreen'
>;

interface IProfileProps {
  userName?: string;
  navigation: ProfileScreenNavigationProp;
}

const Profile: React.FC<IProfileProps> = ({ userName, navigation }) => {
  const { getUserProfile } = useUserProfileStore();
  const userProfile = getUserProfile();
  return (
    <SafeAreaView className="justify-content: space-between flex-1 bg-gray-50 ">
      <ScrollView className="w-full bg-gray-50">
        <ProfileComponent userData={userProfile} navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
};

const PersonalProfileScreen = () => {
  const { getUserProfile } = useUserProfileStore();
  const userProfile = getUserProfile();

  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerBackVisible: false,
        headerTitleAlign: 'center',
        headerShown: true,
      }}
    >
      <ProfileStack.Screen
        name="ProfileScreen"
        component={Profile}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => (
            <AppTitle
              title={`${userProfile?.name} ${userProfile?.surname || ''}`}
            />
          ),
          headerRight: (props) => (
            <ButtonWithIcon
              icon="setting"
              onPress={() => navigation.push('SettingsScreen')}
            />
          ),
        })}
      />
    </ProfileStack.Navigator>
  );
};

export default PersonalProfileScreen;
