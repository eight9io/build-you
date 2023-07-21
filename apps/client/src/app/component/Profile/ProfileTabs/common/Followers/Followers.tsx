import { FC } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';

import Empty from '../asset/emptyFollow.svg';
import { useTranslation } from 'react-i18next';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../../../navigation/navigation.type';
import { IUserData } from 'apps/client/src/app/types/user';
import clsx from 'clsx';

interface IFollowersProps {
  followers: IUserData[];
}

const Followers: FC<IFollowersProps> = ({ followers = [] }) => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <View className=" flex-1 px-4 ">
      {followers.length > 0 && (
        <FlatList
          data={followers}
          className="pt-4"
          showsVerticalScrollIndicator={true}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('OtherUserProfileScreen', {
                    userId: item.id,
                  })
                }
                className="mb-5 flex-row items-center gap-3"
              >
                <View className="relative">
                  <Image
                    className="h-10 w-10 rounded-full"
                    source={require('../asset/avatar-load.png')}
                  />
                  {item?.avatar && (
                    <Image
                      source={{ uri: item.avatar.trim() }}
                      className={clsx(
                        'absolute left-0  top-0 h-10 w-10  rounded-full'
                      )}
                    />
                  )}
                </View>
                <Text className="text-basic-black text-base font-semibold">
                  {item.name} {item.surname}
                </Text>
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={<View className="h-20" />}
        />
      )}
      {followers.length == 0 && (
        <View className=" h-full flex-1 items-center justify-center">
          <Empty />
          <Text className="text-h6 font-light leading-10 text-[#6C6E76]">
            {t('empty_followers')}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Followers;
