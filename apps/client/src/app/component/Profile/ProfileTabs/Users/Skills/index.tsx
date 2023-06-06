import React from 'react';
import { View, Text, ScrollView } from 'react-native';

import clsx from 'clsx';

import SkillCompetenceProcess from './SkillCompetenceProcess';

const Skills = () => {
  return (
    <View className={clsx('flex w-full flex-col pr-4 ')}>
      <Text className={clsx('text-h6 font-medium')}>Self-declared</Text>

      <View className={clsx('mt-4 flex flex-col')}>
        <SkillCompetenceProcess skillName="Communication" />
        <SkillCompetenceProcess skillName="Teamwork" />
        <SkillCompetenceProcess skillName="Stress management" />
      </View>
    </View>
  );
};

export default Skills;
