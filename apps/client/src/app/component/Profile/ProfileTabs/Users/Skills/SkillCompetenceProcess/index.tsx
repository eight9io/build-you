import React from 'react';
import { View, Text } from 'react-native';
import clsx from 'clsx';

interface ISkillCompetenceProcessProps {
  skillName?: string;
  skillCompetence?: number;
}

const skillCompetenceProcess = (skillCompetence: number | undefined) => {
  switch (skillCompetence) {
    case 1:
      return 'w-1/5';
    case 2:
      return 'w-2/5';
    case 3:
      return 'w-3/5';
    case 4:
      return 'w-4/5';
    case 5:
      return 'w-full';
    default:
      return 'w-0';
  }
};

const SkillCompetenceProcess: React.FC<ISkillCompetenceProcessProps> = ({
  skillName,
  skillCompetence,
}) => {
  const skillCompetenceWidth = skillCompetenceProcess(skillCompetence);
  return (
    <View className="mb-2 flex flex-col justify-start rounded-xl bg-white py-4">
      <View className="px-4">
        <Text className="text-h6 pb-2 font-medium leading-4 text-black">
          {skillName}
        </Text>
        <View className="bg-gray-light h-2.5 w-full rounded-full">
          <View
            className={clsx(
              `bg-gray-medium h-2.5 rounded-full`,
              skillCompetenceWidth
            )}
          ></View>
        </View>
      </View>
    </View>
  );
};

export default SkillCompetenceProcess;
