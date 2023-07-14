import { NavigationProp, Route, useNavigation } from '@react-navigation/native';
import React, { FC, useEffect, useState } from 'react';
import { View, Text, Platform, SafeAreaView, FlatList } from 'react-native';
import clsx from 'clsx';

import i18n from '../../../i18n/i18n';
import { IChallenge } from '../../../types/challenge';
import { RootStackParamList } from '../../../navigation/navigation.type';
import { useUserProfileStore } from '../../../store/user-data';

import {
  getChallengeById,
  getChallengeParticipantsByChallengeId,
  serviceAddChallengeParticipant,
  serviceRemoveChallengeParticipant,
} from '../../../service/challenge';

import Button from '../../../component/common/Buttons/Button';
import { TabView } from '../../../component/common/Tab/TabView';
import GlobalDialogController from '../../../component/common/Dialog/GlobalDialogController';
import ProgressTab from '../../ChallengesScreen/PersonalChallengesScreen/ChallengeDetailScreen/ProgressTab';
import DescriptionTab from '../../ChallengesScreen/PersonalChallengesScreen/ChallengeDetailScreen/DescriptionTab';
import ParticipantsTab from '../../ChallengesScreen/CompanyChallengesScreen/ChallengeDetailScreen/ParticipantsTab';
import { RightPersonalChallengeDetailOptions } from '../../ChallengesScreen/PersonalChallengesScreen/PersonalChallengeDetailScreen/PersonalChallengeDetailScreen';

import ShareIcon from '../../../../../assets/svg/share.svg';

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

const CHALLENGE_TABS_TITLE_TRANSLATION_COMPANY = [
  i18n.t('challenge_detail_screen.progress'),
  i18n.t('challenge_detail_screen.description'),
  i18n.t('challenge_detail_screen.participants'),
];

const OtherUserProfileChallengeDetailsScreen: FC<
  IOtherUserProfileChallengeDetailsScreenProps
> = ({ route }) => {
  const { challengeId, isCompanyAccount } = route.params;
  const [index, setIndex] = useState<number>(0);
  const [challengeData, setChallengeData] = useState<IChallenge>(
    {} as IChallenge
  );
  const [isChallengeCompleted, setIsChallengeCompleted] = useState<
    boolean | null
  >(null);
  const [challengeOwner, setChallengeOwner] = useState<any>(null);
  const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);
  const [participantList, setParticipantList] = useState<any>([]);
  const [isJoined, setIsJoined] = useState<boolean | null>(null);

  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (!challengeId) return;
    const getChallengeData = async () => {
      try {
        const response = await getChallengeById(challengeId);
        setChallengeData(response.data);
        setIsChallengeCompleted(response.data?.status === 'closed');
        setChallengeOwner(response.data?.owner[0]);
      } catch (err) {
        GlobalDialogController.showModal({
          title: 'Error',
          message: 'Something went wrong. Please try again later!',
        });
      }
    };
    if (isCompanyAccount || challengeOwner?.id !== currentUser?.id) {
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
          } else {
            setIsJoined(false);
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
    if (shouldRefresh) {
      setShouldRefresh(false);
    }
  }, [challengeId, shouldRefresh]);

  useEffect(() => {
    if (isJoined) {
      navigation.setOptions({
        headerRight: () => (
          <RightPersonalChallengeDetailOptions
            challengeData={challengeData}
            setShouldRefresh={setShouldRefresh}
            shouldRenderEditAndDeleteBtns={false}
          />
        ),
      });
    } else {
      navigation.setOptions({
        headerRight: () => {
          return (
            <View>
              <Button
                Icon={<ShareIcon />}
                onPress={() => console.log('press share')}
              />
            </View>
          );
        },
      });
    }
  }, [isJoined]);

  const handleJoinChallenge = async () => {
    if (!currentUser?.id || !challengeId) return;

    try {
      await serviceAddChallengeParticipant(challengeId);
      GlobalDialogController.showModal({
        title: 'Success',
        message: 'You have joined the challenge!',
      });
      setIsJoined(true);
      setShouldRefresh(true);
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
      setShouldRefresh(true);
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

  const shouldRenderJoinButton =
    challengeOwner &&
    currentUser &&
    isCompanyAccount &&
    challengeOwner.id !== currentUser.id &&
    isJoined != null;

  return (
    <SafeAreaView>
      <View className="flex h-full flex-col bg-white pt-4">
        <View className="flex flex-row items-center justify-between px-4 pb-3">
          <View className="flex-1 flex-row items-center pt-2">
            <View className="flex-1">
              <Text className="text-2xl font-semibold">
                {challengeData?.goal}
              </Text>
            </View>
          </View>
          {isChallengeCompleted != null &&
            !isChallengeCompleted &&
            shouldRenderJoinButton && (
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
                  title={
                    isJoined
                      ? i18n.t('challenge_detail_screen.leave')
                      : i18n.t('challenge_detail_screen.join')
                  }
                  onPress={handleJoinLeaveChallenge}
                />
              </View>
            )}
          {isChallengeCompleted != null &&
            isChallengeCompleted &&
            shouldRenderJoinButton && (
              <View className="ml-2 h-9">
                <Button
                  containerClassName="border border-gray-dark flex items-center justify-center px-5"
                  textClassName={`text-center text-md font-semibold text-gray-dark `}
                  title={i18n.t('challenge_detail_screen.completed')}
                />
              </View>
            )}
        </View>

        <TabView
          titles={
            isCompanyAccount || challengeOwner?.id !== currentUser?.id
              ? CHALLENGE_TABS_TITLE_TRANSLATION_COMPANY
              : CHALLENGE_TABS_TITLE_TRANSLATION
          }
          activeTabIndex={index}
          setActiveTabIndex={setIndex}
        >
          <ProgressTab
            isJoined={isJoined}
            isOtherUserProfile
            challengeData={challengeData}
            shouldRefresh={shouldRefresh}
            setShouldRefresh={setShouldRefresh}
          />
          <DescriptionTab challengeData={challengeData} />
          {(isCompanyAccount || challengeOwner?.id !== currentUser?.id) && (
            <ParticipantsTab participant={participantList} />
          )}
        </TabView>
      </View>
    </SafeAreaView>
  );
};

export default OtherUserProfileChallengeDetailsScreen;
