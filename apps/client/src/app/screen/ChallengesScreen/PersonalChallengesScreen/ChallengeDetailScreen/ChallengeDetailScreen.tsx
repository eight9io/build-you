import { View, Image, Text, StyleSheet, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n/i18n';
import TabView from '../../../../component/common/Tab/TabView';
import DescriptionTab from './DescriptionTab';
import ProgressTab from './ProgressTab';
import { FC, useState } from 'react';

import PopUpMenu from '../../../../component/common/PopUpMenu';

const CHALLENGE_TABS_TITLE_TRANSLATION = [
  i18n.t('challenge_detail_screen.progress'),
  i18n.t('challenge_detail_screen.description'),
];

export const ChallengeDetailScreen = () => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);

  return (
    <View className="flex h-full flex-col bg-white py-2">
      <View className="px-4">
        <View className="flex flex-row items-center justify-between pt-2">
          <View>
            <Text className="text-basic text-xl font-medium leading-5">
              Climbing Mont Blanc
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
