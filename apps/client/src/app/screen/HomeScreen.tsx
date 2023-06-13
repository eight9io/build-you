/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Image,
  FlatList,
  SafeAreaView,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/navigation.type';

import FeedPostCard from '../component/Post/FeedPostCard';
import clsx from 'clsx';
import MainNavBar from '../component/NavBar/MainNavBar';
import { useTranslation } from 'react-i18next';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { t } from 'i18next';
import AppTitle from '../component/common/AppTitle';
import NavButton from '../component/common/Buttons/NavButton';
import IconSearch from '../component/common/IconSearch/IconSearch';
import CompanyChallengeDetailScreen from './ChallengesScreen/CompanyChallengesScreen/CompanyChallengeDetailScreen/CompanyChallengeDetailScreen';
import ChallengeDetailScreenViewOnly from './ChallengeDetailScreen/ChallengeDetailScreenViewOnly/ChallengeDetailScreenViewOnly';
const HomeScreenStack = createNativeStackNavigator<RootStackParamList>();
export const HomeFeed = () => {
  const [whatsNextYCoord, setWhatsNextYCoord] = useState<number>(0);
  const scrollViewRef = useRef<null | ScrollView>(null);

  const t = useTranslation().t;

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const arrayPost = [
    {
      id: '1',
      avatar: 'avata',
      name: 'Marco Rossi',
      time: '1 hour ago',
      stt: "I finally bought the equipment for my challenge. Mont Blanc I'm coming!!! 🧗🏻‍♂️",
      card: {
        image: 'https://picsum.photos/200/300',
        title: 'Climbing Mont Blanc',
        builder: 'Marco Rossi',
      },
      like: 5,
      comment: 0,
    },
    {
      id: '2',
      avatar: 'avata',
      name: 'Marco Rossi22',
      time: '1 hour ago',
      stt: "I finally bought the equipment for my challenge. Mont Blanc I'm coming!!! 🧗🏻‍♂️",
      card: {
        image: 'https://picsum.photos/200/300',
        title: 'Climbing Mont Blanc',
        builder: 'Marco Rossi',
      },
      like: 0,
      comment: 0,
    },
    {
      id: '3',
      avatar: 'avata',
      name: 'Marco Rossi 333',
      time: '1 hour ago',
      stt: "I finally bought the equipment for my challenge. Mont Blanc I'm coming!!! 🧗🏻‍♂️",
      card: {
        image: 'https://picsum.photos/200/300',
        title: 'Climbing Mont Blanc',
        builder: 'Marco Rossi',
      },
      like: 0,
      comment: 10,
    },
  ];

  return (
    <SafeAreaView className={clsx('bg-white')}>
      <View className={clsx('flex h-full w-full flex-col bg-gray-50 ')}>
        <FlatList
          data={arrayPost}
          renderItem={({ item }) => <FeedPostCard itemFeedPostCard={item} />}
          keyExtractor={(item) => item.id as unknown as string}
        />
        <View className="h-16" />
      </View>
    </SafeAreaView>
  );
};
const HomeScreen = () => {
  return (
    <HomeScreenStack.Navigator
      screenOptions={{
        headerBackVisible: false,
        headerTitleAlign: 'center',
        headerShown: false,
      }}
    >
      <HomeScreenStack.Screen
        name="FeedScreen"
        component={HomeFeed}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => <AppTitle title={t('your_feed.header')} />,
          headerRight: (props) => (
            <NavButton
              withIcon
              icon={
                <IconSearch
                  onPress={() =>
                    navigation.navigate('CompleteProfileStep3Screen')
                  }
                />
              }
            />
          ),
        })}
      />

      <HomeScreenStack.Screen
        name="ChallengeDetailScreenViewOnly"
        component={ChallengeDetailScreenViewOnly}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => '',
          headerLeft: (props) => (
            <NavButton
              text={t('button.back') as string}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
        })}
      />
    </HomeScreenStack.Navigator>
  );
};

export default HomeScreen;
