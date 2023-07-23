import React, { FC, useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

import TabViewFlatlist from "../../../common/Tab/TabViewFlatlist";

import Skills from "../Users/Skills";
import ChallengesTab from "./Challenges/ChallengesTab";
import { IUserData } from "../../../../types/user";
import Biography from "../Users/Biography/Biography";

import { fetchListEmployee } from "../../../../utils/profile";
import { useUserProfileStore } from "../../../../store/user-store";
import EmployeesCompany from "./EmployeesCompany";
import SkeletonLoadingCommon from "../../../common/SkeletonLoadings/SkeletonLoadingCommon";

interface IOtherUserProfileTabsProps {
  otherUserData: IUserData | null;
}

const OtherUserProfileTabs: FC<IOtherUserProfileTabsProps> = ({
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
    fetchListEmployee(otherUserData?.id, (res: any) => {
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
  }, []);

  const titles = isCurrentUserInCompany
    ? [
        t("profile_screen_tabs.biography"),
        !otherUserData?.companyAccount
          ? t("profile_screen_tabs.skills")
          : t("profile_screen_tabs.employees"),
        t("profile_screen_tabs.challenges"),
      ]
    : [
        t("profile_screen_tabs.biography"),
        !otherUserData?.companyAccount
          ? t("profile_screen_tabs.skills")
          : t("profile_screen_tabs.employees"),
        t("profile_screen_tabs.challenges"),
      ];

  return (
    <>
      {isLoading && <SkeletonLoadingCommon />}
      {!isLoading && (
        <FlatList
          data={[]}
          className={clsx("h-full flex-1 bg-gray-50")}
          renderItem={() => <View></View>}
          ListHeaderComponent={
            <>
              {otherUserData !== null && isCurrentUserInCompany !== null && (
                <TabViewFlatlist
                  titles={titles}
                  children={[
                    <Biography userProfile={otherUserData} key="0" />,
                    !isViewingUserCompanyAccount ? (
                      <Skills skills={otherUserData?.softSkill} key="1" />
                    ) : (
                      <EmployeesCompany key="1" employeeList={employeeList} />
                    ),
                    <ChallengesTab
                      isCurrentUserInSameCompanyWithViewingUser={
                        isCurrentUserInSameCompanyWithViewingUser
                      }
                      isCompanyAccount={isViewingUserCompanyAccount}
                      isCurrentUserInCompany={isCurrentUserInCompany}
                      userId={otherUserData.id}
                      key="2"
                    />,
                  ]}
                  defaultTabClassName="text-gray-dark"
                />
              )}
              {otherUserData === null && (
                <View className={clsx("flex-1  bg-gray-50")}>
                  <Text className={clsx("text-gray-dark")}>Loading...</Text>
                </View>
              )}
            </>
          }
        />
      )}
    </>
  );
};

export default OtherUserProfileTabs;
