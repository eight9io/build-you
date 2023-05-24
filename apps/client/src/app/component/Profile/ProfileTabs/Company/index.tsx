import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import TabViewFlatlist from '../../../common/Tab/TabViewFlatlist';

import clsx from 'clsx';

import Biography from './Biography';
import Followers from '../common/Followers';
import Following from '../common/Following';
import Employees from './Employees';
import Challenges from './Challenges';

import { MOCK_FOLLOW_USERS } from '../../../../mock-data/follow';

const CompanyProfileTabs = () => {
  const { t } = useTranslation();

  const titles = [
    t('profile_screen_tabs.biography'),
    t('profile_screen_tabs.followers'),
    t('profile_screen_tabs.following'),
    t('profile_screen_tabs.employees'),
    t('profile_screen_tabs.challenges'),
  ];

  return (
    <View className={clsx('flex-1 bg-gray-50')}>
      <TabViewFlatlist
        titles={titles}
        children={[
          <Biography />,
          <Followers followers={MOCK_FOLLOW_USERS} />,
          <Following following={MOCK_FOLLOW_USERS} />,
          <Employees />,
          <Challenges />,
        ]}
        activeTabClassName=""
        defaultTabClassName="text-gray-dark"
      />
    </View>
  );
};

export default CompanyProfileTabs;
