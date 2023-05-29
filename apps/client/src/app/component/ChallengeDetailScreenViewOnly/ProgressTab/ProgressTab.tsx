import { View, Text, FlatList, ScrollView } from 'react-native';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../common/Buttons/Button';
import ChallengeProgressCard from '../../Post/ChallengeProgressCard';

interface IChronoStepTabProps {
  arrProgress: any;
}
export const ChronoStepTab: FC<IChronoStepTabProps> = ({ arrProgress }) => {
  const { t } = useTranslation();
  return (
    <ScrollView className="bg-gray-50" style={{ width: '100%' }}>
      {arrProgress.map((item: any, id: number) => (
        <View key={id}>
          <ChallengeProgressCard item={item} />
        </View>
      ))}
    </ScrollView>
  );
};

export default ChronoStepTab;
