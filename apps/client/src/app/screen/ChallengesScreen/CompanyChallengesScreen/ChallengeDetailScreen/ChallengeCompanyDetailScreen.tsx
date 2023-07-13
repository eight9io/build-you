import { View, Text, TouchableOpacity } from 'react-native';
import { FC, useEffect, useState } from 'react';
import i18n from '../../../../i18n/i18n';

import {
  IChallenge,
  IChallengeOwner,
} from 'apps/client/src/app/types/challenge';
import { getChallengeStatusColor } from '../../../../utils/common';
import { useUserProfileStore } from '../../../../store/user-data';
import {
  getChallengeParticipants,
  serviceAddChallengeParticipant,
  serviceRemoveChallengeParticipant,
} from '../../../../service/challenge';

import ParticipantsTab from './ParticipantsTab';
import TabView from '../../../../component/common/Tab/TabView';
import ProgressTab from '../../PersonalChallengesScreen/ChallengeDetailScreen/ProgressTab';
import DescriptionTab from '../../PersonalChallengesScreen/ChallengeDetailScreen/DescriptionTab';

import CheckCircle from './assets/check_circle.svg';

import Button from '../../../../component/common/Buttons/Button';
import GlobalDialogController from 'apps/client/src/app/component/common/Dialog/GlobalDialogController';

interface ICompanyChallengeDetailScreenProps {
  challengeData: IChallenge;
  shouldRefresh: boolean;
  setShouldRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ChallengeCompanyDetailScreen: FC<
  ICompanyChallengeDetailScreenProps
> = ({ challengeData, shouldRefresh, setShouldRefresh }) => {
  const [isJoined, setIsJoined] = useState(true);
  const CHALLENGE_TABS_TITLE_TRANSLATION = [
    i18n.t('challenge_detail_screen.progress'),
    i18n.t('challenge_detail_screen.description'),
    i18n.t('challenge_detail_screen.participants'),
  ];

  const [index, setIndex] = useState(0);
  const { goal, id: challengeId, owner } = challengeData;

  const { getUserProfile } = useUserProfileStore();

  const currentUser = getUserProfile();

  const participantList = challengeData?.participants || [];
  const challengeOwner = Array.isArray(challengeData?.owner)
    ? challengeData?.owner[0]
    : challengeData?.owner;

  const isCurrentUserOwner = challengeOwner?.id === currentUser?.id;
  const isCurrentUserParticipant = participantList?.find(
    (participant: any) => participant.id === currentUser?.id
  );

  const challengeStatus =
    challengeOwner.id === currentUser?.id
      ? challengeData.status
      : isCurrentUserParticipant?.challengeStatus;

  const isChallengeCompleted =
    challengeStatus === 'done' || challengeStatus === 'closed';

  useEffect(() => {
    if (isCurrentUserOwner) {
      setIsJoined(true);
    } else {
      setIsJoined(!!isCurrentUserParticipant);
    }
  }, [isCurrentUserOwner, isCurrentUserParticipant]);

  const handleJoinChallenge = async () => {
    if (!currentUser?.id || !challengeId) return;
    try {
      await serviceAddChallengeParticipant(challengeId);
      GlobalDialogController.showModal({
        title: 'Success',
        message: 'You have joined the challenge!',
      });
      setIsJoined(true);
    } catch (err) {
      GlobalDialogController.showModal({
        title: 'Error',
        message: 'Something went wrong. Please try again later!',
      });
    }
  };

  const handleLeaveChallenge = async () => {
    if (!currentUser?.id || !challengeId) return;
    try {
      await serviceRemoveChallengeParticipant(challengeId);
      GlobalDialogController.showModal({
        title: 'Success',
        message: 'You have left the challenge!',
      });
      setIsJoined(false);
    } catch (err) {
      GlobalDialogController.showModal({
        title: 'Error',
        message: 'Something went wrong. Please try again later!',
      });
    }
  };

  const handleJoinLeaveChallenge = async () => {
    if (isJoined) {
      await handleLeaveChallenge();
    } else {
      await handleJoinChallenge();
    }
  };

  return (
    <View className="flex h-full flex-col bg-white pt-4">
      <View className="flex flex-row items-center justify-between px-4">
        <View className="flex-1 flex-row items-center gap-2 pb-2 pt-2">
          <CheckCircle fill={getChallengeStatusColor(challengeStatus)} />
          <View className="flex-1">
            <Text className="text-2xl font-semibold">{goal}</Text>
          </View>
        </View>
        {!isCurrentUserOwner && !isChallengeCompleted && (
          <View className="ml-2 h-9">
            <Button
              isDisabled={false}
              containerClassName={
                isJoined
                  ? 'border border-gray-dark flex items-center justify-center px-5'
                  : 'bg-primary-default flex items-center justify-center px-5'
              }
              textClassName={`text-center text-md font-semibold ${
                isJoined ? 'text-gray-dark' : 'text-white'
              } `}
              disabledContainerClassName="bg-gray-light flex items-center justify-center px-5"
              disabledTextClassName="text-center text-md font-semibold text-gray-medium"
              title={
                isJoined
                  ? i18n.t('challenge_detail_screen.leave')
                  : i18n.t('challenge_detail_screen.join')
              }
              onPress={handleJoinLeaveChallenge}
            />
          </View>
        )}
        {isChallengeCompleted && (
          <View className="ml-2 h-9">
            <Button
              containerClassName="border border-gray-dark flex items-center justify-center px-5"
              textClassName={`text-center text-md font-semibold text-gray-dark `}
              title={i18n.t('challenge_detail_screen.completed')}
            />
          </View>
        )}
      </View>

      <View className="mt-3 flex flex-1">
        <TabView
          titles={CHALLENGE_TABS_TITLE_TRANSLATION}
          activeTabIndex={index}
          setActiveTabIndex={setIndex}
        >
          <ProgressTab
            shouldRefresh={shouldRefresh}
            challengeData={challengeData}
            setShouldRefresh={setShouldRefresh}
          />
          <DescriptionTab challengeData={challengeData} />
          <ParticipantsTab participant={participantList as any} />
        </TabView>
      </View>
    </View>
  );
};

export default ChallengeCompanyDetailScreen;
