import clsx from 'clsx';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import Empty from './assets/emptyFollow.svg';
interface IParticipantsTabProps {
  participant?: {
    id: string | number;
    avatar: string;
    name: string;
  }[];
}

const ParticipantsTab: FC<IParticipantsTabProps> = ({ participant = [] }) => {
  const { t } = useTranslation();
  return (
    <View className={clsx('mb-32 flex-1 px-4 pt-4')}>
      {participant.length > 0 && (
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={participant}
          showsVerticalScrollIndicator={true}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => {}}
                className="mb-5 flex-row items-center gap-3"
              >
                {item?.avatar && (
                  <Image
                    source={{ uri: item.avatar }}
                    resizeMode="contain"
                    className="h-10 w-10 rounded-full"
                  />
                )}
                {!item?.avatar && (
                  <Image
                    className={clsx('h-10 w-10 rounded-full')}
                    source={require('../../../../common/image/avatar-load.png')}
                  />
                )}
                <Text className="text-basic-black text-base font-semibold">
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
      {participant.length == 0 && (
        <View className=" flex-1 items-center justify-center">
          <Empty />
          <Text className="text-h6 font-light leading-10 text-[#6C6E76]">
            {t('challenge_detail_screen.not_participants')}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ParticipantsTab;
