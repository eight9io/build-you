import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Image, Text, StyleSheet, FlatList } from 'react-native';

import { IChallenge } from 'apps/client/src/app/types/challenge';

import i18n from '../../../../i18n/i18n';
import TabView from '../../../../component/common/Tab/TabView';
import DescriptionTab from './DescriptionTab';
import ProgressTab from './ProgressTab';

const CHALLENGE_TABS_TITLE_TRANSLATION = [
  i18n.t('challenge_detail_screen.progress'),
  i18n.t('challenge_detail_screen.description'),
];

interface IChallengeDetailScreenProps {
  challengeData: IChallenge;
  setShouldRefresh:  React.Dispatch<React.SetStateAction<boolean>>;
}

export const ChallengeDetailScreen: FC<IChallengeDetailScreenProps> = ({
  challengeData,
  setShouldRefresh,
}) => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const { goal } = challengeData;
  
  return (
    <View className="flex h-full flex-col bg-white py-2 pb-16">
      <View className="px-4">
        <View className="flex flex-row items-center justify-between pt-2">
          <View>
            <Text className="text-basic text-xl font-medium leading-5">
              {goal}
            </Text>
            <Text className="text-gray-dark text-sm font-normal leading-5">
              {`${t('challenge_detail_screen.builder')}: Marco Rossi`}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={null}
        renderItem={({ item }) => null}
        ListFooterComponent={
          <View className="mt-2 ">
            <TabView
              titles={CHALLENGE_TABS_TITLE_TRANSLATION}
              activeTabIndex={index}
              setActiveTabIndex={setIndex}
            >
              <ProgressTab challengeData={challengeData} setShouldRefresh={setShouldRefresh} />
              <DescriptionTab challengeData={challengeData} />
            </TabView>
          </View>
        }
      />
    </View>
  );
};

export default ChallengeDetailScreen;
