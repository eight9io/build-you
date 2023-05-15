import clsx from 'clsx';

import { View, Text } from 'react-native';

import ProfileTabs from './ProfileTabs';
import CoverImage from './CoverImage';
import { OutlineButton } from '../common/Buttons/Button';
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
        <OutlineButton
          title={t('button.edit_profile')}
          containerClassName="px-11 py-2"
          textClassName="text-base"
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
      <View className={clsx('mb-3 px-4 pt-12')}>
        <Text className={clsx('text-[26px] font-medium')}>Marco Rossi</Text>
      </View>
      <ProfileTabs />
    </View>
  );
};

export default ProfileComponent;
