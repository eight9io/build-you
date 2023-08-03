import React, { FC, useEffect, useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import TabViewFlatlist from "../../../common/Tab/TabViewFlatlist";

import clsx from "clsx";
import { useFollowingListStore, useUserProfileStore } from "../../../../store/user-store";

import Biography from "./Biography/Biography";
import Skills from "./Skills";
import Followers from "../common/Followers/Followers";
import Following from "../common/Following/Following";
import {
  serviceGetListFollower,
  serviceGetListFollowing,
} from "../../../../service/profile";

const ProfileTabs: FC = () => {
  const [isFollowerRefreshing, setIsFollowerRefreshing] =
    useState<boolean>(false);
  const [isFollowingRefreshing, setIsFollowingRefreshing] =
    useState<boolean>(false);
  const [followerList, setFollowerList] = useState([]);
  // const [followingList, setFollowingList] = useState([]);
  const { getFollowingList, setFollowingList } = useFollowingListStore();
  const followingList = getFollowingList();
  const { getUserProfile } = useUserProfileStore();
  const userProfile = getUserProfile();
  const { t } = useTranslation();

  const getFollowerList = async () => {
    setIsFollowerRefreshing(true);
    const { data: followerList } = await serviceGetListFollower(
      userProfile?.id
    );
    setFollowerList(followerList);
    setIsFollowerRefreshing(false);
  };

  const fetchFollowingList = async () => {
    setIsFollowingRefreshing(true);
    const { data: followingList } = await serviceGetListFollowing(
      userProfile?.id
    );
    setFollowingList(followingList);
    setIsFollowingRefreshing(false);
  };

  useEffect(() => {
    if (!userProfile?.id) return;
    getFollowerList();
    getFollowingList();
  }, [userProfile?.id]);

  const titles = [
    t("profile_screen_tabs.biography"),
    t("profile_screen_tabs.skills"),
    t("profile_screen_tabs.followers"),
    t("profile_screen_tabs.following"),
  ];

  return (
    <View className={clsx("  w-full flex-1 bg-gray-50  ")}>
      <TabViewFlatlist
        titles={titles}
        children={[
          <Biography key="0" userProfile={userProfile} />,
          <Skills skills={userProfile?.softSkill} key="1" />,
          <Followers
            followers={followerList}
            isRefreshing={isFollowerRefreshing}
            getFollowerList={getFollowerList}
            key="2"
          />,
          <Following
            following={followingList}
            isRefreshing={isFollowingRefreshing}
            getFollowingList={fetchFollowingList}
            key="3"
          />,
        ]}
        activeTabClassName=""
        defaultTabClassName="text-gray-dark "
      />
    </View>
  );
};

export default ProfileTabs;
