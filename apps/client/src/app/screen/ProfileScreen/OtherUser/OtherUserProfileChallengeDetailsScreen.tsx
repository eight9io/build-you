import { Route } from '@react-navigation/native';
import React, { FC, useEffect, useState } from 'react';
import { View, Text, Platform } from 'react-native';
import clsx from 'clsx';

import i18n from '../../../i18n/i18n';
import { IChallenge } from '../../../types/challenge';

import { getChallengeById } from '../../../service/challenge';
import { TabView } from '../../../component/common/Tab/TabView';
import DescriptionTab from '../../ChallengesScreen/PersonalChallengesScreen/ChallengeDetailScreen/DescriptionTab';
import ProgressTab from '../../ChallengesScreen/PersonalChallengesScreen/ChallengeDetailScreen/ProgressTab';
import GlobalDialogController from '../../../component/common/Dialog/GlobalDialogController';

interface IOtherUserProfileChallengeDetailsScreenProps {
  route: Route<
    'OtherUserProfileChallengeDetailsScreen',
    {
      challengeId: string;
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
  const { challengeId } = route.params;
  const [index, setIndex] = useState<number>(0);
  const [challengeData, setChallengeData] = useState<IChallenge>(
    {} as IChallenge
  );
  const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);

  useEffect(() => {
    getChallengeById(challengeId)
      .then((res) => {
        setChallengeData(res.data);
      })
      .catch((err) => {
        GlobalDialogController.showModal({
          title: 'Error',
          message: 'Something went wrong. Please try again later!',
        });
      });
  }, [challengeId]);

  return (
    <View
      className={clsx('bg-white', {
        'h-[calc(100%-7.6%)]': Platform.OS === 'android',
        'h-[calc(100%-10.8%)]': Platform.OS === 'ios',
      })}
    >
      <View className="flex flex-1 flex-col bg-white py-4 ">
        {challengeData?.goal && (
          <View className="px-4">
            <View className="flex flex-row items-center  gap-2 pt-2">
              <Text className="text-basic text-xl font-medium leading-5">
                {challengeData?.goal}
              </Text>
            </View>
          </View>
        )}
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
    </View>
  );
};

export default OtherUserProfileChallengeDetailsScreen;
