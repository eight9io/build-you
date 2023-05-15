import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Image, Text, TouchableOpacity, Alert } from 'react-native';

import HomeScreen from '../../screen/HomeScreen';
import AlertsScreen from '../../screen/AlertsScreen';
import ProfileScreen from '../../screen/ProfileScreen';

import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/navigation.type';

import FeedSvg from './asset/feed.svg';
import CreateSvg from './asset/create.svg';
import ChallengesSvg from './asset/challenges.svg';
import ProfileSvg from './asset/profile.svg';
import AlertSvg from './asset/alerts.svg';
import PersonalChallengesScreen from '../../screen/ChallengesScreen/PersonalChallengesScreen';

const Tab = createBottomTabNavigator();
const EmptyPage = () => null;

function BottomNavBar() {
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
        name='Feed'
        component={HomeScreen}
        options={{
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
        name='Challenges'
        component={PersonalChallengesScreen}
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
        name='Create Challenge'
        component={EmptyPage}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('CreateChallengeScreen');
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
        name='Alerts'
        component={AlertsScreen}
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
                {t('bottom_nav.alerts')}
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name='Profilo'
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
      />
    </Tab.Navigator>
  );
}

export default BottomNavBar;
