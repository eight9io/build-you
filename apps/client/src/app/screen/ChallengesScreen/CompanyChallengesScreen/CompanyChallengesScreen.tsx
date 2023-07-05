import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  SafeAreaView,
  View,
  Text,
  Button,
  ScrollView,
  FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/navigation.type';

import CompanyChallengeDetailScreen from './CompanyChallengeDetailScreen/CompanyChallengeDetailScreen';

import ChallengeCard from '../../../component/Card/ChallengeCard/ChallengeCard';
import { t } from 'i18next';
import AppTitle from '../../../component/common/AppTitle';
import NavButton from '../../../component/common/Buttons/NavButton';
import IconSearch from '../../../component/common/IconSearch/IconSearch';
import { IChallenge } from '../../../types/challenge';
import { useUserProfileStore } from '../../../store/user-data';
import { useIsFocused } from '@react-navigation/native';
import httpInstance from '../../../utils/http';
import SkeletonLoadingChallengesScreen from '../../../component/common/SkeletonLoadings/SkeletonLoadingChallengesScreen';
import ProgressCommentScreen from '../ProgressCommentScreen/ProgressCommentScreen';

const CompanyChallengesStack = createNativeStackNavigator<RootStackParamList>();

type CompanyChallengesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CompanyChallengesScreen'
>;

const EmptyChallenges = ({
  navigation,
}: {
  navigation: CompanyChallengesScreenNavigationProp;
}) => {
  return (
    <View className={clsx('flex h-3/4 flex-col items-center justify-center')}>
      <Text className={clsx('text-lg')}>
        You have no challenges at the moment.
      </Text>
      <Text className={clsx('text-lg')}>
        Click
        <Text
          className={clsx('text-primary-default')}
          onPress={() => navigation.navigate('CreateCompanyChallengeScreen')}
        >
          {' '}
          Create{' '}
        </Text>
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
  const [companyChallengesList, setCompanyChallengesList] = useState<

    IChallenge[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { getUserProfile } = useUserProfileStore();
  const userData = getUserProfile();

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) return;
    httpInstance.get(`/challenge/${userData?.id}`).then((res) => {
      res.data.sort((a: IChallenge, b: IChallenge) => {
        return (
          new Date(b.achievementTime).getTime() -
          new Date(a.achievementTime).getTime()
        );
      });
      setCompanyChallengesList(res.data);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    });
  }, [isFocused]);

  return (
    <SafeAreaView className={clsx('bg-white')}>
      {isLoading && <SkeletonLoadingChallengesScreen />}
      {!isLoading && (
        <View className={clsx('h-full w-full bg-gray-50 pb-24 ')}>
          {companyChallengesList.length === 0 ? (
            <EmptyChallenges navigation={navigation} />
          ) : (
            <FlatList
              className="px-4 pt-4"
              data={companyChallengesList}
              renderItem={({ item }: { item: IChallenge }) => (
                <ChallengeCard
                  item={item}
                  imageSrc={item?.image}
                  navigation={navigation}
                  isCompany={userData?.companyAccount ? true : false}
                />
              )}
              keyExtractor={(item) => item.id}
            />
          )}
        </View>
      )}
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
