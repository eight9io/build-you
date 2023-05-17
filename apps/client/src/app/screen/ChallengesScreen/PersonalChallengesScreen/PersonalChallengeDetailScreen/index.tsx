import React from 'react';
import clsx from 'clsx';
import { SafeAreaView, View, Text } from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from 'apps/client/src/app/component/common/Header';
import PopUpMenu from 'apps/client/src/app/component/common/PopUpMenu';
import { RootStackParamList } from 'apps/client/src/app/navigation/navigation.type';

import BackButton from '../../../../component/common/BackButton';
import ChallengeDetailScreen from '../../ChallengeDetailScreen';

import ShareIcon from './assets/share.svg';
import TaskAltIcon from './assets/task-alt.svg';

type PersonalChallengeDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PersonalChallengeDetailScreen'
>;

const RightPersonalChallengeDetailOptions = () => {
  return (
    <View className="-mt-1 flex flex-row items-center">
      <TaskAltIcon />
      <View className="pr-2 pl-4">
        <ShareIcon />
      </View>
      <PopUpMenu iconColor="#FF7B1D" />
    </View>
  );
};

const PersonalChallengeDetailScreen = ({
  navigation,
}: {
  navigation: PersonalChallengeDetailScreenNavigationProp;
}) => {
  return (
    <SafeAreaView className="bg-white">
      <Header

        leftBtn={
          <BackButton title="Challenges" onPress={() => navigation.goBack()} />
        }
        rightBtn={<RightPersonalChallengeDetailOptions />}
        onRightBtnPress={() => {}}
      />
      <ChallengeDetailScreen />
    </SafeAreaView>
  );
};

export default PersonalChallengeDetailScreen;
