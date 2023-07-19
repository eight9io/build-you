import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import TabViewFlatlist from '../../../common/Tab/TabViewFlatlist';

import clsx from 'clsx';

import Followers from '../common/Followers/Followers';
import Following from '../common/Following/Following';
import Employees from './Employees/Employees';

import {
  useFollowingListStore,
  useUserProfileStore,
} from '../../../../store/user-data';
import Biography from '../Users/Biography/Biography';
import { useIsFocused } from '@react-navigation/native';

import GlobalDialogController from '../../../common/Dialog/GlobalDialogController';

import { serviceGetListFollower } from 'apps/client/src/app/service/profile';

import { useGetListEmployee } from 'apps/client/src/app/hooks/useGetCompany';

const CompanyProfileTabs = () => {
  const { t } = useTranslation();

  const { getUserProfile } = useUserProfileStore();
  const userProfile = getUserProfile();
  const userId = userProfile?.id;
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
    try {
      getFollowerList();
    } catch (error) {
      GlobalDialogController.showModal({
        title: 'Error',
        message: t('errorMessage:500') as string,
      });
    }
  }, [isFocused, userProfile?.id]);
  useGetListEmployee();

  const followingList = getFollowingList();
  if (!userId) return null;
  const titles = [
    t('profile_screen_tabs.biography'),
    t('profile_screen_tabs.followers'),
    t('profile_screen_tabs.following'),
    t('profile_screen_tabs.employees'),
  ];

  return (
    <View className={clsx('flex-1 bg-gray-50')}>
      <TabViewFlatlist
        titles={titles}
        children={[
          <Biography key="0" userProfile={userProfile} />,
          <Followers followers={followerList} key="1" />,
          <Following following={followingList} key="2" />,
          <Employees key="3" />,
        ]}
        activeTabClassName=""
        defaultTabClassName="text-gray-dark"
      />
    </View>
  );
};

export default CompanyProfileTabs;
