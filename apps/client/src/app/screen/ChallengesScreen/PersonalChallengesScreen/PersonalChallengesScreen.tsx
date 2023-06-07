import clsx from 'clsx';
import { SafeAreaView, View, Text, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/navigation.type';
import PersonalChallengeDetailScreen from './PersonalChallengeDetailScreen/PersonalChallengeDetailScreen';
import ChallengeCard from '../../../component/Card/ChallengeCard';
import AppTitle from '../../../component/common/AppTitle';
import NavButton from '../../../component/common/Buttons/NavButton';
import IconSearch from '../../../component/common/IconSearch/IconSearch';

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

const PersonalChallengesScreen = () => {
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
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
        })}
      />
    </PersonalChallengesStack.Navigator>
  );
};

export default PersonalChallengesScreen;
