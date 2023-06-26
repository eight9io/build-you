import clsx from 'clsx';
import { IUserData } from '../../../../../types/user';
import { FC } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import Empty from '../asset/emptyFollow.svg';
import { useTranslation } from 'react-i18next';
import GlobalDialogController from '../../../../common/Dialog/GlobalDialogController';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from 'apps/client/src/app/navigation/navigation.type';
interface IFollowingProps {
  following: IUserData[] | null;
}

const Following: FC<IFollowingProps> = ({ following = [] }) => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <View className="-mr-2 flex-1">
      {following && following.length > 0 && <FlatList
        className="pt-4"
        keyExtractor={(item, index) => index.toString()}
        data={following}
        showsVerticalScrollIndicator={true}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('OtherUserProfileScreen', { userId: item.id })}
              className="mb-5 flex-row items-center gap-3"
            >
              <View className="relative">
                <Image
                  className={clsx(
                    'absolute left-0  top-0 h-10 w-10  rounded-full'
                  )}
                  source={require('../asset/avatar-load.png')}
                  alt="profile image"
                />
                <Image
                  source={{ uri: item.avatar }}
                  resizeMode="cover"
                  className="h-10 w-10 rounded-full"
                />
              </View>
              <Text className="text-basic-black text-base font-semibold">
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={<View className="h-20" />}
      />}
      {
        following && following.length == 0 && (<View className="flex-1 justify-center items-center mb-[100px]">
          <Empty />
          <Text className='text-h6 text-[#6C6E76] font-light leading-10'>{t('empty_following')}</Text>
        </View>)
      }
    </View>
  );
};

export default Following;
