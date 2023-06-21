import clsx from 'clsx';
import { IUserData } from '../../../../../types/user';
import { FC } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

interface IFollowingProps {
  following: IUserData[];
}

const Following: FC<IFollowingProps> = ({ following = [] }) => {
  return (
    <View className="-mr-2 flex-1">
      <FlatList
        className="pt-4"
        keyExtractor={(item, index) => index.toString()}
        data={following}
        showsVerticalScrollIndicator={true}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => { }}
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
      />
    </View>
  );
};

export default Following;
