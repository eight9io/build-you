import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from '../../navigation/navigation.type';
import { removeAuthTokensLocalOnLogout } from '../../utils/checkAuth';
import { useAuthStore } from '../../store/auth-store';

import Settings from '../../component/Settings';
import NavBarInnerScreen from '../../component/NavBar/NavBarInnerScreen';
import Button from '../../component/common/Buttons/Button';
import { ScrollView } from 'react-native-gesture-handler';
import { useIsCompleteProfileStore } from '../../store/is-complete-profile';

interface INavBarInnerScreenProps {
  navigation: SetingsScreenNavigationProp;
}

export type SetingsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SettingsScreen'
>;

const SettingsScreen: React.FC<INavBarInnerScreenProps> = ({ navigation }) => {
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
          <Settings />
          <View className="w-full bg-white px-4 pt-6">
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

export default SettingsScreen;
