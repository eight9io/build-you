import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/navigation.type';

import Settings from '../../component/Settings';
import NavBarInnerScreen from '../../component/NavBar/NavBarInnerScreen';
import Button from '../../component/common/Buttons/Button';

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
      <View className="bg-gray-veryLight flex-1 flex flex-col mt-2">
        <Settings />
        <View className="pt-6 w-full bg-white px-4">
          <View className="h-12">
            <Button
              title="Log out"
              containerClassName="bg-gray-medium flex-1"
              textClassName="text-white text-md leading-6"
              onPress={() => console.log('logout')}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;
