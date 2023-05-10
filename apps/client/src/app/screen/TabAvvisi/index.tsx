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

const AvvisiStack = createNativeStackNavigator<RootStackParamList>();

type AvvisiScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Avvisi'
>;

const Avvisi = ({ navigation }: { navigation: AvvisiScreenNavigationProp }) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="justify-content: space-between flex-1 bg-white pt-6">
      <MainNavBar title={t('top_nav.alerts')} navigation={navigation} />
      <View className="pt-6">
        <Notificaiton title="New" />
        <Notificaiton title="Previous" isPrevious={true} />
      </View>
    </SafeAreaView>
  );
};

const TabAvvisi = () => {
  return (
    <AvvisiStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AvvisiStack.Screen name="Avvisi" component={Avvisi} />
      <AvvisiStack.Screen name="Settings" component={SettingsScreen} />
    </AvvisiStack.Navigator>
  );
};

export default TabAvvisi;
