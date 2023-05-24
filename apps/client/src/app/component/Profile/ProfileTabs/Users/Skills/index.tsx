import React from 'react';
import { View, Text, ScrollView } from 'react-native';

import clsx from 'clsx';

import SkillCompetenceProcess from './SkillCompetenceProcess';

const Skills = () => {
  return (
    <View className={clsx('flex flex-col w-full pr-4 ')}>
      <Text className={clsx('text-h6 font-medium')}>Self-declared</Text>

      <View className={clsx('flex flex-col mt-4')}>
        <SkillCompetenceProcess skillName='Communication'/>
        <SkillCompetenceProcess skillName='Teamwork'/>
        <SkillCompetenceProcess skillName='Stress management'/>
      </View>        
    </View>
  );
};

export default Skills;
