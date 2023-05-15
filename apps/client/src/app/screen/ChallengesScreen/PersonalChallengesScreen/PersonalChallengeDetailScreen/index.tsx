import React from 'react';
import clsx from 'clsx';
import { SafeAreaView, View, Text } from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from 'apps/client/src/app/component/common/Header';
import { RootStackParamList } from 'apps/client/src/app/navigation/navigation.type';

import BackButton from '../../../../component/common/BackButton';

import ChallengeDetailScreen from '../../ChallengeDetailScreen';

type PersonalChallengeDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PersonalChallengeDetailScreen'
>;

const PersonalChallengeDetailScreen = ({
  navigation,
}: {
  navigation: PersonalChallengeDetailScreenNavigationProp;
}) => {
  return (
    <SafeAreaView className='bg-white'>
      <Header
        leftBtnText={<BackButton onPress={() => navigation.goBack()} />}
        rightBtnText={'Share'}
        onRightBtnPress={() => {}}
      />
      <ChallengeDetailScreen />
    </SafeAreaView>
  );
};

export default PersonalChallengeDetailScreen;
