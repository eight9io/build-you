import React, { FC, useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';

import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';

import httpInstance from '../../../../utils/http';
import {
  deleteChallenge,
  completeChallenge,
} from '../../../../service/challenge';

import { RootStackParamList } from '../../../../navigation/navigation.type';
import { IChallenge } from '../../../../types/challenge';

import ChallengeDetailScreen from '../ChallengeDetailScreen/ChallengeDetailScreen';

import PopUpMenu from '../../../../component/common/PopUpMenu';
import Button from '../../../../component/common/Buttons/Button';
import EditChallengeModal from '../../../../component/modal/EditChallengeModal';
import ConfirmDialog from '../../../../component/common/Dialog/ConfirmDialog';

import ShareIcon from './assets/share.svg';
import TaskAltIcon from './assets/task-alt.svg';
import TaskAltIconGray from './assets/task-alt-gray.svg';

const image = Asset.fromModule(
  require('apps/client/src/app/screen/ChallengesScreen/PersonalChallengesScreen/PersonalChallengeDetailScreen/assets/test.png')
);

type PersonalChallengeDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PersonalChallengeDetailScreen'
>;

interface IRightPersonalChallengeDetailOptionsProps {
  challengeData: IChallenge | undefined;
  onEditChallengeBtnPress: () => void;
  setShouldRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteChallengeDialogVisible: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export const RightPersonalChallengeDetailOptions: FC<
  IRightPersonalChallengeDetailOptionsProps
> = ({
  challengeData,
  setShouldRefresh,
  onEditChallengeBtnPress,
  setIsDeleteChallengeDialogVisible,
}) => {
  const [isSharing, setIsSharing] = React.useState(false);
  const [
    isCompletedChallengeDialogVisible,
    setIsCompletedChallengeDialogVisible,
  ] = useState<boolean>(false);
  const [isCompletedChallengeSuccess, setIsCompletedChallengeSuccess] =
    useState<boolean | null>(null);
  const [
    isChallengeAlreadyCompletedDialogVisible,
    setIsChallengeAlreadyCompletedDialogVisible,
  ] = useState<boolean>(false);

  const isChallengeCompleted = challengeData?.status === 'closed';

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

  const onCheckChallengeCompleted = () => {
    if (!challengeData) return;
    if (isChallengeCompleted) {
      setIsChallengeAlreadyCompletedDialogVisible(true);
    } else {
      setIsCompletedChallengeDialogVisible(true);
    }
  };

  const onCompleteChallenge = () => {
    if (!challengeData) return;
    completeChallenge(challengeData.id)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsCompletedChallengeDialogVisible(false);
          setTimeout(() => {
            setIsCompletedChallengeSuccess(true);
            setShouldRefresh(true);
          }, 600);
        }
      })
      .catch((err) => {
        setIsCompletedChallengeDialogVisible(false);
        setTimeout(() => {
          setIsCompletedChallengeSuccess(false);
        }, 600);
      });
  };

  const onCloseSuccessDialog = () => {
    setIsCompletedChallengeSuccess(null);
  };

  return (
    <View>
      <ConfirmDialog
        isVisible={isCompletedChallengeDialogVisible}
        title="Mark this challenge as complete?"
        description="You cannot edit challenge or update progress after marking the challenge as complete"
        confirmButtonLabel="Complete"
        closeButtonLabel="Cancel"
        onConfirm={onCompleteChallenge}
        onClosed={() => setIsCompletedChallengeDialogVisible(false)}
      />
      <ConfirmDialog
        isVisible={isChallengeAlreadyCompletedDialogVisible}
        title="Challenge already completed"
        description="This challenge has already been completed. Please try another one."
        confirmButtonLabel="Got it"
        onConfirm={() => {
          setIsChallengeAlreadyCompletedDialogVisible(false);
        }}
      />
      {isCompletedChallengeSuccess !== null && (
        <ConfirmDialog
          isVisible={isCompletedChallengeSuccess !== null}
          title={
            isCompletedChallengeSuccess ? 'Congrats!' : 'Something went wrong'
          }
          description={
            isCompletedChallengeSuccess
              ? 'Challenge has been completed successfully.'
              : 'Please try again later.'
          }
          confirmButtonLabel="Got it"
          onConfirm={onCloseSuccessDialog}
        />
      )}
      <View className="-mt-1 flex flex-row items-center">
        <TouchableOpacity onPress={onCheckChallengeCompleted}>
          <TaskAltIcon />
        </TouchableOpacity>
        <View className="pl-4 pr-2">
          <Button Icon={<ShareIcon />} onPress={onShare} />
        </View>

        <PopUpMenu
          iconColor="#FF7B1D"
          isDisabled={isChallengeCompleted}
          options={[
            {
              text: 'Edit',
              onPress: onEditChallengeBtnPress,
            },
            {
              text: 'Delete',
              onPress: () => setIsDeleteChallengeDialogVisible(true),
            },
          ]}
        />
      </View>
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
    useState<boolean>(false);
  const [challengeData, setChallengeData] = useState<IChallenge | undefined>(
    undefined
  );

  const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);

  const [isDeleteChallengeDialogVisible, setIsDeleteChallengeDialogVisible] =
    useState<boolean>(false);
  const [isDeleteSuccess, setIsDeleteSuccess] = useState<boolean>(false);
  const [isDeleteError, setIsDeleteError] = useState<boolean>(false);

  const challengeId = route?.params?.challengeId;

  const isFocused = useIsFocused();

  useEffect(() => {
    // Set header options, must set it manually to handle the onPress event inside the screen
    navigation.setOptions({
      headerRight: () => (
        <RightPersonalChallengeDetailOptions
          challengeData={challengeData}
          setShouldRefresh={setShouldRefresh}
          onEditChallengeBtnPress={handleEditChallengeBtnPress}
          setIsDeleteChallengeDialogVisible={setIsDeleteChallengeDialogVisible}
        />
      ),
    });
  }, [challengeData]);

  useEffect(() => {
    if (!challengeId && !shouldRefresh) return;
    httpInstance.get(`/challenge/one/${challengeId}`).then((res) => {
      setChallengeData(res.data);
    });
    setShouldRefresh(false);
  }, [challengeId, shouldRefresh]);

  useEffect(() => {
    if (!isFocused) return;
    setShouldRefresh(true);
  }, [isFocused]);

  const handleEditChallengeBtnPress = () => {
    setIsEditChallengeModalVisible(true);
  };
  const handleEditChallengeModalClose = () => {
    setIsEditChallengeModalVisible(false);
  };

  const handleEditChallengeModalConfirm = () => {
    setShouldRefresh(true);
    setIsEditChallengeModalVisible(false);
  };

  const handleDeleteChallenge = () => {
    if (!challengeData) return;
    deleteChallenge(challengeData.id)
      .then((res) => {
        if (res.status === 200) {
          setIsDeleteChallengeDialogVisible(false);
          setTimeout(() => {
            setIsDeleteSuccess(true);
          }, 600);
        }
      })
      .catch((err) => {
        setIsDeleteChallengeDialogVisible(false);
        setTimeout(() => {
          setIsDeleteError(true);
        }, 600);
      });
  };
  return (
    <SafeAreaView className="bg-white pt-3">
      <ConfirmDialog
        isVisible={isDeleteChallengeDialogVisible}
        title="Delete Challenge"
        description="Are you sure you want to delete this challenge?"
        confirmButtonLabel="Delete"
        closeButtonLabel="Cancel"
        onConfirm={handleDeleteChallenge}
        onClosed={() => setIsDeleteChallengeDialogVisible(false)}
      />

      <ConfirmDialog
        isVisible={isDeleteSuccess}
        title="Challenge Deleted"
        description="Challenge has been deleted successfully."
        confirmButtonLabel="Got it"
        onConfirm={() => {
          setIsDeleteSuccess(false);
          navigation.navigate('PersonalChallengesScreen');
        }}
      />
      <ConfirmDialog
        isVisible={isDeleteError}
        title="Something went wrong"
        description="Please try again later."
        confirmButtonLabel="Close"
        onConfirm={() => {
          setIsDeleteError(false);
        }}
      />
      {challengeData && (
        <>
          <ChallengeDetailScreen
            challengeData={challengeData}
            shouldRefresh={shouldRefresh}
            setShouldRefresh={setShouldRefresh}
          />
          <EditChallengeModal
            visible={isEditChallengeModalVisible}
            onClose={handleEditChallengeModalClose}
            onConfirm={handleEditChallengeModalConfirm}
            challenge={challengeData}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default PersonalChallengeDetailScreen;
