import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import httpInstance from '../../../utils/http';
import { useUserProfileStore } from '../../../store/user-data';

import { RootStackParamList } from '../../../navigation/navigation.type';

import PersonalProfileScreenLoading from './PersonalProfileScreenLoading';

import ProfileComponent from '../../../component/Profile';
import AppTitle from '../../../component/common/AppTitle';
import ButtonWithIcon from '../../../component/common/Buttons/ButtonWithIcon';

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
  const { getUserProfile } = useUserProfileStore();
  const userProfile = getUserProfile();
  return (
    <SafeAreaView className="justify-content: space-between flex-1 bg-white ">
      <ProfileComponent userData={userProfile} navigation={navigation} />
    </SafeAreaView>
  );
};

const ProfileScreen = () => {
  const [isProfileScreenLoading, setIsProfileScreenLoading] =
    useState<boolean>(true);
  const [userData, setUserData] = useState<any>({});
  const { setUserProfile, getUserProfile } = useUserProfileStore();

  const userProfile = getUserProfile();
  useEffect(() => {
    if (userProfile?.id) {
      setIsProfileScreenLoading(false);
      setUserData(userProfile);
      return;
    }
    httpInstance
      .get('/user/me')
      .then((res) => {
        setUserProfile(res.data);
        setUserData(res.data);
        setIsProfileScreenLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // TODO: add skeleton loading for profile screen

  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isProfileScreenLoading && (
        <ProfileStack.Screen
          name="ProfileScreen"
          component={Profile}
          options={({ navigation }) => ({
            headerShown: true,
            headerTitle: () => (
              <AppTitle
                title={`${userData?.name} ${userData?.surname || ''}`}
              />
            ),
            headerRight: (props) => (
              <ButtonWithIcon
                icon="setting"
                onPress={() => navigation.push('SettingsScreen')}
              />
            ),
          })}
        />
      )}
      {isProfileScreenLoading && (
        <ProfileStack.Screen
          name="ProfileScreenLoading"
          component={PersonalProfileScreenLoading}
          options={{
            headerShown: false,
          }}
        />
      )}
    </ProfileStack.Navigator>
  );
};

export default ProfileScreen;
