import { View, Text } from 'react-native';

import { IChallenge } from 'apps/client/src/app/types/challenge';
import i18n from '../../../../i18n/i18n';
import TabView from '../../../../component/common/Tab/TabView';
import DescriptionTab from './DescriptionTab';
import ProgressTab from './ProgressTab';
import { FC, useEffect, useState } from 'react';

import CheckCircle from './assets/check_circle.svg';

import { getChallengeStatusColor } from '../../../../utils/common';
import { useUserProfileStore } from 'apps/client/src/app/store/user-data';
import Button from 'apps/client/src/app/component/common/Buttons/Button';
import {
  getChallengeParticipants,
  serviceAddChallengeParticipant,
  serviceRemoveChallengeParticipant,
} from 'apps/client/src/app/service/challenge';
import GlobalDialogController from 'apps/client/src/app/component/common/Dialog/GlobalDialogController';
import ParticipantsTab from '../../CompanyChallengesScreen/ChallengeDetailScreen/ParticipantsTab';

interface IChallengeDetailScreenProps {
  challengeData: IChallenge;
  shouldRefresh: boolean;
  setIsJoinedLocal?: React.Dispatch<React.SetStateAction<boolean>>;
  setShouldRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ChallengeDetailScreen: FC<IChallengeDetailScreenProps> = ({
  challengeData,
  shouldRefresh,
  setIsJoinedLocal,
  setShouldRefresh,
}) => {
  const [index, setIndex] = useState(0);
  const [isJoined, setIsJoined] = useState<boolean>(true);
  const { goal, id: challengeId } = challengeData;
  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();
  const [participantList, setParticipantList] = useState([]);
  useEffect(() => {
    const fetchParticipants = async () => {
      const response = await getChallengeParticipants(challengeId);
      setParticipantList(response.data);
    };
    fetchParticipants();
  }, [challengeId, isJoined]);

  const challengeOwner = Array.isArray(challengeData?.owner)
    ? challengeData?.owner[0]
    : challengeData?.owner;

  const isCurrentUserParticipant = challengeData?.participants?.find(
    (participant) => participant.id === currentUser?.id
  );

  const challengeStatus =
    challengeOwner.id === currentUser?.id
      ? challengeData.status
      : isCurrentUserParticipant?.challengeStatus;

  const isChallengeCompleted =
    challengeStatus === 'done' || challengeStatus === 'closed';

  const CHALLENGE_TABS_TITLE_TRANSLATION =
    participantList && challengeOwner?.companyAccount
      ? [
          i18n.t('challenge_detail_screen.progress'),
          i18n.t('challenge_detail_screen.description'),
          i18n.t('challenge_detail_screen.participants'),
        ]
      : [
          i18n.t('challenge_detail_screen.progress'),
          i18n.t('challenge_detail_screen.description'),
        ];
  const statusColor = getChallengeStatusColor(challengeStatus);

  const handleJoinChallenge = async () => {
    if (!currentUser?.id || !challengeId) return;
    try {
      await serviceAddChallengeParticipant(challengeId);
      GlobalDialogController.showModal({
        title: 'Success',
        message: 'You have joined the challenge!',
      });
      setIsJoined(true);
      setIsJoinedLocal && setIsJoinedLocal(true);
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
      setIsJoinedLocal && setIsJoinedLocal(false);
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
    <View className="flex h-full flex-col bg-white py-2">
      <View className="flex flex-row items-center justify-between px-4">
        <View className="flex-1 flex-row items-center gap-2 pb-2 pt-2">
          <CheckCircle fill={statusColor} />
          <View className="flex-1">
            <Text className="text-2xl font-semibold">{goal}</Text>
          </View>
        </View>
        {challengeOwner?.id !== currentUser?.id && !isChallengeCompleted && (
          <View className="ml-2 h-9">
            <Button
              isDisabled={false}
              containerClassName={
                isJoined
                  ? 'border border-gray-dark flex items-center justify-center px-5 text-gray-dark'
                  : 'bg-primary-default flex items-center justify-center px-5'
              }
              textClassName={`text-center text-md font-semibold ${
                isJoined ? 'text-gray-dark' : 'text-white'
              } `}
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

      <View className="mt-2 flex flex-1">
        <TabView
          titles={CHALLENGE_TABS_TITLE_TRANSLATION}
          activeTabIndex={index}
          setActiveTabIndex={setIndex}
        >
          <ProgressTab
            isJoined={isJoined}
            shouldRefresh={shouldRefresh}
            challengeData={challengeData}
            setShouldRefresh={setShouldRefresh}
          />
          <DescriptionTab challengeData={challengeData} />
          {participantList && challengeOwner?.companyAccount && (
            <ParticipantsTab participant={participantList} />
          )}
        </TabView>
      </View>
    </View>
  );
};

export default ChallengeDetailScreen;
