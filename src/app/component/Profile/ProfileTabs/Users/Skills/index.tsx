import React, { FC, useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";

import clsx from "clsx";

import SkillCompetenceProcess from "./SkillCompetenceProcess";
import { useTranslation } from "react-i18next";
import { IRatedSkill } from "../../../../../types/user";

interface ISoftSkillProps {
  rating: number;
  skill: {
    id: string;
    skill: string;
  };
}
interface ISkillsProps {
  skills: ISoftSkillProps[] | undefined;
  ratedSkill: IRatedSkill[];
}

const Skills: FC<ISkillsProps> = ({ skills, ratedSkill }) => {
  const [uniqueRatedSkills, setUniqueRatedSkills] = useState<IRatedSkill[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (!ratedSkill) {
      return;
    }
    const uniqueSkills = ratedSkill.reduce((acc: IRatedSkill[], current) => {
      const skill = acc.find(
        (item) => item.skill.skill === current.skill.skill
      );
      if (!skill) {
        return acc.concat([current]);
      } else {
        return acc.map((item) =>
          item.skill.skill === current.skill.skill &&
          item.rating < current.rating
            ? current
            : item
        );
      }
    }, []);
    setUniqueRatedSkills(uniqueSkills);
  }, [ratedSkill]);

  return (
    <ScrollView>
      <View className={clsx("mb-[10px] flex w-full flex-col px-4 pr-4 pt-4 ")}>
        {uniqueRatedSkills.length > 0 && (
          <>
            <Text className={clsx("text-h6 font-medium")}>
              {t("skill_tab.certified") || "Certified"}
            </Text>
            <View className={clsx("mt-4 flex flex-col")}>
              {uniqueRatedSkills?.map((skill: ISoftSkillProps, index) => {
                return (
                  <SkillCompetenceProcess
                    skillName={skill.skill.skill}
                    skillCompetence={skill.rating}
                    key={index}
                    color="bg-success-default"
                  />
                );
              })}
            </View>
          </>
        )}
      </View>
      <View className={clsx("mb-[100px] flex w-full flex-col px-4 pr-4 pt-4 ")}>
        <Text className={clsx("text-h6 font-medium")}>
          {t("skill_tab.self_declared") || "Self-declared"}
        </Text>

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
