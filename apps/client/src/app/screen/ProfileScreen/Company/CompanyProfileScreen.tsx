import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import SettingsScreen from '../../SettingsScreen/SettingsScreen';
import { RootStackParamList } from '../../../navigation/navigation.type';

import MainNavBar from '../../../component/NavBar/MainNavBar';
import Notificaiton from '../../../component/Notification';
import CompanyComponent from '../../../component/Profile/Company';
import AppTitle from '../../../component/common/AppTitle';
import ButtonWithIcon from '../../../component/common/Buttons/ButtonWithIcon';
import Loading from '../../../component/common/Loading';
import { useIsFocused } from '@react-navigation/native';
import { serviceGetMyProfile } from '../../../service/auth';
import { useUserProfileStore } from '../../../store/user-data';
import { FlatList } from 'react-native-gesture-handler';

const CompanyStack = createNativeStackNavigator<RootStackParamList>();

type CompanyScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CompanyProfileScreen'
>;

interface ICompanyProps {
  navigation: CompanyScreenNavigationProp;
}

const Company: React.FC<ICompanyProps> = ({ navigation }) => {
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
    <SafeAreaView className="justify-content: space-between h-full flex-1">
      <View className="h-full">
        <FlatList
          data={[]}
          renderItem={() => <View />}
          ListFooterComponent={() => <View className="h-20" />}
          ListHeaderComponent={
            <CompanyComponent
              userData={userData}
              navigation={navigation}
              setIsLoading={setIsLoading}
            />
          }
        />
        {isLoading && (
          <Loading containerClassName="absolute top-0 left-0 z-10 h-full " />
        )}
      </View>
    </SafeAreaView>
  );
};

const CompanyProfileScreen = () => {
  const { t } = useTranslation();

  return (
    <CompanyStack.Navigator
      screenOptions={{
        headerBackVisible: false,
        headerTitleAlign: 'center',
        headerShown: true,
      }}
    >
      <CompanyStack.Screen
        name="CompanyProfileScreen"
        component={Company}
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
    </CompanyStack.Navigator>
  );
};

export default CompanyProfileScreen;
