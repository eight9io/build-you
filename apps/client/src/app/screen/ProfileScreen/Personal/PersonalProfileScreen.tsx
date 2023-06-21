import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, FlatList, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { useUserProfileStore } from '../../../store/user-data';

import { RootStackParamList } from '../../../navigation/navigation.type';

import ProfileComponent from '../../../component/Profile/ProfileComponent';
import AppTitle from '../../../component/common/AppTitle';
import ButtonWithIcon from '../../../component/common/Buttons/ButtonWithIcon';
import Loading from '../../../component/common/Loading';
import { useIsFocused } from '@react-navigation/native';
import { serviceGetMyProfile } from '../../../service/auth';

const ProfileStack = createNativeStackNavigator<RootStackParamList>();

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProfileScreen'
>;

interface IProfileProps {
  navigation: ProfileScreenNavigationProp;
}

const Profile: React.FC<IProfileProps> = ({ navigation }) => {
  const [shouldNotLoadOnFirstFocus, setShouldNotLoadOnFirstFocus] =
    useState<boolean>(true);

  const isFocused = useIsFocused();
  const { setUserProfile, getUserProfile } = useUserProfileStore();
  useEffect(() => {
    if (!isFocused) return;
    if (shouldNotLoadOnFirstFocus) {
      setShouldNotLoadOnFirstFocus(false);
      return;
    }
    serviceGetMyProfile()
      .then((res) => {
        setUserProfile(res.data);
      })
      .catch((err) => {
        console.error('err', err);
      });
  }, [isFocused]);
  const userData = getUserProfile();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <SafeAreaView className="justify-content: space-between h-full flex-1 bg-gray-50">
      <View className="h-full">
        <ProfileComponent
          userData={userData}
          navigation={navigation}
          setIsLoading={setIsLoading}
        />
        {isLoading && (
          <Loading containerClassName="absolute top-0 left-0 z-10 h-full " />
        )}
      </View>
    </SafeAreaView>
  );
};

const PersonalProfileScreen = () => {
  const { t } = useTranslation();
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
          headerTitle: () => <AppTitle title={t('profile_title')} />,
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
