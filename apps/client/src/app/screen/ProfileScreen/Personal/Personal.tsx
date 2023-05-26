import React from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import SettingsScreen from '../../SettingsScreen/SettingsScreen';
import { RootStackParamList } from '../../../navigation/navigation.type';

import MainNavBar from '../../../component/NavBar/MainNavBar';
import Notificaiton from '../../../component/Notification';
import ProfileComponent from '../../../component/Profile';

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
  const { t } = useTranslation();

  return (
    <SafeAreaView className="justify-content: space-between flex-1 bg-white pt-6">
      <MainNavBar title={'Mario Rossi'} navigation={navigation} />
      <ProfileComponent />
    </SafeAreaView>
  );
};

const ProfileScreen = () => {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ProfileStack.Screen name="ProfileScreen" component={Profile} />
    </ProfileStack.Navigator>
  );
};

export default ProfileScreen;
