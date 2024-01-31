import React, { FC, useEffect, useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { RouteProp } from "@react-navigation/native";

import { PROFILE_TABS_KEY } from "../../../../common/enum";
import { RootStackParamList } from "../../../../navigation/navigation.type";

import {
  serviceGetListFollower,
  serviceGetListFollowing,
} from "../../../../service/profile";
import { useTabIndex } from "../../../../hooks/useTabIndex";
import { useUserProfileStore } from "../../../../store/user-store";
import { CrashlyticService } from "../../../../service/crashlytic";

import Employees from "./Employees/Employees";
import Followers from "../common/Followers/Followers";
import Following from "../common/Following/Following";
import Biography from "../Users/Biography/Biography";
import CustomTabView from "../../../common/Tab/CustomTabView";
import GlobalDialogController from "../../../common/Dialog/GlobalDialog/GlobalDialogController";

interface ICompanyProfileTabsProps {
  route: RouteProp<RootStackParamList, "CompanyProfileScreen">;
}

const CompanyProfileTabs: FC<ICompanyProfileTabsProps> = ({ route }) => {
  const [isFollowerRefreshing, setIsFollowerRefreshing] =
    useState<boolean>(false);
  const [isFollowingRefreshing, setIsFollowingRefreshing] =
    useState<boolean>(false);
  const [followerList, setFollowerList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const { t } = useTranslation();

  const [tabRoutes] = useState([
    {
      key: PROFILE_TABS_KEY.BIOGRAPHY,
      title: t("profile_screen_tabs.biography"),
    },
    {
      key: PROFILE_TABS_KEY.FOLLOWERS,
      title: t("profile_screen_tabs.followers"),
    },
    {
      key: PROFILE_TABS_KEY.FOLLOWING,
      title: t("profile_screen_tabs.following"),
    },
    {
      key: PROFILE_TABS_KEY.EMPLOYEES,
      title: t("profile_screen_tabs.employees"),
    },
  ]);

  const { getUserProfile } = useUserProfileStore();
  const userProfile = getUserProfile();

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

  const getFollowingList = async () => {
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
    try {
      getFollowerList();
      getFollowingList();
    } catch (error) {
      GlobalDialogController.showModal({
        title: t("dialog.err_title") || "Error",
        message: t("errorMessage:500") as string,
      });
    }
  }, [userProfile?.id]);

  if (!userProfile?.id) return null;

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
      case PROFILE_TABS_KEY.EMPLOYEES:
        return <Employees />;
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <CustomTabView
        routes={tabRoutes}
        renderScene={renderScene}
        index={index}
        setIndex={setTabIndex}
      />
    </View>
  );
};

export default CompanyProfileTabs;
