import React from 'react';
import clsx from 'clsx';
import { SafeAreaView, View, Text, Button, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/navigation.type';

import CompanyChallengeDetailScreen from './CompanyChallengeDetailScreen/CompanyChallengeDetailScreen';

import ChallengeCard from '../../../component/Card/ChallengeCard';
import { t } from 'i18next';
import AppTitle from '../../../component/common/AppTitle';
import NavButton from '../../../component/common/Buttons/NavButton';
import IconSearch from '../../../component/common/IconSearch/IconSearch';

const CompanyChallengesStack = createNativeStackNavigator<RootStackParamList>();

type CompanyChallengesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CompanyChallengesScreen'
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

const CompanyChallenges = ({
  navigation,
}: {
  navigation: CompanyChallengesScreenNavigationProp;
}) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView className={clsx('bg-white')}>
      {/* <MainNavBar
        title={t('top_nav.challenges')}
        navigation={navigation}
        withSearch
      /> */}
      <View className={clsx('h-full w-full bg-gray-50')}>
        {/* <EmptyChallenges /> */}

        <ScrollView className="px-4 pt-4">
          <ChallengeCard
            name="Challenge Name"
            imageSrc="https://picsum.photos/200/300"
            authorName="Author Name"
            navigation={navigation}
            isChallengeCompleted
          />
          <ChallengeCard
            name="Challenge Name"
            imageSrc="https://picsum.photos/200/300"
            authorName="Author Name"
            navigation={navigation}
          />
          <ChallengeCard
            name="Challenge Name"
            imageSrc="https://picsum.photos/200/300"
            authorName="Author Name"
            navigation={navigation}
            isChallengeCompleted
          />
          <ChallengeCard
            name="Challenge Name"
            imageSrc="https://picsum.photos/200/300"
            authorName="Author Name"
            navigation={navigation}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const CompanyChallengesScreen = () => {
  return (
    <CompanyChallengesStack.Navigator
      screenOptions={{
        headerBackVisible: false,
        headerTitleAlign: 'center',
        headerShown: true,
      }}
    >
      <CompanyChallengesStack.Screen
        name="CompanyChallengesScreen"
        component={CompanyChallenges}
        options={({ navigation }) => ({
          headerTitle: () => <AppTitle title={t('top_nav.challenges')} />,
          headerRight: (props) => (
            <NavButton
              withIcon
              icon={
                <IconSearch
                  onPress={() => console.log('CompanyChallengesScreen Search')}
                />
              }
            />
          ),
        })}
      />

      <CompanyChallengesStack.Screen
        name="CompanyChallengeDetailScreen"
        component={CompanyChallengeDetailScreen}
        options={({ navigation }) => ({
          headerTitle: () => '',
          headerLeft: (props) => (
            <NavButton
              text={t('top_nav.challenges') as string}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
        })}
      />
    </CompanyChallengesStack.Navigator>
  );
};

export default CompanyChallengesScreen;
