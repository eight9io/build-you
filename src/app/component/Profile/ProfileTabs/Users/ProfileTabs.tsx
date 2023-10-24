import React, { FC, useEffect, useState } from "react";
import clsx from "clsx";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { RouteProp } from "@react-navigation/native";

import { PROFILE_TABS_KEY } from "../../../../common/enum";
import { RootStackParamList } from "../../../../navigation/navigation.type";

import { useTabIndex } from "../../../../hooks/useTabIndex";
import {
  serviceGetListFollower,
  serviceGetListFollowing,
} from "../../../../service/profile";

import {
  useFollowingListStore,
  useUserProfileStore,
} from "../../../../store/user-store";

import Biography from "./Biography/Biography";
import Skills from "./Skills";
import Followers from "../common/Followers/Followers";
import Following from "../common/Following/Following";
import { CrashlyticService } from "../../../../service/crashlytic";

import CustomTabView from "../../../common/Tab/CustomTabView";

interface IProfileTabsProps {
  route: RouteProp<RootStackParamList, "ProfileScreen">;
}

const ProfileTabs: FC<IProfileTabsProps> = ({ route }) => {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [isFollowerRefreshing, setIsFollowerRefreshing] =
    useState<boolean>(false);
  const [isFollowingRefreshing, setIsFollowingRefreshing] =
    useState<boolean>(false);
  const [followerList, setFollowerList] = useState([]);
  const { getFollowingList, setFollowingList } = useFollowingListStore();
  const followingList = getFollowingList();
  const { getUserProfile } = useUserProfileStore();
  const userProfile = getUserProfile();
  const { t } = useTranslation();

  const [tabRoutes] = useState([
    {
      key: PROFILE_TABS_KEY.BIOGRAPHY,
      title: t("profile_screen_tabs.biography"),
    },
    {
      key: PROFILE_TABS_KEY.SKILLS,
      title: t("profile_screen_tabs.skills"),
    },
    {
      key: PROFILE_TABS_KEY.FOLLOWERS,
      title: t("profile_screen_tabs.followers"),
    },
    {
      key: PROFILE_TABS_KEY.FOLLOWING,
      title: t("profile_screen_tabs.following"),
    },
  ]);

  const { index, setTabIndex } = useTabIndex({ tabRoutes, route });

  const getFollowerList = async () => {
    setIsFollowerRefreshing(true);
    try {
      const { data: followerList } = await serviceGetListFollower(
        userProfile?.id
      );
      setFollowerList(followerList);
    } catch (error) {
      console.error("getFollowerList", error);
      CrashlyticService({
        errorType: "Fetch Follower List Error",
        error,
      });
    }
    setIsFollowerRefreshing(false);
  };

  const fetchFollowingList = async () => {
    setIsFollowingRefreshing(true);
    try {
      const { data: followingList } = await serviceGetListFollowing(
        userProfile?.id
      );
      setFollowingList(followingList);
    } catch (error) {
      console.error("fetchFollowingList", error);
      CrashlyticService({
        errorType: "Fetch Following List Error",
        error,
      });
    }
    setIsFollowingRefreshing(false);
  };

  useEffect(() => {
    if (!userProfile?.id) return;
    getFollowerList();
    getFollowingList();
  }, [userProfile?.id]);

  useEffect(() => {
    if (currentTab === 2) {
      getFollowerList();
    }
    if (currentTab === 3) {
      fetchFollowingList();
    }
  }, [currentTab]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case PROFILE_TABS_KEY.BIOGRAPHY:
        return <Biography userProfile={userProfile} />;
      case PROFILE_TABS_KEY.FOLLOWERS:
        return (
          <Followers
            followers={followerList}
            isRefreshing={isFollowerRefreshing}
            getFollowerList={getFollowerList}
          />
        );
      case PROFILE_TABS_KEY.FOLLOWING:
        return (
          <Following
            following={followingList}
            isRefreshing={isFollowingRefreshing}
            getFollowingList={getFollowingList}
          />
        );
      case PROFILE_TABS_KEY.SKILLS:
        return (
          <Skills
            skills={userProfile?.softSkill}
            ratedSkill={userProfile?.ratedSkill}
          />
        );
    }
  };

  return (
    <View className={clsx("  w-full flex-1 bg-gray-50  ")}>
      <CustomTabView
        routes={tabRoutes}
        renderScene={renderScene}
        index={index}
        setIndex={setTabIndex}
      />
    </View>
  );
};

export default ProfileTabs;
