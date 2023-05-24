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

import SettingsScreen from '../../SettingsScreen';
import { RootStackParamList } from '../../../navigation/navigation.type';

import MainNavBar from '../../../component/NavBar/MainNavBar';
import Notificaiton from '../../../component/Notification';
import CompanyComponent from '../../../component/Profile/Company';

const CompanyStack = createNativeStackNavigator<RootStackParamList>();

type CompanyScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CompanyProfileScreen'
>;

interface ICompanyProps {
  userName?: string;
  navigation: CompanyScreenNavigationProp;
}

const Company: React.FC<ICompanyProps> = ({ userName, navigation }) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="justify-content: space-between flex-1 bg-white pt-6">
      <MainNavBar title={'My profile'} navigation={navigation} />
      <CompanyComponent />
    </SafeAreaView>
  );
};

const CompanyProfileScreen = () => {
  return (
    <CompanyStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <CompanyStack.Screen name="CompanyProfileScreen" component={Company} />
    </CompanyStack.Navigator>
  );
};

export default CompanyProfileScreen;
