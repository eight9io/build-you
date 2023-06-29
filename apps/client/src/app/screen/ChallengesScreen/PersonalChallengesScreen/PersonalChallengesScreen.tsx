import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';

import httpInstance from '../../../utils/http';
import { IChallenge } from '../../../types/challenge';
import { useUserProfileStore } from '../../../store/user-data';
import { RootStackParamList } from '../../../navigation/navigation.type';

import PersonalChallengeDetailScreen from './PersonalChallengeDetailScreen/PersonalChallengeDetailScreen';
import SkeletonLoadingChallengesScreen from '../../../component/common/SkeletonLoadings/SkeletonLoadingChallengesScreen';

import ChallengeCard from '../../../component/Card/ChallengeCard/ChallengeCard';
import AppTitle from '../../../component/common/AppTitle';
import NavButton from '../../../component/common/Buttons/NavButton';
import IconSearch from '../../../component/common/IconSearch/IconSearch';
import OtherUserProfileScreen from '../../ProfileScreen/OtherUser/OtherUserProfileScreen';
import Button from '../../../component/common/Buttons/Button';

import ShareIcon from '../../../../../assets/svg/share.svg';
import OtherUserProfileDetailsScreen from '../../ProfileScreen/OtherUser/OtherUserProfileDetailsScreen';
import ProgressCommentScreen from '../ProgressCommentScreen/ProgressCommentScreen';

const PersonalChallengesStack =
  createNativeStackNavigator<RootStackParamList>();

type PersonalChallengesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PersonalChallengesScreen'
>;

const EmptyChallenges = ({
  navigation,
}: {
  navigation: PersonalChallengesScreenNavigationProp;
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
          onPress={() => navigation.navigate('CreateChallengeScreen')}
        >
          {' '}
          Create{' '}
        </Text>
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
  const [personalChallengesList, setPersonalChallengesList] = useState<
    IChallenge[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
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
      setPersonalChallengesList(res.data);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    });
  }, [isFocused]);

  return (
    <SafeAreaView className={clsx('bg-white')}>
      {isLoading && <SkeletonLoadingChallengesScreen />}
      {!isLoading && (
        <View className={clsx('h-full w-full bg-gray-50')}>
          {personalChallengesList.length === 0 ? (
            <EmptyChallenges navigation={navigation} />
          ) : (
            <FlatList
              className="px-4 pt-4"
              data={personalChallengesList}
              renderItem={({ item }: { item: IChallenge }) => (
                <ChallengeCard
                  item={item}
                  imageSrc={item?.image}
                  navigation={navigation}
                />
              )}
              keyExtractor={(item) => item.id}
              ListFooterComponent={<View className="h-20" />}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const PersonalChallengesNavigator = () => {
  const { t } = useTranslation();
  return (
    <PersonalChallengesStack.Navigator
      screenOptions={{
        headerBackVisible: false,
        headerTitleAlign: 'center',
        headerShown: true,
      }}
    >
      <PersonalChallengesStack.Screen
        name="PersonalChallengesScreen"
        component={PersonalChallenges}
        options={({ navigation }) => ({
          headerTitle: () => <AppTitle title={t('top_nav.challenges')} />,
          headerRight: (props) => (
            <NavButton
              withIcon
              icon={
                <IconSearch
                  onPress={() => console.log('PersonalChallengesScreen Search')}
                />
              }
            />
          ),
        })}
      />

      <PersonalChallengesStack.Screen
        name="PersonalChallengeDetailScreen"
        component={PersonalChallengeDetailScreen}
        options={({ navigation }) => ({
          headerTitle: () => '',
          headerLeft: (props) => (
            <NavButton
              text={t('top_nav.challenges') as string}
              onPress={() => navigation.navigate('PersonalChallengesScreen')}
              withBackIcon
            />
          ),
        })}
      />
      <PersonalChallengesStack.Screen
        name="OtherUserProfileScreen"
        component={OtherUserProfileScreen}
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
          headerRight: () => {
            return (
              <View>
                <Button
                  Icon={<ShareIcon />}
                  onPress={() => console.log('press share')}
                />
              </View>
            );
          },
        })}
      />
      <PersonalChallengesStack.Screen
        name="OtherUserProfileDetailsScreen"
        component={OtherUserProfileDetailsScreen}
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
          headerRight: () => {
            return (
              <View>
                <Button
                  Icon={<ShareIcon />}
                  onPress={() => console.log('press share')}
                />
              </View>
            );
          },
        })}
      />
      <PersonalChallengesStack.Screen
        name="ProgressCommentScreen"
        component={ProgressCommentScreen}
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
    </PersonalChallengesStack.Navigator>
  );
};

export default PersonalChallengesNavigator;
