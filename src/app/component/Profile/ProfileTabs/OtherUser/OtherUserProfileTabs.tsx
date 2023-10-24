import React, { FC, useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

import { IUserData } from "../../../../types/user";

import { fetchListEmployee } from "../../../../utils/profile";
import { useUserProfileStore } from "../../../../store/user-store";

import Skills from "../Users/Skills";
import ChallengesTab from "./Challenges/ChallengesTab";
import Biography from "../Users/Biography/Biography";
import EmployeesCompany from "./EmployeesCompany";
import SkeletonLoadingCommon from "../../../common/SkeletonLoadings/SkeletonLoadingCommon";
import { PROFILE_TABS_KEY } from "../../../../common/enum";
import CustomTabView from "../../../common/Tab/CustomTabView";
import { useTabIndex } from "../../../../hooks/useTabIndex";

interface IOtherUserProfileTabsProps {
  route: any;
  otherUserData: IUserData | null;
}

const OtherUserProfileTabs: FC<IOtherUserProfileTabsProps> = ({
  route,
  otherUserData,
}) => {
  const { t } = useTranslation();
  const [employeeList, setEmployeeList] = useState([]);
  const [isCurrentUserInCompany, setIsCurrentUserInCompany] = useState<
    boolean | null
  >(null);
  const [
    isCurrentUserInSameCompanyWithViewingUser,
    setIsCurrentUserInSameCompanyWithViewingUser,
  ] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const otherUserCompanyEmployeeOf = otherUserData?.employeeOf;

  const { getUserProfile } = useUserProfileStore();
  const userProfile = getUserProfile();
  const isViewingUserCompanyAccount = otherUserData?.companyAccount;

  const [tabRoutes] = useState([
    {
      key: PROFILE_TABS_KEY.BIOGRAPHY,
      title: t("profile_screen_tabs.biography"),
    },
    isViewingUserCompanyAccount
      ? {
          key: PROFILE_TABS_KEY.EMPLOYEES,
          title: t("profile_screen_tabs.employees"),
        }
      : {
          key: PROFILE_TABS_KEY.SKILLS,
          title: t("profile_screen_tabs.skills"),
        },
    {
      key: PROFILE_TABS_KEY.CHALLENGES,
      title: t("profile_screen_tabs.challenges"),
    },
  ]);

  const { index, setTabIndex } = useTabIndex({ tabRoutes, route });

  useEffect(() => {
    if (
      otherUserCompanyEmployeeOf?.id === userProfile?.employeeOf?.id &&
      otherUserCompanyEmployeeOf?.id != null
    ) {
      setIsCurrentUserInSameCompanyWithViewingUser(true);
    } else {
      setIsCurrentUserInSameCompanyWithViewingUser(false);
    }
  }, []);

  useEffect(() => {
    if (!otherUserData?.id) return;
    //TODO add typescript
    const fetchEmployee = async (userId: string) => {
      try {
        fetchListEmployee(userId, (res: any) => {
          if (
            !!res?.find((item: any) => item?.id === userProfile?.id) ||
            otherUserData?.id === userProfile?.id
          ) {
            setIsCurrentUserInCompany(true);
          } else {
            setIsCurrentUserInCompany(false);
          }
          return setEmployeeList(res);
        });
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEmployee(otherUserData?.id);
  }, []);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case PROFILE_TABS_KEY.BIOGRAPHY:
        return <Biography userProfile={otherUserData} />;

      case PROFILE_TABS_KEY.EMPLOYEES:
        return <EmployeesCompany employeeList={employeeList} />;
      case PROFILE_TABS_KEY.SKILLS:
        return (
          <Skills
            skills={otherUserData?.softSkill}
            ratedSkill={otherUserData?.ratedSkill}
          />
        );
      case PROFILE_TABS_KEY.CHALLENGES:
        return (
          <ChallengesTab
            isCurrentUserInSameCompanyWithViewingUser={
              isCurrentUserInSameCompanyWithViewingUser
            }
            isCompanyAccount={isViewingUserCompanyAccount}
            isCurrentUserInCompany={isCurrentUserInCompany}
            userId={otherUserData.id}
          />
        );
    }
  };

  return (
    <View className="h-full flex-1 bg-gray-50">
      {isLoading && <SkeletonLoadingCommon />}
      {!isLoading && (
        <CustomTabView
          routes={tabRoutes}
          renderScene={renderScene}
          index={index}
          setIndex={setTabIndex}
        />
      )}
    </View>
  );
};

export default OtherUserProfileTabs;
