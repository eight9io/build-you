import React from 'react';
import clsx from 'clsx';
import { SafeAreaView, View, Text } from 'react-native';

import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from 'apps/client/src/app/component/common/Header';
import PopUpMenu from 'apps/client/src/app/component/common/PopUpMenu';
import { RootStackParamList } from 'apps/client/src/app/navigation/navigation.type';

import NavButton from '../../../../component/common/Buttons/NavButton';
import ChallengeDetailScreen from '../../ChallengeDetailScreen';
import Button from 'apps/client/src/app/component/common/Buttons/Button';

import ShareIcon from './assets/share.svg';
import TaskAltIcon from './assets/task-alt.svg';

const image = Asset.fromModule(
  require('apps/client/src/app/screen/ChallengesScreen/PersonalChallengesScreen/PersonalChallengeDetailScreen/assets/test.png')
);

type PersonalChallengeDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PersonalChallengeDetailScreen'
>;

const RightPersonalChallengeDetailOptions = () => {
  const [isSharing, setIsSharing] = React.useState(false);

  // when sharing is available, we can share the image
  const onShare = async () => {
    setIsSharing(true);
    try {
      const fileUri = FileSystem.documentDirectory + 'test.png';
      await FileSystem.downloadAsync(image.uri, fileUri);
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error(error);
    }
    setIsSharing(false);
  };

  return (
    <View className="-mt-1 flex flex-row items-center">
      <TaskAltIcon />
      <View className="pl-4 pr-2">
        <Button Icon={<ShareIcon />} onPress={onShare} />
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
          <NavButton text="Challenges" onPress={() => navigation.goBack()} />
        }
        rightBtn={<RightPersonalChallengeDetailOptions />}
        onRightBtnPress={() => {}}
      />
      <ChallengeDetailScreen />
    </SafeAreaView>
  );
};

export default PersonalChallengeDetailScreen;
