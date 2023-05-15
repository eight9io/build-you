import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/navigation.type';

import Settings from '../../component/Settings';
import NavBarInnerScreen from '../../component/NavBar/NavBarInnerScreen';

interface INavBarInnerScreenProps {
  navigation: SetingsScreenNavigationProp;
}

export type SetingsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SettingsScreen'
>;

const SettingsScreen: React.FC<INavBarInnerScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView className="justify-content: space-between flex-1 bg-white pt-6">
      <NavBarInnerScreen title="Settings" navigation={navigation} />
      <Settings />
    </SafeAreaView>
  );
};

export default SettingsScreen;
