import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import TabViewFlatlist from "../../../common/Tab/TabViewFlatlist";
import Followers from "../common/Followers/Followers";
import Following from "../common/Following/Following";
import Employees from "./Employees/Employees";
import {
  useFollowingListStore,
  useUserProfileStore,
} from "../../../../store/user-store";
import Biography from "../Users/Biography/Biography";

import GlobalDialogController from "../../../common/Dialog/GlobalDialogController";
import { serviceGetListFollower } from "../../../../service/profile";

const CompanyProfileTabs = () => {
  const { t } = useTranslation();

  const { getUserProfile } = useUserProfileStore();
  const userProfile = getUserProfile();

  const { getFollowingList } = useFollowingListStore();
  const [followerList, setFollowerList] = useState([]);
  // const isFocused = useIsFocused();

  useEffect(() => {
    if (!userProfile?.id) return;

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
        title: "Error",
        message: t("errorMessage:500") as string,
      });
    }
  }, []);

  const followingList = getFollowingList();
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
