import React, { FC, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import TabViewFlatlist from '../../../common/Tab/TabViewFlatlist';

import clsx from 'clsx';
import { useUserProfileStore } from '../../../../store/user-data';

import Biography from './Biography';
import Skills from './Skills';
import Followers from '../common/Followers';
import Following from '../common/Following';
import { MOCK_FOLLOW_USERS } from '../../../../mock-data/follow';
import {
  serviceGetListFollower,
  serviceGetListFollowing,
} from 'apps/client/src/app/service/profile';
import { IUserData } from '../../../../types/user';

const ProfileTabs: FC = () => {
  const { getUserProfile } = useUserProfileStore();
  const userProfile = getUserProfile();
  const { t } = useTranslation();
  const [followList, setFollowList] = useState({
    followingList: [],
    followerList: [],
  });
  useEffect(() => {
    if (!userProfile?.id) return;
    const getFollowerList = async () => {
      const [{ data: followingList }, { data: followerList }] =
        await Promise.all([
          serviceGetListFollowing(userProfile?.id),
          serviceGetListFollower(userProfile?.id),
        ]);
      setFollowList({ followingList, followerList });
    };
    getFollowerList();
  }, []);

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
          <Biography key="0" />,
          <Skills skills={userProfile?.softSkill} key="1" />,
          <Followers followers={followList?.followerList} key="2" />,
          <Following following={followList?.followingList} key="3" />,
        ]}
        activeTabClassName=""
        defaultTabClassName="text-gray-dark"
      />
    </View>
  );
};

export default ProfileTabs;
