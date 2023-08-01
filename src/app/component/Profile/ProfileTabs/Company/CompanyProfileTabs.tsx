import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import TabViewFlatlist from "../../../common/Tab/TabViewFlatlist";
import Followers from "../common/Followers/Followers";
import Following from "../common/Following/Following";
import Employees from "./Employees/Employees";
import { useUserProfileStore } from "../../../../store/user-store";
import Biography from "../Users/Biography/Biography";

import GlobalDialogController from "../../../common/Dialog/GlobalDialogController";
import {
  serviceGetListFollower,
  serviceGetListFollowing,
} from "../../../../service/profile";

const CompanyProfileTabs = () => {
  const [isFollowerRefreshing, setIsFollowerRefreshing] =
    useState<boolean>(false);
  const [isFollowingRefreshing, setIsFollowingRefreshing] =
    useState<boolean>(false);
  const [followerList, setFollowerList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const { t } = useTranslation();

  const { getUserProfile } = useUserProfileStore();
  const userProfile = getUserProfile();

  const getFollowerList = async () => {
    setIsFollowerRefreshing(true);
    const { data: followerList } = await serviceGetListFollower(
      userProfile?.id
    );
    setFollowerList(followerList);
    setIsFollowerRefreshing(false);
  };

  const getFollowingList = async () => {
    setIsFollowingRefreshing(true);
    const { data: followingList } = await serviceGetListFollowing(
      userProfile?.id
    );
    setFollowingList(followingList);
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
  const titles = [
    t("profile_screen_tabs.biography"),
    t("profile_screen_tabs.followers"),
    t("profile_screen_tabs.following"),
    t("profile_screen_tabs.employees"),
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <TabViewFlatlist
        titles={titles}
        children={[
          <Biography key="0" userProfile={userProfile} />,
          <Followers
            followers={followerList}
            isRefreshing={isFollowerRefreshing}
            getFollowerList={getFollowerList}
            key="2"
          />,
          <Following
            following={followingList}
            isRefreshing={isFollowingRefreshing}
            getFollowingList={getFollowingList}
            key="2"
          />,
          <Employees key="3" />,
        ]}
        activeTabClassName=""
        defaultTabClassName="text-gray-dark"
      />
    </View>
  );
};

export default CompanyProfileTabs;
