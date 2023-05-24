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

import SettingsScreen from '../SettingsScreen';

import MainNavBar from '../../component/NavBar/MainNavBar';
import Notificaiton from '../../component/Notification';
import { RootStackParamList } from '../../navigation/navigation.type';

const NotificationsStack = createNativeStackNavigator<RootStackParamList>();

type NotificationsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'NotificationsScreen'
>;

const Notifications = ({
  navigation,
}: {
  navigation: NotificationsScreenNavigationProp;
}) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="justify-content: space-between flex-1 bg-white pt-6">
      <MainNavBar title={t('top_nav.noti')} navigation={navigation} withSearch/>
      <View>
        <Notificaiton title="New" />
        <Notificaiton title="Previous" isPrevious={true} />
      </View>
    </SafeAreaView>
  );
};

const NotificationsScreen = () => {
  return (
    <NotificationsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <NotificationsStack.Screen
        name="NotificationsScreen"
        component={Notifications}
      />
    </NotificationsStack.Navigator>
  );
};

export default NotificationsScreen;
