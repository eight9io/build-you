/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useEffect } from 'react';
import { View, FlatList, SafeAreaView } from 'react-native';
import clsx from 'clsx';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { t, use } from 'i18next';

import { RootStackParamList } from '../navigation/navigation.type';

import OtherUserProfileScreen from './ProfileScreen/OtherUser/OtherUserProfileScreen';

import AppTitle from '../component/common/AppTitle';
import Button from '../component/common/Buttons/Button';
import FeedPostCard from '../component/Post/FeedPostCard';
import NavButton from '../component/common/Buttons/NavButton';
import IconSearch from '../component/common/IconSearch/IconSearch';

import ShareIcon from '../../../assets/svg/share.svg';
import OtherUserProfileDetailsScreen from './ProfileScreen/OtherUser/OtherUserProfileDetailsScreen';
import { serviceGetFeed } from '../service/feed';

import { useGetListFollowing } from '../hooks/useGetUser';
import ProgressCommentScreen from './ChallengesScreen/ProgressCommentScreen/ProgressCommentScreen';
import { set } from 'react-native-reanimated';

const HomeScreenStack = createNativeStackNavigator<RootStackParamList>();

interface IFeedDataProps {}

export const HomeFeed = () => {
  const [feedData, setFeedData] = React.useState<any>([]);
  const [feedIndex, setFeedIndex] = React.useState<number>(1);
  const [feedPage, setFeedPage] = React.useState<number>(1);
  const [totalPage, setTotalPage] = React.useState<number>(1);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);

  const arrayPost = [
    {
      id: '4387ef8e-7a1d-44a8-bcd0-d55f74b3771e',
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
      id: '4387ef8e-7a1d-44a8-bcd0-d55f74b3771f',
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
      id: '4387ef8e-7a1d-44a8-bcd0-d55f74b3771a',
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
  useGetListFollowing();

  useEffect(() => {
    const getFeed = async () => {
      await serviceGetFeed({
        page: feedIndex,
        take: 20,
      }).then((res) => {
        setFeedData(res);
      });
      // setFeedData(res);
    };
    getFeed();
  }, []);

  const getNewFeed = async () => {
    await serviceGetFeed({
      page: feedIndex + 1,
      take: 10,
    }).then((res) => {
      setFeedData((prev: any) => [...prev, ...res.data]);
    });
    setFeedIndex((prev) => prev + 1);
  };

  return (
    <SafeAreaView className={clsx('bg-white')}>
      <View className={clsx('flex h-full w-full flex-col bg-gray-50 ')}>
        <FlatList
          data={arrayPost}
          renderItem={({ item }) => <FeedPostCard itemFeedPostCard={item} />}
          keyExtractor={(item) => item.id as unknown as string}
          onEndReached={getNewFeed}
          onEndReachedThreshold={0.6}
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
          // headerRight: () => {
          //   return (
          //     <View>
          //       <Button
          //         Icon={<ShareIcon />}
          //         onPress={() => console.log('press share')}
          //       />
          //     </View>
          //   );
          // },
        })}
      />
      <HomeScreenStack.Screen
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

      <HomeScreenStack.Screen
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
    </HomeScreenStack.Navigator>
  );
};

export default HomeScreen;
