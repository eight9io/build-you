import React, { FC, useState } from 'react';
import { View, FlatList, SafeAreaView, Text, ScrollView } from 'react-native';
import { NavigationProp, Route, useNavigation } from '@react-navigation/native';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { IUserData } from '../../../types/user';
import { ITopSectionProfileProps } from '../../../component/Profile/ProfileComponent';
import { RootStackParamList } from '../../../navigation/navigation.type';
import { useGetOtherUserData } from '../../../hooks/useGetUser';
import { isObjectEmpty } from '../../../utils/common';

import Loading from '../../../component/common/Loading';
import CoverImage from '../../../component/Profile/CoverImage/CoverImage';
import ProfileAvatar from '../../../component/common/Avatar/ProfileAvatar/ProfileAvatar';
import { OutlineButton } from '../../../component/common/Buttons/Button';
import SkeletonLoadingCommon from '../../../component/common/SkeletonLoadings/SkeletonLoadingCommon';

import DefaultAvatar from '../../../component/asset/default-avatar.svg';
import OtherUserProfileTabs from '../../../component/Profile/ProfileTabs/OtherUser';

interface IOtherUserProfileComponentProps {
  userId: string | null | undefined;
  navigation: any;
  isLoadingAvatar?: boolean;
  setIsLoadingAvatar: (value: boolean) => void;
}

interface ITopSectionOtherProfileProps {
  otherUserData: IUserData | null;
  setIsLoadingAvatar: (value: boolean) => void;
}

const TopSectionOtherProfile: FC<ITopSectionOtherProfileProps> = ({
  otherUserData,
  setIsLoadingAvatar,
}) => {
  const { t } = useTranslation();

  const isCurrentUserFollowed = false;

  const handleFllowClicked = () => {
    console.log('Follow clicked');
  };

  const handleUnfollowClicked = () => {
    console.log('Unfollow clicked');
  };

  return (
    <View className={clsx('relative z-10 bg-white')}>
      <CoverImage
        isOtherUser
        src="https://images.unsplash.com/photo-1522774607452-dac2ecc66330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
      />

      <View className={clsx('absolute bottom-[-40px] left-0 ml-4')}>
        {otherUserData?.avatar ? (
          <ProfileAvatar
            isOtherUser
            src={otherUserData?.avatar as string}
            setIsLoadingAvatar={setIsLoadingAvatar}
          />
        ) : (
          <View className={clsx('h-[101px] w-[101px] rounded-full bg-white')}>
            <DefaultAvatar />
          </View>
        )}
      </View>
      <View className={clsx('absolute bottom-[-25px] right-4 ')}>
        {isCurrentUserFollowed ? (
          <OutlineButton
            title={t('button.follow')}
            containerClassName="px-11 py-2"
            textClassName="text-base"
            onPress={handleFllowClicked}
          />
        ) : (
          <OutlineButton
            title={t('button.unfollow')}
            containerClassName="px-11 py-2"
            textClassName="text-base"
            onPress={handleUnfollowClicked}
          />
        )}
      </View>
    </View>
  );
};

interface IOtherUserProfileScreenProps {
  route: Route<
    'OtherUserProfileScreen',
    {
      userId: string;
    }
  >;
}

const OtherUserProfileComponent: FC<IOtherUserProfileComponentProps> = ({
  userId,
  setIsLoadingAvatar,
}) => {
  const otherUserData = useGetOtherUserData(userId);

  if (isObjectEmpty(otherUserData)) {
    return (
      <View className={clsx('relative mb-24 h-full flex-1 flex-col ')}>
        <SkeletonLoadingCommon />
      </View>
    );
  }

  return (
    <View className={clsx('relative mb-24 h-full flex-1 flex-col ')}>
      <TopSectionOtherProfile
        otherUserData={otherUserData}
        setIsLoadingAvatar={setIsLoadingAvatar}
      />
      <View className={clsx('bg-white px-4 pb-3 pt-12')}>
        <Text className={clsx('text-[26px] font-medium')}>
          {otherUserData?.name} {otherUserData?.surname}
        </Text>
      </View>
      <OtherUserProfileTabs otherUserData={otherUserData} />
    </View>
  );
};

const OtherUserProfileScreen: FC<IOtherUserProfileScreenProps> = ({
  route,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isLoadingAvatar, setIsLoadingAvatar] = useState<boolean>(false);
  const { userId } = route.params;

  return (
    <SafeAreaView className="justify-content: space-between h-full flex-1 bg-gray-50">
      <View className="h-full">
        <OtherUserProfileComponent userId={userId} navigation={navigation} setIsLoadingAvatar={setIsLoadingAvatar} />
        {isLoadingAvatar && (
          <Loading containerClassName="absolute top-0 left-0 z-10 h-full " />
        )}
      </View>
    </SafeAreaView>
  );
};

export default OtherUserProfileScreen;
