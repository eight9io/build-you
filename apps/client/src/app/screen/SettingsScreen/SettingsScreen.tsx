import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from '../../navigation/navigation.type';
import { removeAuthTokensLocalOnLogout } from '../../utils/checkAuth';
import { useAuthStore } from '../../store/auth-store';


import NavBarInnerScreen from '../../component/NavBar/NavBarInnerScreen';
import Button from '../../component/common/Buttons/Button';
import { ScrollView } from 'react-native-gesture-handler';
import { useIsCompleteProfileStore } from '../../store/is-complete-profile';
import AppTitle from '../../component/common/AppTitle';
import NavButton from '../../component/common/Buttons/NavButton';
import Settings from '../../component/Settings';
import PersonalInformationScreen from '../PersonalInformations/PersonalInformationScreen';
import DeleteAccountScreen from '../PersonalInformations/DeleteAccountScreen';
const SettingStack = createNativeStackNavigator<RootStackParamList>();
interface INavBarInnerScreenProps {
  navigation: SetingsScreenNavigationProp;
}

export type SetingsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SettingsScreen'
>;

const Setting: React.FC<INavBarInnerScreenProps> = ({ navigation }) => {
  const { setAccessToken, getAccessToken } = useAuthStore();
  const { setIsCompleteProfileStore } = useIsCompleteProfileStore();

  const { t } = useTranslation();

  const handleLogout = () => {
    removeAuthTokensLocalOnLogout();
    setIsCompleteProfileStore(null);
    setAccessToken(null);
  };

  return (
    <SafeAreaView className="justify-content: space-between flex-1 bg-white">
      {/* <NavBarInnerScreen
        title={t('user_settings_screen.title')}
        navigation={navigation}
      /> */}
      <ScrollView>
        <View className="bg-gray-veryLight flex flex-1 flex-col">
          <Settings navigation={navigation} />
          <View className="w-full bg-white px-4 py-6">
            <View className="h-12">
              <Button
                title={t('user_settings_screen.logout')}
                containerClassName="bg-gray-medium flex-1"
                textClassName="text-white text-md leading-6"
                onPress={() => handleLogout()}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const SettingsScreen = () => {
  const { t } = useTranslation();
  return (
    <SettingStack.Navigator
      screenOptions={{
        headerShown: false,
        headerTitleAlign: 'center',
        headerBackVisible: false,
      }}
    >
      <SettingStack.Screen name="SettingsScreen" component={Setting}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => (
            <AppTitle title={t('user_settings_screen.title')} />
          ),
          headerLeft: (props) => (
            <NavButton
              text={t('button.back') as string}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
        })} />
      <SettingStack.Screen name="PersonalInformationScreen" component={PersonalInformationScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => (
            <AppTitle title={t('personal_information.title')} />
          ),
          headerLeft: (props) => (
            <NavButton
              text={t('button.back') as string}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
        })} />
      <SettingStack.Screen name="DeleteAccountScreen" component={DeleteAccountScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => (
            <AppTitle title={t('delete_account.title')} />
          ),
          headerLeft: (props) => (
            <NavButton
              text={t('button.back') as string}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
        })} />

    </SettingStack.Navigator>
  )
}
export default SettingsScreen;
