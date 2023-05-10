import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Image, Text, TouchableOpacity } from 'react-native';

import HomeScreen from '../../screen/HomeScreen';
import TabAvvisi from '../../screen/TabAvvisi';
import ProfileScreen from '../../screen/ProfileScreen';

import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator();

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
        name="Feed"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View className={clsx('flex flex-col items-center justify-center')}>
              <Image
                className="h-[18px] w-[18px]"
                source={require('./asset/feed.png')}
              />
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
        name="Sfide"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View className={clsx('flex flex-col items-center justify-center')}>
              <Image
                className="h-[18px] w-[18px]"
                source={require('./asset/sfide.png')}
              />
              <Text
                className={clsx(
                  'text-gray-bottomBar text-md pt-1.5',
                  focused && 'text-primary-default'
                )}
              >
                {t('bottom_nav.sfide')}
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Crea"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View className={clsx('flex flex-col items-center justify-center')}>
              <Image
                className="h-[18px] w-[18px]"
                source={require('./asset/crea.png')}
              />
              <Text
                className={clsx(
                  'text-gray-bottomBar text-md pt-1.5',
                  focused && 'text-primary-default'
                )}
              >
                {t('bottom_nav.crea')}
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Avvisi"
        component={TabAvvisi}
        options={{
          tabBarIcon: ({ focused }) => (
            <View className={clsx('flex flex-col items-center justify-center')}>
              <Image
                className="h-[18px] w-[18px]"
                source={require('./asset/avvisi.png')}
              />
              <Text
                className={clsx(
                  'text-gray-bottomBar text-md pt-1.5',
                  focused && 'text-primary-default'
                )}
              >
                {t('bottom_nav.avvisi')}
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profilo"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View className={clsx('flex flex-col items-center justify-center')}>
              <Image
                className="h-[18px] w-[18px]"
                source={require('./asset/profili.png')}
              />
              <Text
                className={clsx(
                  'text-gray-bottomBar text-md pt-1.5',
                  focused && 'text-primary-default'
                )}
              >
                {t('bottom_nav.profilo')}
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomNavBar;
