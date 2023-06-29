import React, { FC } from 'react';
import { View, Text, ScrollView } from 'react-native';

import clsx from 'clsx';

import SkillCompetenceProcess from './SkillCompetenceProcess';

interface ISoftSkillProps {
  rating: number;
  skill: {
    id: string;
    skill: string;
  };
}
interface ISkillsProps {
  skills: ISoftSkillProps[] | undefined;
}

const Skills: FC<ISkillsProps> = ({ skills }) => {
  return (
    <ScrollView>
      <View className={clsx('flex w-full flex-col pr-4 pt-4 mb-[100px] px-4 ')}>
        <Text className={clsx('text-h6 font-medium')}>Self-declared</Text>

        <View className={clsx('mt-4 flex flex-col')}>
          {skills?.map((skill: ISoftSkillProps, index) => {
            return (
              <SkillCompetenceProcess
                skillName={skill.skill.skill}
                skillCompetence={skill.rating}
                key={index}
              />
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

export default Skills;
