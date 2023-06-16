import clsx from 'clsx';

import { useTranslation } from 'react-i18next';
import { FC, useState } from 'react';
import { View, Text } from 'react-native';

import ProfileTabs from './ProfileTabs/Users';
import CoverImage from './CoverImage';

import { OutlineButton } from '../common/Buttons/Button';
import Button from '../common/Buttons/Button';
import ProfileAvartar from '../common/Avatar/ProfileAvatar';

import { IUserData } from '../../types/user';
import { useNavigation } from '@react-navigation/native';
import Loading from '../common/Loading';
import { ScrollView } from 'react-native-gesture-handler';

interface ITopSectionProfileProps {
  navigation: any;
  userData: IUserData | null;
  setIsLoadingAvatar: (value: boolean) => void;
}

interface IProfileComponentProps {
  userData: IUserData | null;
  navigation: any;
  isLoadingAvatar: boolean;
  setIsLoadingAvatar: (value: boolean) => void;
}
const coverDefaultImage = "https://images.unsplash.com/photo-1522774607452-dac2ecc66330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
const TopSectionProfile: FC<ITopSectionProfileProps> = ({
  navigation,
  userData,
  setIsLoadingAvatar,
}) => {
  const { t } = useTranslation();
  const handleClicked = () => {
    navigation.navigate('EditPersonalProfileScreen');
  };
  return (
    <View className={clsx('relative z-10')}>
      <CoverImage src={userData?.cover as string || coverDefaultImage} />

      <View className={clsx('absolute bottom-[-40px] left-0 ml-4')}>
        <ProfileAvartar
          src={userData?.avatar as string}
          setIsLoadingAvatar={setIsLoadingAvatar}
        />
      </View>
      <View className={clsx('absolute bottom-[-25px] right-4 ')}>
        <OutlineButton
          title={t('button.edit_profile')}
          containerClassName="px-11 py-2"
          textClassName="text-base"
          onPress={handleClicked}
        />
      </View>
    </View>
  );
};

const ProfileComponent: FC<IProfileComponentProps> = ({
  userData,
  navigation,
  setIsLoadingAvatar,
  isLoadingAvatar,
}) => {
  return (
    <View className={clsx('relative mb-24 h-full flex-1 flex-col ')}>
      <TopSectionProfile
        navigation={navigation}
        userData={userData}
        setIsLoadingAvatar={setIsLoadingAvatar}
      />
      <View className={clsx('mb-3 px-4 pt-12')}>
        <Text className={clsx('text-[26px] font-medium')}>
          {userData?.name} {userData?.surname}
        </Text>
      </View>
      <ProfileTabs />
    </View>
  );
};

export default ProfileComponent;
