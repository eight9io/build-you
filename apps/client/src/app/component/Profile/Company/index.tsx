import clsx from 'clsx';

import { useTranslation } from 'react-i18next';
import { FC, useState } from 'react';
import { View, Text } from 'react-native';

import CompanyProfileTabs from '../ProfileTabs/Company';
import CoverImage from '../CoverImage/CoverImage';

import { OutlineButton } from '../../common/Buttons/Button';
import ProfileAvartar from '../../common/Avatar/ProfileAvatar/ProfileAvatar';
import EditCompanyProfileModal from '../../modal/company/EditCompanyProfileModal';

interface ITopSectionCompanyProfileProps {
  onEditBtnClicked: () => void;
}

const TopSectionCompanyProfile: FC<ITopSectionCompanyProfileProps> = ({
  onEditBtnClicked,
}) => {
  const { t } = useTranslation();

  return (
    <View className={clsx('relative')}>
      <CoverImage src="https://images.unsplash.com/photo-1522774607452-dac2ecc66330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" />

      <View className={clsx('absolute bottom-[-40px] left-0 ml-4')}>
        <ProfileAvartar src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80" />
      </View>
      <View className={clsx('absolute bottom-[-25px] right-4')}>
        <OutlineButton
          title={t('button.edit_companyProfile')}
          containerClassName="px-11 py-2 z-20"
          textClassName="text-base"
          onPress={onEditBtnClicked}
        />
      </View>
    </View>
  );
};

const CompanyProfileComponent = () => {
  const { t } = useTranslation();
  const [editCompanyProfileModalIsOpen, setEditCompanyProfileModalIsOpen] =
    useState(false);

  const handleEditCompanyProfileModalOpen = () => {
    setEditCompanyProfileModalIsOpen(true);
  };
  const handleEditCompanyProfileModalClose = () => {
    setEditCompanyProfileModalIsOpen(false);
  };

  return (
    <View className={clsx('flex-1 flex-col pt-2')}>
      <TopSectionCompanyProfile
        onEditBtnClicked={handleEditCompanyProfileModalOpen}
      />
      <View className={clsx('mb-3 mt-12 px-4')}>
        <Text className={clsx('text-[26px] font-medium')}>Company A</Text>
      </View>
      <CompanyProfileTabs />
      <EditCompanyProfileModal
        isVisible={editCompanyProfileModalIsOpen}
        onClose={handleEditCompanyProfileModalClose}
      />
    </View>
  );
};

export default CompanyProfileComponent;
