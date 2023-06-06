import React, { FC, useEffect, useState } from 'react';
import { SafeAreaView, View } from 'react-native';

import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import PopUpMenu from '../../../../component/common/PopUpMenu';
import { RootStackParamList } from '../../../../navigation/navigation.type';

import ChallengeDetailScreen from '../ChallengeDetailScreen/ChallengeDetailScreen';
import Button from '../../../../component/common/Buttons/Button';

import ShareIcon from './assets/share.svg';
import TaskAltIcon from './assets/task-alt.svg';
import EditChallengeModal from '../../../../component/modal/EditChallengeModal';
const image = Asset.fromModule(
  require('apps/client/src/app/screen/ChallengesScreen/PersonalChallengesScreen/PersonalChallengeDetailScreen/assets/test.png')
);

type PersonalChallengeDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PersonalChallengeDetailScreen'
>;

interface IRightPersonalChallengeDetailOptionsProps {
  onEditChallengeBtnPress: () => void;
}

export const RightPersonalChallengeDetailOptions: FC<
  IRightPersonalChallengeDetailOptionsProps
> = ({ onEditChallengeBtnPress }) => {
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

      <PopUpMenu
        iconColor="#FF7B1D"
        options={[
          {
            text: 'Edit',
            onPress: onEditChallengeBtnPress,
          },
        ]}
      />
    </View>
  );
};

const PersonalChallengeDetailScreen = ({
  navigation,
}: {
  navigation: PersonalChallengeDetailScreenNavigationProp;
}) => {
  const [editChallengeModalIsVisible, setEditChallengeModalIsVisible] =
    useState(false);

  useEffect(() => {
    // Set header options, must set it manually to handle the onPress event inside the screen
    navigation.setOptions({
      headerRight: () => (
        <RightPersonalChallengeDetailOptions
          onEditChallengeBtnPress={handleEditChallengeBtnPress}
        />
      ),
    });
  }, []);
  const handleEditChallengeBtnPress = () => {
    setEditChallengeModalIsVisible(true);
  };
  const handleEditChallengeModalClose = () => {
    setEditChallengeModalIsVisible(false);
  };
  return (
    <SafeAreaView className="bg-white pt-3">
      {/* <Header
        leftBtn={
          <NavButton
            text="Challenges"
            onPress={() => navigation.goBack()}
            withBackIcon
          />
        }
        rightBtn={
          <RightPersonalChallengeDetailOptions
            onEditChallengeBtnPress={handleEditChallengeBtnPress}
          />
        }
        onRightBtnPress={() => {}}
      /> */}
      <ChallengeDetailScreen />
      <EditChallengeModal
        visible={editChallengeModalIsVisible}
        onClose={handleEditChallengeModalClose}
      />
    </SafeAreaView>
  );
};

export default PersonalChallengeDetailScreen;
