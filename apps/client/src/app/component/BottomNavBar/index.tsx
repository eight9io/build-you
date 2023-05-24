import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Image, Text, TouchableOpacity, Alert } from 'react-native';

import HomeScreen from '../../screen/HomeScreen';
import NotificationsScreen from '../../screen/NotificationsScreen';
import ProfileScreen from '../../screen/ProfileScreen/Personal';
import CompanyProfileScreen from '../../screen/ProfileScreen/Company';
import PersonalChallengesScreen from '../../screen/ChallengesScreen/PersonalChallengesScreen';
import CompanyChallengesScreen from '../../screen/ChallengesScreen/CompanyChallengesScreen';

import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/navigation.type';

import FeedSvg from './asset/feed.svg';
import CreateSvg from './asset/create.svg';
import ChallengesSvg from './asset/challenges.svg';
import ProfileSvg from './asset/profile.svg';
import AlertSvg from './asset/noti.svg';
import AppTitle from '../common/AppTitle';
import IconSearch from '../common/IconSearch/IconSearch';
import IconSetting from '../common/IconSetting/IconSetting';
import { FC } from 'react';

const Tab = createBottomTabNavigator();
const EmptyPage = () => null;

interface IBottomNavBarProps {
  isCompany?: boolean;
}

const BottomNavBar: FC<IBottomNavBarProps> = ({ isCompany = true }) => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: '#FFFFFF',
          height: 100,
        },
      }}
    >
      <Tab.Screen
        name="Feed"
        component={HomeScreen}
        options={{
          headerTitle: () => <AppTitle title={t('your_feed.header')} />,
          headerLeft: (props) => (
            <IconSearch onPress={() => console.log('search')} />
          ),
          headerRight: (props) => (
            <IconSetting onPress={() => console.log('setting')} />
          ),
          tabBarIcon: ({ focused }) => (
            <View className={clsx('flex flex-col items-center justify-center')}>
              <FeedSvg fill={focused ? '#FF7B1C' : '#6C6E76'} />
              <Text
                className={clsx(
                  'text-gray-bottomBar text-md pt-1.5',
                  focused && 'text-primary-default'
                )}
              >
                {t('bottom_nav.feed')}
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Challenges"
        component={
          isCompany ? CompanyChallengesScreen : PersonalChallengesScreen
        }
        options={{
          tabBarIcon: ({ focused }) => (
            <View className={clsx('flex flex-col items-center justify-center')}>
              <ChallengesSvg fill={focused ? '#FF7B1C' : '#6C6E76'} />
              <Text
                className={clsx(
                  'text-gray-bottomBar text-md pt-1.5',
                  focused && 'text-primary-default'
                )}
              >
                {t('bottom_nav.challenges')}
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Create Challenge"
        component={EmptyPage}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            if (isCompany ) navigation.navigate('CreateCompanyChallengeScreen');
            else navigation.navigate('CreateChallengeScreen');
          },
        })}
        options={{
          tabBarIcon: ({ focused }) => (
            <View className={clsx('flex flex-col items-center justify-center')}>
              <CreateSvg fill={focused ? '#FF7B1C' : '#6C6E76'} />
              <Text
                className={clsx(
                  'text-gray-bottomBar text-md pt-1.5',
                  focused && 'text-primary-default'
                )}
              >
                {t('bottom_nav.create')}
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View className={clsx('flex flex-col items-center justify-center')}>
              <AlertSvg fill={focused ? '#FF7B1C' : '#6C6E76'} />
              <Text
                className={clsx(
                  'text-gray-bottomBar text-md pt-1.5',
                  focused && 'text-primary-default'
                )}
              >
                {t('bottom_nav.noti')}
              </Text>
            </View>
          ),
        }}
      />
      {/* <Tab.Screen
        name="Profilo"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View className={clsx('flex flex-col items-center justify-center')}>
              <ProfileSvg fill={focused ? '#FF7B1C' : '#6C6E76'} />
              <Text
                className={clsx(
                  'text-gray-bottomBar text-md pt-1.5',
                  focused && 'text-primary-default'
                )}
              >
                {t('bottom_nav.profile')}
              </Text>
            </View>
          ),
        }}
      /> */}
      <Tab.Screen
        name="Company Profule"
        component={CompanyProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View className={clsx('flex flex-col items-center justify-center')}>
              <ProfileSvg fill={focused ? '#FF7B1C' : '#6C6E76'} />
              <Text
                className={clsx(
                  'text-gray-bottomBar text-md pt-1.5',
                  focused && 'text-primary-default'
                )}
              >
                {t('bottom_nav.profile')}
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavBar;
