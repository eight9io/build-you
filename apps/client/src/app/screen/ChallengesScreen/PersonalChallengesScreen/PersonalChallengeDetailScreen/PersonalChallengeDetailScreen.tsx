import React, { FC, useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';

import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';

import httpInstance from '../../../../utils/http';

import { RootStackParamList } from '../../../../navigation/navigation.type';
import { IChallenge } from '../../../../types/challenge';

import ChallengeDetailScreen from '../ChallengeDetailScreen/ChallengeDetailScreen';

import PopUpMenu from '../../../../component/common/PopUpMenu';
import Button from '../../../../component/common/Buttons/Button';

import ShareIcon from './assets/share.svg';
import TaskAltIcon from './assets/task-alt.svg';
import EditChallengeModal from '../../../../component/modal/EditChallengeModal';
import ConfirmDialog from 'apps/client/src/app/component/common/Dialog/ConfirmDialog';
import { useTranslation } from 'react-i18next';
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
  const [isComplete, setIsComplete] = React.useState(false);
  const { t } = useTranslation();
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
    <View>
      <View className="-mt-1 flex flex-row items-center">
        <TouchableOpacity onPress={() => setIsComplete(true)}>
          <TaskAltIcon />
        </TouchableOpacity>
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
            {
              text: 'Delete',
              onPress: () => console.log('Delete'),
            },
          ]}
        />
      </View>
      {isComplete && (
        <ConfirmDialog
          isVisible={isComplete}
          onClosed={() => setIsComplete(false)}
          title={t('dialog.mark_challenge.title') as string}
          description={t('dialog.mark_challenge.description') as string}
        />
      )}
    </View>
  );
};

const PersonalChallengeDetailScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: PersonalChallengeDetailScreenNavigationProp;
}) => {
  const [isEditChallengeModalVisible, setIsEditChallengeModalVisible] =
    useState(false);
  const [challengeData, setChallengeData] = useState<IChallenge | undefined>(
    undefined
  );
  const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);

  const challengeId = route?.params?.challengeId;

  const isFocused = useIsFocused();

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

  useEffect(() => {
    if (!challengeId || !isFocused) return;
    if (shouldRefresh) setShouldRefresh(false);
    httpInstance.get(`/challenge/one/${challengeId}`).then((res) => {
      setChallengeData(res.data);
    });
  }, [challengeId, isFocused, shouldRefresh]);


  const handleEditChallengeBtnPress = () => {
    setIsEditChallengeModalVisible(true);
  };
  const handleEditChallengeModalClose = () => {
    setIsEditChallengeModalVisible(false);
  };
  return (
    <SafeAreaView className="bg-white pt-3">
      {challengeData && (
        <ChallengeDetailScreen
          challengeData={challengeData}
          setShouldRefresh={setShouldRefresh}
        />
      )}
      <EditChallengeModal
        visible={isEditChallengeModalVisible}
        onClose={handleEditChallengeModalClose}
      />
    </SafeAreaView>
  );
};

export default PersonalChallengeDetailScreen;
