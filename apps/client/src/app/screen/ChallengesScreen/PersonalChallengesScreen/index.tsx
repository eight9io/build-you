import React from 'react';
import clsx from 'clsx';
import { SafeAreaView, View, Text, Button, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/navigation.type';

import SettingsScreen from '../../SettingsScreen';
import PersonalChallengeDetailScreen from './PersonalChallengeDetailScreen';

import MainNavBar from '../../../component/NavBar/MainNavBar';
import ChallengeCard from '../../../component/Card/ChallengeCard';

const PersonalChallengesStack =
  createNativeStackNavigator<RootStackParamList>();

type PersonalChallengesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PersonalChallengesScreen'
>;

const EmptyChallenges = () => {
  return (
    <View className={clsx('flex h-3/4 flex-col items-center justify-center')}>
      <Text className={clsx('text-lg')}>
        You have no challenges at the moment.
      </Text>
      <Text className={clsx('text-lg')}>
        Click
        <Text className={clsx('text-primary-default')}> Create </Text>
        to Create new challenge.
      </Text>
    </View>
  );
};

const PersonalChallenges = ({
  navigation,
}: {
  navigation: PersonalChallengesScreenNavigationProp;
}) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView className={clsx('bg-white')}>
      <MainNavBar title={t('top_nav.challenges')} navigation={navigation} />
      <View className={clsx('h-full w-full bg-gray-50')}>
        {/* <EmptyChallenges /> */}

        <ScrollView className="px-4 pt-4">
          <ChallengeCard
            name="Challenge Name"
            description="Challenge Description"
            imageSrc="https://picsum.photos/200/300"
            authorName="Author Name"
            navigation={navigation}
          />
          <ChallengeCard
            name="Challenge Name"
            description="Challenge Description"
            imageSrc="https://picsum.photos/200/300"
            authorName="Author Name"
            navigation={navigation}
          />
          <ChallengeCard
            name="Challenge Name"
            description="Challenge Description"
            imageSrc="https://picsum.photos/200/300"
            authorName="Author Name"
            navigation={navigation}
          />
          <ChallengeCard
            name="Challenge Name"
            description="Challenge Description"
            imageSrc="https://picsum.photos/200/300"
            authorName="Author Name"
            navigation={navigation}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const PersonalChallengesScreen = () => {
  return (
    <PersonalChallengesStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <PersonalChallengesStack.Screen
        name="PersonalChallengesScreen"
        component={PersonalChallenges}
      />
      <PersonalChallengesStack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
      />
      <PersonalChallengesStack.Screen
        name="PersonalChallengeDetailScreen"
        component={PersonalChallengeDetailScreen}
      />
    </PersonalChallengesStack.Navigator>
  );
};

export default PersonalChallengesScreen;
