import React, { FC, useEffect, useState } from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import TabViewFlatlist from '../../../common/Tab/TabViewFlatlist';

import Skills from '../Users/Skills';
import ChallengesTab from './Challenges/ChallengesTab';
import { IUserData } from '../../../../types/user';
import Biography from '../Users/Biography/Biography';

import { fetchListEmployee } from 'apps/client/src/app/utils/profile';
import { useUserProfileStore } from 'apps/client/src/app/store/user-data';
import EmployeesCompany from './EmployeesCompany';

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

  const { getUserProfile } = useUserProfileStore();
  const userProfile = getUserProfile();
  const isCompanyAccount = otherUserData?.companyAccount;

  useEffect(() => {
    if (!otherUserData?.id) return;
    fetchListEmployee(otherUserData?.id, (res: any) => {
      if (
        !!res?.find((item: any) => item?.employeeof?.id === userProfile?.id) ||
        otherUserData?.id === userProfile?.id
      ) {
        setIsCurrentUserInCompany(true);
      } else {
        setIsCurrentUserInCompany(false);
      }
      return setEmployeeList(res);
    });
  }, [otherUserData?.id]);

  const titles = isCurrentUserInCompany
    ? [
        t('profile_screen_tabs.biography'),
        !otherUserData?.companyAccount
          ? t('profile_screen_tabs.skills')
          : t('profile_screen_tabs.employees'),
      ]
    : [
        t('profile_screen_tabs.biography'),
        !otherUserData?.companyAccount
          ? t('profile_screen_tabs.skills')
          : t('profile_screen_tabs.employees'),
        t('profile_screen_tabs.challenges'),
      ];

  return (
    <FlatList
      data={[]}
      className={clsx('h-full flex-1 bg-gray-50')}
      renderItem={() => <View></View>}
      ListHeaderComponent={
        <>
          {otherUserData !== null && (
            <TabViewFlatlist
              titles={titles}
              children={[
                <Biography userProfile={otherUserData} key="0" />,
                !isCompanyAccount ? (
                  <Skills skills={otherUserData?.softSkill} key="1" />
                ) : (
                  <EmployeesCompany key="1" employeeList={employeeList} />
                ),
                !isCurrentUserInCompany && (
                  <ChallengesTab
                    isCompanyAccount={isCompanyAccount}
                    isCurrentUserInCompany={isCurrentUserInCompany}
                    userId={otherUserData.id}
                    key="2"
                  />
                ),
              ]}
              defaultTabClassName="text-gray-dark"
            />
          )}
          {otherUserData === null && (
            <View className={clsx('flex-1  bg-gray-50')}>
              <Text className={clsx('text-gray-dark')}>Loading...</Text>
            </View>
          )}
        </>
      }
    />
  );
};

export default OtherUserProfileTabs;
