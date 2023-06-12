import { View, Image, Text, StyleSheet, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n/i18n';
import TabView from '../../../../component/common/Tab/TabView';
import DescriptionTab from './DescriptionTab';
import ProgressTab from './ProgressTab';
import { FC, useState } from 'react';

import PopUpMenu from '../../../../component/common/PopUpMenu';
import clsx from 'clsx';
import CheckCircle from './assets/check_circle.svg';
const CHALLENGE_TABS_TITLE_TRANSLATION = [
  i18n.t('challenge_detail_screen.progress'),
  i18n.t('challenge_detail_screen.description'),
];

export const ChallengeDetailScreen = () => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const isChallengeCompleted = true;
  return (
    <View className="flex h-full flex-col py-2">
      <View className="px-4">
        <View className="mb-2 flex flex-row items-center justify-between pt-2">
          <View
            className={clsx('flex flex-row items-center justify-center gap-2')}
          >
            <CheckCircle fill={isChallengeCompleted ? '#20D231' : '#C5C8D2'} />
            <Text className="text-basic  text-xl font-medium leading-7">
              Climbing Mont Blancss
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={null}
        renderItem={({ item }) => null}
        ListFooterComponent={
          <View className="mt-2">
            <TabView
              titles={CHALLENGE_TABS_TITLE_TRANSLATION}
              activeTabIndex={index}
              setActiveTabIndex={setIndex}
            >
              <ProgressTab />
              <DescriptionTab />
            </TabView>
          </View>
        }
      />
    </View>
  );
};

export default ChallengeDetailScreen;
