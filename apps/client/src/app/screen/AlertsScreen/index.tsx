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

const AlertsStack = createNativeStackNavigator<RootStackParamList>();

type AlertsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AlertsScreen'
>;

const Alerts = ({
  navigation,
}: {
  navigation: AlertsScreenNavigationProp;
}) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="justify-content: space-between flex-1 bg-white pt-6">
      <MainNavBar title={t('top_nav.alerts')} navigation={navigation} />
      <View>
        <Notificaiton title="New" />
        <Notificaiton title="Previous" isPrevious={true} />
      </View>
    </SafeAreaView>
  );
};

const AlertsScreen = () => {
  return (
    <AlertsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AlertsStack.Screen name="AlertsScreen" component={Alerts} />
      <AlertsStack.Screen name="SettingsScreen" component={SettingsScreen} />
    </AlertsStack.Navigator>
  );
};

export default AlertsScreen;
