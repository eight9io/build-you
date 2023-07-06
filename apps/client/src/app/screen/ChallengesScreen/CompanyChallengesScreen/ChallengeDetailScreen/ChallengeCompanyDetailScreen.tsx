import { View, Text, TouchableOpacity } from 'react-native';
import { FC, useEffect, useState } from 'react';
import i18n from '../../../../i18n/i18n';

import { IChallenge } from 'apps/client/src/app/types/challenge';
import { getChallengeStatusColor } from '../../../../utils/common';
import { useUserProfileStore } from '../../../../store/user-data';
import { getChallengeParticipants } from '../../../../service/challenge';

import ParticipantsTab from './ParticipantsTab';
import TabView from '../../../../component/common/Tab/TabView';
import ProgressTab from '../../PersonalChallengesScreen/ChallengeDetailScreen/ProgressTab';
import DescriptionTab from '../../PersonalChallengesScreen/ChallengeDetailScreen/DescriptionTab';

import CheckCircle from './assets/check_circle.svg';

import Button from '../../../../component/common/Buttons/Button';

interface ICompanyChallengeDetailScreenProps {
  challengeData: IChallenge;
  shouldRefresh: boolean;
  setShouldRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ChallengeCompanyDetailScreen: FC<
  ICompanyChallengeDetailScreenProps
> = ({ challengeData, shouldRefresh, setShouldRefresh }) => {
  const [isJoined, setIsJoined] = useState(true);
  const [participantList, setParticipantList] = useState([]);

  const CHALLENGE_TABS_TITLE_TRANSLATION = [
    i18n.t('challenge_detail_screen.progress'),
    i18n.t('challenge_detail_screen.description'),
    i18n.t('challenge_detail_screen.participants'),
  ];

  const [index, setIndex] = useState(0);
  const { goal, id: challengeId, owner } = challengeData;
  const statusColor = getChallengeStatusColor(challengeData?.status);

  const { getUserProfile } = useUserProfileStore();

  const currentUser = getUserProfile();

  useEffect(() => {
    // refresh when user switch tab
    setShouldRefresh(true);
  }, [index]);

  useEffect(() => {
    const fetchParticipants = async () => {
      const response = await getChallengeParticipants(challengeId);
      setParticipantList(response.data);
      if (
        response.data.find(
          (participant: any) => participant.id === currentUser?.id
        )
      ) {
        setIsJoined(true);
      }
    };
    fetchParticipants();
  }, [challengeId]);

  const handleJoinChallenge = () => {
    setIsJoined(true);
  };

  const handleLeaveChallenge = () => {
    setIsJoined(false);
  };

  return (
    <View className="flex h-full flex-col bg-white py-6">
      <View className="flex flex-row items-center justify-between px-4">
        <View className="flex flex-row items-center  gap-2 pt-2">
          <CheckCircle fill={statusColor} />
          <View>
            <Text className="text-basic text-xl font-medium leading-5">
              {goal}
            </Text>
          </View>
        </View>
        <View className="h-9">
          <Button
            isDisabled={owner[0].id === currentUser?.id}
            containerClassName="bg-primary-default flex items-center justify-center px-5"
            textClassName="text-center text-md font-semibold text-white "
            disabledContainerClassName="bg-gray-light flex items-center justify-center px-5"
            disabledTextClassName="text-center text-md font-semibold text-gray-medium"
            title={
              isJoined
                ? i18n.t('challenge_detail_screen.leave')
                : i18n.t('challenge_detail_screen.join')
            }
            onPress={isJoined ? handleJoinChallenge : handleLeaveChallenge}
          />
        </View>
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
          <ParticipantsTab participant={participantList} />
        </TabView>
      </View>
    </View>
  );
};

export default ChallengeCompanyDetailScreen;
