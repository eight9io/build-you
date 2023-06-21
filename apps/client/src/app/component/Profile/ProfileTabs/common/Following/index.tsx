import { FC } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

interface IFollowingProps {
  following: {
    id: number;
    avatar: string;
    name: string;
  }[];
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
              onPress={() => {}}
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
      />
    </View>
  );
};

export default Following;
