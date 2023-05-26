import React from 'react';
import { View, Text } from 'react-native';

interface ISkillCompetenceProcessProps {
  skillName?: string;
  skillCompetence?: number;
}

const SkillCompetenceProcess: React.FC<ISkillCompetenceProcessProps> = ({
  skillName,
  skillCompetence,
}) => {
  return (
    <View className='flex flex-col bg-white py-4 mb-2 justify-start rounded-xl'>
      <View className='px-4'>
      <Text className='text-h6 font-medium leading-4 text-black pb-2'>{skillName}</Text>
      <View className='bg-gray-light h-2.5 w-full rounded-full'>
        <View className='bg-gray-medium h-2.5 w-1/2 rounded-full'></View>
      </View>
      </View>
    </View>
  );
};

export default SkillCompetenceProcess;
