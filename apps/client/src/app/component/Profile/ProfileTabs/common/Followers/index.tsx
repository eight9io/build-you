import { FC } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

interface IFollowersProps {
  followers: {
    id: number;
    avatar: string;
    name: string;
  }[];
}

const Followers: FC<IFollowersProps> = ({ followers = [] }) => {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={followers}
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
      />
    </View>
  );
};

export default Followers;
