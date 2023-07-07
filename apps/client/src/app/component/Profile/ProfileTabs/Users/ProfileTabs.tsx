import React, { FC, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import TabViewFlatlist from '../../../common/Tab/TabViewFlatlist';

import clsx from 'clsx';
import {
  useFollowingListStore,
  useUserProfileStore,
} from '../../../../store/user-data';

import Biography from './Biography/Biography';
import Skills from './Skills';
import Followers from '../common/Followers/Followers';
import Following from '../common/Following/Following';
import { serviceGetListFollower } from 'apps/client/src/app/service/profile';
import { useIsFocused } from '@react-navigation/native';

const ProfileTabs: FC = () => {
  const { getUserProfile } = useUserProfileStore();
  const userProfile = getUserProfile();
  const { t } = useTranslation();
  const { getFollowingList } = useFollowingListStore();

  const [followerList, setFollowerList] = useState([]);

  const isFocused = useIsFocused();
  useEffect(() => {
    if (!userProfile?.id || !isFocused) return;
    const getFollowerList = async () => {
      const { data: followerList } = await serviceGetListFollower(
        userProfile?.id
      );
      setFollowerList(followerList);
    };
    getFollowerList();
  }, [isFocused]);
  const followingList = getFollowingList();
  const titles = [
    t('profile_screen_tabs.biography'),
    t('profile_screen_tabs.skills'),
    t('profile_screen_tabs.followers'),
    t('profile_screen_tabs.following'),
  ];

  return (
    <View className={clsx('  w-full flex-1 bg-gray-50  ')}>
      <TabViewFlatlist
        titles={titles}
        children={[
          <Biography key="0" userProfile={userProfile} />,
          <Skills skills={userProfile?.softSkill} key="1" />,
          <Followers followers={followerList} key="2" />,
          <Following following={followingList} key="3" />,
        ]}
        activeTabClassName=""
        defaultTabClassName="text-gray-dark "
      />
    </View>
  );
};

export default ProfileTabs;
