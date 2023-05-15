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
    <View className={clsx('flex flex-col border-b border-gray-70 pb-4 mb-4')}>
      <Text className='text-h6 leading-6 text-black-light font-semibold'>{title}</Text>
      <Text className='text-h6 leading-6 font-normal text-gray-dark'>{description}</Text>
    </View>
  );
};

export const DescriptionTab: FC<IDescriptionTabProps> = () => {
  return (
    <ScrollView>
      <SingleDescription
        title='The benefits'
        description='Improved weight control, increased hand-eye coordination and balance'
      />
      <SingleDescription
        title='The benefits'
        description='Improved weight control, increased hand-eye coordination and balance'
      />
      <SingleDescription
        title='The benefits'
        description='Improved weight control, increased hand-eye coordination and balance'
      />
    </ScrollView>
  );
};

export default DescriptionTab;
