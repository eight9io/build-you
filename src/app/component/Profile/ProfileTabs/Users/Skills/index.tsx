import React, { FC } from "react";
import { View, Text, ScrollView } from "react-native";

import clsx from "clsx";

import SkillCompetenceProcess from "./SkillCompetenceProcess";

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
      <View className={clsx("mb-[100px] flex w-full flex-col px-4 pr-4 pt-4 ")}>
        <Text className={clsx("text-h6 font-medium")}>Self-declared</Text>

        <View className={clsx("mt-4 flex flex-col")}>
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
