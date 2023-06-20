import React, { FC, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import TabViewFlatlist from '../../../common/Tab/TabViewFlatlist';

import Biography from '../Users/Biography';
import Skills from '../Users/Skills';
import ChallengesTab from './Challenges';
import { IUserData } from '../../../../types/user';

interface IOtherUserProfileTabsProps {
  otherUserData: IUserData | null;
}

const OtherUserProfileTabs: FC<IOtherUserProfileTabsProps> = ({
  otherUserData,
}) => {
  const { t } = useTranslation();

  const titles = [
    t('profile_screen_tabs.biography'),
    t('profile_screen_tabs.skills'),
    t('profile_screen_tabs.challenges'),
  ];

  return (
    <View className={clsx('flex-1 bg-gray-50')}>
      {otherUserData !== null && (
        <TabViewFlatlist
          titles={titles}
          children={[
            <Biography />,
            <Skills skills={otherUserData?.softSkill} />,
            <ChallengesTab userId={otherUserData.id} />,
          ]}
          activeTabClassName=""
          defaultTabClassName="text-gray-dark"
        />
      )}
      {otherUserData === null && (
        <View className={clsx('flex-1  bg-gray-50')}>
          <Text className={clsx('text-gray-dark')}>Loading...</Text>
        </View>
      )}
    </View>
  );
};

export default OtherUserProfileTabs;
