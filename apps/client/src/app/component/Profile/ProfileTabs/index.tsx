import React, { useEffect, useState} from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import TabViewFlatlist from '../../common/Tab/TabViewFlatlist';

import clsx from 'clsx';

import Biography from './Biography';
import Skills from './Skills';
import Followers from './Followers';
import Following from './Following';

const ProfileTabs = () => {
  const { t } = useTranslation();

  const titles = [
    t('profile_screen_tabs.biography'), 
    t('profile_screen_tabs.skills'), 
    t('profile_screen_tabs.followers'),
    t('profile_screen_tabs.following'),
  ];

  return (
    <View className={clsx('h-full pl-4 bg-gray-50')}>
      <TabViewFlatlist 
        titles={titles}
        children={[
          <Biography />,
          <Skills />,
          <Followers />,
          <Following />,
        ]}
        activeTabClassName=''
        defaultTabClassName='text-gray-dark'
      />
    </View>
  );
};

export default ProfileTabs;
