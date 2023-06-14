import { FC } from 'react';
import clsx from 'clsx';
import { Text, View, ScrollView } from 'react-native';

interface ISingleDescriptionProps {
  title: string;
  description: string;
}

interface IDescriptionTabProps {
  description?: string;
}

const SingleDescription: FC<ISingleDescriptionProps> = ({
  title,
  description,
}) => {
  return (
    <View className={clsx('border-gray-70 mb-4 flex flex-col border-b pb-4')}>
      <Text className="text-h6 text-black-light font-semibold leading-6">
        {title}
      </Text>
      <Text className="text-h6 text-gray-dark font-normal leading-6">
        {description}
      </Text>
    </View>
  );
};

export const DescriptionTab: FC<IDescriptionTabProps> = () => {
  return (
    <ScrollView className="px-4 pt-4">
      <SingleDescription
        title="The benefits"
        description="Improved weight control, increased hand-eye coordination and balance"
      />
      <SingleDescription
        title="The reasons"
        description="Improved weight control, increased hand-eye coordination and balance"
      />
      <SingleDescription
        title="Time to reach the goal"
        description="Improved weight control, increased hand-eye coordination and balance"
      />
    </ScrollView>
  );
};

export default DescriptionTab;
