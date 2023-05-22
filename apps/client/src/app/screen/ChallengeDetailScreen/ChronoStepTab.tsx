import { View, Text, FlatList, ScrollView } from 'react-native';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../component/common/Buttons/Button';
import Post from '../../component/Post';

interface IChronoStepTabProps {
  arrProgress: any;
}
export const ChronoStepTab: FC<IChronoStepTabProps> = ({ arrProgress }) => {
  const { t } = useTranslation();
  return (
    <ScrollView className="bg-gray-50 ">
      <FlatList
        data={arrProgress}
        renderItem={({ item }) => <Post itemProgressCard={item} />}
        keyExtractor={(item) => item.id as unknown as string}
      />
      <Button
        title={t('challenge_detail_screen.upload_new_progress')}
        containerClassName="bg-primary-default h-[34px]"
        textClassName="text-white"
      />
    </ScrollView>
  );
};

export default ChronoStepTab;
