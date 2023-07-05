import { View, Text } from 'react-native';

import { IChallenge } from 'apps/client/src/app/types/challenge';
import i18n from '../../../../i18n/i18n';
import TabView from '../../../../component/common/Tab/TabView';
import DescriptionTab from './DescriptionTab';
import ProgressTab from './ProgressTab';
import { FC, useEffect, useState } from 'react';

import CheckCircle from './assets/check_circle.svg';

import { getChallengeStatusColor } from '../../../../utils/common';
import ParticipantsTab from '../../CompanyChallengesScreen/ChallengeDetailScreen/ParticipantsTab';
import { MOCK_FOLLOW_USERS } from 'apps/client/src/app/mock-data/follow';


interface IChallengeDetailScreenProps {
  challengeData: IChallenge;
  shouldRefresh: boolean;
  setShouldRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  isCompanyChallenge?: boolean;
}

export const ChallengeDetailScreen: FC<IChallengeDetailScreenProps> = ({
  challengeData,
  shouldRefresh,
  setShouldRefresh,
  isCompanyChallenge
}) => {

  const CHALLENGE_TABS_TITLE_TRANSLATION = isCompanyChallenge ? [
    i18n.t('challenge_detail_screen.progress'),
    i18n.t('challenge_detail_screen.description'),
    i18n.t('challenge_detail_screen.participants'),
  ] : [
    i18n.t('challenge_detail_screen.progress'),
    i18n.t('challenge_detail_screen.description'),


  ];
  const [index, setIndex] = useState(0);
  const { goal } = challengeData;
  const statusColor = getChallengeStatusColor(challengeData?.status);

  useEffect(() => {
    // refresh when user switch tab
    setShouldRefresh(true);
  }, [index]);

  return (
    <View className="flex h-full flex-col bg-white py-2 pb-16">
      <View className="px-4">
        <View className="flex flex-row items-center  gap-2 pt-2">
          <CheckCircle fill={statusColor} />
          <View>
            <Text className="text-basic text-xl font-medium leading-5">
              {goal}
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-2 flex flex-1">
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
          {isCompanyChallenge && <ParticipantsTab participant={MOCK_FOLLOW_USERS} />}
        </TabView>
      </View>
    </View>
  );
};

export default ChallengeDetailScreen;
