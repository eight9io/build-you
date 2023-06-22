import clsx from 'clsx';

import { useTranslation } from 'react-i18next';
import { FC, useState } from 'react';
import { View, Text } from 'react-native';

import { IUserData } from '../../../types/user';

import CompanyProfileTabs from '../ProfileTabs/Company';
import CoverImage from '../CoverImage/CoverImage';

import { OutlineButton } from '../../common/Buttons/Button';
import ProfileAvartar from '../../common/Avatar/ProfileAvatar/ProfileAvatar';
import EditCompanyProfileModal from '../../modal/company/EditCompanyProfileModal';
import { TopSectionProfile } from '../ProfileComponent';




interface ICompanyProfileComponentProps {
  userData: IUserData | null;
  navigation: any;
  setIsLoading: (value: boolean) => void;
}

const CompanyProfileComponent: FC<ICompanyProfileComponentProps> = ({
  userData,
  navigation,
  setIsLoading,
}) => {
  const { t } = useTranslation();
  return (
    <View className={clsx('relative h-full flex-1 flex-col bg-white')}>
      <TopSectionProfile
        navigation={navigation}
        userData={userData}
        setIsLoading={setIsLoading}
      />
      <View className={clsx('mb-3 px-4 pt-12')}>
        <Text className={clsx('text-[26px] font-medium')}>
          {userData?.name} {userData?.surname}
        </Text>
      </View>
      <CompanyProfileTabs />
    </View>
  );
};

export default CompanyProfileComponent;
