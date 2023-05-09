import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Image, Text, TouchableOpacity } from 'react-native';

import IntroScreen from '../../../screen/IntroScreen';
import HomeScreen from '../../../screen/HomeScreen';
import TabAvvisi from '../../../screen/TabAvvisi';

import clsx from 'clsx';


const Tab = createBottomTabNavigator();

function BottomNavBar() {
  return (
    <Tab.Navigator screenOptions={{
      tabBarShowLabel: false,
      tabBarStyle: {
        position: 'absolute',
        backgroundColor: '#FFFFFF',
      }
    }} 
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View className={clsx('flex flex-col items-center justify-center')}>
              <Image
                className="h-[18px] w-[18px]"
                source={require('./asset/view-list.png')}
              />
              <Text className={clsx('text-xs text-gray-bottomBar', focused && 'text-primary-default')}>Home</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen name="Intro" component={IntroScreen} />
      <Tab.Screen name="Avvisi" component={TabAvvisi} />
    </Tab.Navigator>
  );
}

export default BottomNavBar