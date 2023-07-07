import { Route } from '@react-navigation/native';
import React, { FC, useEffect, useState } from 'react';
import { View, Text, Platform, SafeAreaView, FlatList } from 'react-native';
import clsx from 'clsx';

import i18n from '../../../i18n/i18n';
import { IChallenge } from '../../../types/challenge';

import {
  getChallengeById,
  getChallengeParticipantsByChallengeId,
  serviceAddChallengeParticipant,
  serviceRemoveChallengeParticipant,
} from '../../../service/challenge';
import { TabView } from '../../../component/common/Tab/TabView';
import DescriptionTab from '../../ChallengesScreen/PersonalChallengesScreen/ChallengeDetailScreen/DescriptionTab';
import ProgressTab from '../../ChallengesScreen/PersonalChallengesScreen/ChallengeDetailScreen/ProgressTab';
import GlobalDialogController from '../../../component/common/Dialog/GlobalDialogController';
import Button from '../../../component/common/Buttons/Button';
import { useUserProfileStore } from '../../../store/user-data';

interface IOtherUserProfileChallengeDetailsScreenProps {
  route: Route<
    'OtherUserProfileChallengeDetailsScreen',
    {
      challengeId: string;
      isCompanyAccount?: boolean | undefined;
    }
  >;
}

const CHALLENGE_TABS_TITLE_TRANSLATION = [
  i18n.t('challenge_detail_screen.progress'),
  i18n.t('challenge_detail_screen.description'),
];

const OtherUserProfileChallengeDetailsScreen: FC<
  IOtherUserProfileChallengeDetailsScreenProps
> = ({ route }) => {
  const { challengeId, isCompanyAccount } = route.params;
  const [index, setIndex] = useState<number>(0);
  const [challengeData, setChallengeData] = useState<IChallenge>(
    {} as IChallenge
  );
  const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);
  const [participantList, setParticipantList] = useState<any>([]);
  const [isJoined, setIsJoined] = useState<boolean>(false);

  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();

  useEffect(() => {
    const getChallengeData = async () => {
      try {
        const response = await getChallengeById(challengeId);
        setChallengeData(response.data);
      } catch (err) {
        GlobalDialogController.showModal({
          title: 'Error',
          message: 'Something went wrong. Please try again later!',
        });
      }
    };
    if (isCompanyAccount) {
      const getChallengeParticipants = async () => {
        try {
          const response = await getChallengeParticipantsByChallengeId(
            challengeId
          );
          setParticipantList(response.data);
          if (
            response.data.find(
              (participant: any) => participant.id === currentUser?.id
            )
          ) {
            setIsJoined(true);
          }
        } catch (err) {
          GlobalDialogController.showModal({
            title: 'Error',
            message: 'Something went wrong. Please try again later!',
          });
        }
      };
      getChallengeParticipants();
    }
    getChallengeData();
  }, [challengeId]);

  const handleJoinChallenge = async () => {
    if (!currentUser?.id || !challengeId) return;
    try {
      await serviceAddChallengeParticipant(challengeId, currentUser?.id);
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
      await serviceRemoveChallengeParticipant(challengeId, currentUser?.id);
      setIsJoined(false);
    } catch (err) {
      GlobalDialogController.showModal({
        title: 'Error',
        message: 'Something went wrong. Please try again later!',
      });
    }
  };

  return (
    <SafeAreaView>
      <FlatList
        data={[]}
        className={clsx('h-full bg-gray-50')}
        renderItem={() => <View></View>}
        ListHeaderComponent={
          <View className="flex h-full flex-col bg-white pt-6">
            <View className="flex flex-row items-center justify-between px-4">
              <View className="flex flex-row items-center  gap-2 pt-2">
                <View>
                  <Text className="text-basic text-xl font-medium leading-5">
                    {challengeData?.goal}
                  </Text>
                </View>
              </View>
              {isCompanyAccount && (
                <View className="h-9">
                  <Button
                    isDisabled={false}
                    containerClassName="bg-primary-default flex items-center justify-center px-5"
                    textClassName="text-center text-md font-semibold text-white "
                    disabledContainerClassName="bg-gray-light flex items-center justify-center px-5"
                    disabledTextClassName="text-center text-md font-semibold text-gray-medium"
                    title={
                      isJoined
                        ? i18n.t('challenge_detail_screen.leave')
                        : i18n.t('challenge_detail_screen.join')
                    }
                    onPress={
                      isJoined ? handleLeaveChallenge : handleJoinChallenge
                    }
                  />
                </View>
              )}
            </View>

            <TabView
              titles={CHALLENGE_TABS_TITLE_TRANSLATION}
              activeTabIndex={index}
              setActiveTabIndex={setIndex}
            >
              <ProgressTab
                isOtherUserProfile
                challengeData={challengeData}
                shouldRefresh={shouldRefresh}
                setShouldRefresh={setShouldRefresh}
              />
              <DescriptionTab challengeData={challengeData} />
            </TabView>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default OtherUserProfileChallengeDetailsScreen;
