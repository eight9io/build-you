import { FC } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import Empty from '../asset/emptyFollow.svg';
import { useTranslation } from 'react-i18next';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from 'apps/client/src/app/navigation/navigation.type';
import { IUserData } from 'apps/client/src/app/types/user';
interface IFollowersProps {
  followers: IUserData[]
}

const Followers: FC<IFollowersProps> = ({ followers = [] }) => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <View className="mr-2 flex-1">
      {followers.length > 0 && <FlatList
        data={followers}
        className="pt-4"
        showsVerticalScrollIndicator={true}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('OtherUserProfileScreen', { userId: item.id })}
              className="mb-5 flex-row items-center gap-3"
            >
              <Image
                source={{ uri: item.avatar }}
                resizeMode="contain"
                className="h-10 w-10 rounded-full"
              />
              <Text className="text-basic-black text-base font-semibold">
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={<View className="h-20" />}
      />}
      {
        followers.length == 0 && (<View className="flex-1 justify-center items-center mb-[100px]">
          <Empty />
          <Text className='text-h6 text-[#6C6E76] font-light leading-10'>{t('empty_followers')}</Text>
        </View>)
      }
    </View>
  );
};

export default Followers;
