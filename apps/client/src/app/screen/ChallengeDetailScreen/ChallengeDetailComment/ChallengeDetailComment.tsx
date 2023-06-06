import React, { FC } from 'react';
import { SafeAreaView, View, Text, ScrollView } from 'react-native';
import { NavigationProp, Route, useNavigation } from '@react-navigation/native';
import clsx from 'clsx';

import { ChallengeProgressCardForComment } from '../../../component/Post/ChallengeProgressCard';
import Header from '../../../component/common/Header';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../../../navigation/navigation.type';
import NavButton from '../../../component/common/Buttons/NavButton';
import SingleComment from '../../../component/common/SingleComment';

interface IChallengeDetailCommentProps {
  route: Route<
    'ChallengeDetailComment',
    {
      challengeId: string;
    }
  >;
}

const item = {
  id: '1',
  avatar: 'avata',
  name: 'Marco Rossi',
  time: '1 hour ago',
  stt: "I finally bought the equipment for my challenge. Mont Blanc I'm coming!!! 🧗🏻‍♂️",
  card: {
    image: 'https://picsum.photos/200/300',
    title: 'Lose 10kg',
    builder: 'Marco Rossi',
  },
  like: 5,
  comment: 0,
};

const COMMENTS = [
  {
    id: '1',
    user: {
      name: 'Marco Rossi',
      avatar: 'https://picsum.photos/200/300',
    },
    time: '1 hour ago',

    comment:
      "I finally bought the equipment for my challenge. Mont Blanc I'm coming!!! 🧗🏻‍♂️",
    isOwner: true,
  },
  {
    id: '2',
    user: {
      name: 'Marco Rossi',
      avatar: 'https://picsum.photos/200/300',
    },
    time: '1 hour ago',
    comment:
      "I finally bought the equipment for my challenge. Mont Blanc I'm coming!!! 🧗🏻‍♂️",
    isOwner: true,
  },
  {
    id: '3',
    user: {
      name: 'Marco Rossi',
      avatar: 'https://picsum.photos/200/300',
    },
    time: '1 hour ago',
    comment:
      "I finally bought the equipment for my challenge. Mont Blanc I'm coming!!! 🧗🏻‍♂️",
    isOwner: false,
  },
];

const ChallengeDetailComment: FC<IChallengeDetailCommentProps> = ({
  route,
}) => {
  const { challengeId } = route.params;
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView className={clsx('flex-1 bg-white')}>
      <ScrollView className={clsx('bg-gray-50')} style={{ width: '100%' }}>
        {/* <Header
          leftBtn={
            <NavButton
              text="Back"
              withBackIcon={true}
              onPress={() => navigation.goBack()}
            />
          }
        /> */}
        <View
          className={clsx(
            'border-gray-light flex flex-1 flex-col border-b pb-4'
          )}
        >
          <View
            className={clsx(
              'border-gray-light flex border-b bg-white px-5 py-3 '
            )}
          >
            <Text className={clsx('text-h4 font-semibold')}>
              {item.card.title}
            </Text>
          </View>
          <ChallengeProgressCardForComment item={item} />
        </View>
        <View className="flex flex-1 flex-col justify-start">
          {COMMENTS.map((item, id) => (
            <View key={id}>
              <SingleComment comment={item} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChallengeDetailComment;
