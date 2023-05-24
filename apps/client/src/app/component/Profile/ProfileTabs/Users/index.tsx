import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import TabViewFlatlist from '../../../common/Tab/TabViewFlatlist';

import clsx from 'clsx';

import Biography from './Biography';
import Skills from './Skills';
import Followers from '../common/Followers';
import Following from '../common/Following';
import { MOCK_FOLLOW_USERS } from '../../../../mock-data/follow';

const ProfileTabs = () => {
  const { t } = useTranslation();

  const titles = [
    t('profile_screen_tabs.biography'),
    t('profile_screen_tabs.skills'),
    t('profile_screen_tabs.followers'),
    t('profile_screen_tabs.following'),
  ];

  return (
    <View className={clsx('flex-1  bg-gray-50')}>
      <TabViewFlatlist
        titles={titles}
        children={[
          <Biography />,
          <Skills />,
          <Followers followers={MOCK_FOLLOW_USERS} />,
          <Following following={MOCK_FOLLOW_USERS} />,
        ]}
        activeTabClassName=""
        defaultTabClassName="text-gray-dark"
      />
    </View>
  );
};

export default ProfileTabs;
