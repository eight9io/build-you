import { Text, ScrollView } from 'react-native';
import { FC } from 'react';

interface IDescriptionTabProps {
  description: string;
}
export const DescriptionTab: FC<IDescriptionTabProps> = ({ description }) => {
  return (
    <ScrollView>
      <Text className="text-[16px] font-normal">{description}</Text>
    </ScrollView>
  );
};

export default DescriptionTab;
