import clsx from 'clsx';
import { FC } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

interface IParticipantsTabProps {
  participant?: {
    id: string | number;
    avatar: string;
    name: string;
  }[];
}

const ParticipantsTab: FC<IParticipantsTabProps> = ({ participant = [] }) => {
  return (
    <View className={clsx('mb-32 flex-1 px-4 pt-4')}>
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={participant}
        showsVerticalScrollIndicator={true}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => { }}
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

export default ParticipantsTab;
