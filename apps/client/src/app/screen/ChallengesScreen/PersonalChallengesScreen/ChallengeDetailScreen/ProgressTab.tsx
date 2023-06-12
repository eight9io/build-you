import { View, Text, ScrollView, FlatList } from 'react-native';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../../component/common/Buttons/Button';

import AddIcon from '../../../../component/asset/add.svg';

import AddNewChallengeProgressModal from '../../../../component/modal/AddNewChallengeProgressModal';
import ProgressCard from '../../../../component/Card/ProgressCard/ProgressCard';

const arrayPost = [
  {
    id: 1,
    avatar: 'avata',
    name: 'Marco Rossi',
    time: '1 hour ago',
    stt: "I finally bought the equipment for my challenge. Mont Blanc I'm coming!!! 🧗🏻‍♂️",
    card: {
      image: 'https://picsum.photos/200/300',
      title: 'Climbing Mont Blanc',
      builder: 'Marco Rossi',
    },
    like: 5,
    comment: 0,
  },
  {
    id: 2,
    avatar: 'avata',
    name: 'Marco Rossi22',
    time: '1 hour ago',
    stt: "I finally bought the equipment for my challenge. Mont Blanc I'm coming!!! 🧗🏻‍♂️",
    card: {
      image: 'https://picsum.photos/200/300',
      title: 'Climbing Mont Blanc',
      builder: 'Marco Rossi',
    },
    like: 0,
    comment: 0,
  },
  {
    id: 3,
    avatar: 'avata',
    name: 'Marco Rossi 333',
    time: '1 hour ago',
    stt: "I finally bought the equipment for my challenge. Mont Blanc I'm coming!!! 🧗🏻‍♂️",
    card: {
      image: 'https://picsum.photos/200/300',
      title: 'Climbing Mont Blanc',
      builder: 'Marco Rossi',
    },
    like: 0,
    comment: 10,
  },
  {
    id: 4,
    avatar: 'avata',
    name: 'Marco Rossi',
    time: '1 hour ago',
    stt: "I finally bought the equipment for my challenge. Mont Blanc I'm coming!!! 🧗🏻‍♂️",
    card: {
      image: 'https://picsum.photos/200/300',
      title: 'Climbing Mont Blanc',
      builder: 'Marco Rossi',
    },
    like: 5,
    comment: 0,
  },
];

interface IProgressTabProps {}

export const ProgressTab: FC<IProgressTabProps> = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { t } = useTranslation();

  const AddNewChallengeProgressButton = () => {
    return (
      <View className="pt-4">
        <View className="mx-4 ">
          <Button
            containerClassName="  bg-primary-default flex-none px-1 "
            textClassName="line-[30px] text-center text-md font-medium text-white ml-2"
            title={t('challenge_detail_screen.upload_new_progress') as string}
            Icon={<AddIcon fill={'white'} />}
            onPress={() => setIsModalVisible(true)}
          />
          <AddNewChallengeProgressModal
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
          />
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={arrayPost}
      ListHeaderComponent={<AddNewChallengeProgressButton />}
      renderItem={({ item }) => <ProgressCard itemProgressCard={item} />}
      contentContainerStyle={{ paddingBottom: 300 }}
    />
  );
};

export default ProgressTab;
