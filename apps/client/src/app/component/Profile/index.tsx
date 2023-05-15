import clsx from 'clsx';
import React from 'react';

import { View, Text, Image } from 'react-native';

import ProfileTabs from './ProfileTabs';
import CoverImage from './CoverImage';
import Button from '../common/Buttons/Button';
import ProfileAvartar from '../common/Avatar/ProfileAvartar';

import { useTranslation } from 'react-i18next';

const TopSectionProfile = () => {
  const { t } = useTranslation();
  return (
    <View className={clsx('relative')}>
      <CoverImage src="https://images.unsplash.com/photo-1522774607452-dac2ecc66330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" />

      <View className={clsx('absolute bottom-[-40px] left-0 ml-4')}>
        <ProfileAvartar src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80" />
      </View>
      <View className={clsx('absolute bottom-[-25px] right-4')}>
        <Button
          title={t('button.edit_profile')}
          containerClassName={clsx(
            'border-primary-default bg-white border-[1px] w-[164px]'
          )}
          textClassName={clsx('text-primary-default text-md font-medium')}
        />
      </View>
    </View>
  );
};

const ProfileComponent = () => {
  const { t } = useTranslation();
  return (
    <View className={clsx('flex-1 flex-col pt-2')}>
      <TopSectionProfile />
      <View className={clsx('px-4 pt-12 mb-3')}>
        <Text className={clsx('text-[26px] font-medium')}>Marco Rossi</Text>
      </View>
      <ProfileTabs />
    </View>
  );
};

export default ProfileComponent;
