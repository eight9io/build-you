import React, { FC, useEffect, useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { serviceGetRatedSoftSkillCertifiedChallenge } from "../../../../service/challenge";
import { extractSkillsFromChallengeData } from "../../../../utils/challenge";

import SkillCompetenceProcess from "../../../../component/Profile/ProfileTabs/Users/Skills/SkillCompetenceProcess";
import { IChallenge, ISoftSkill } from "../../../../types/challenge";

interface ISkillsTabProps {
  challengeData: IChallenge;
}

const PersonalSkillsTab: FC<ISkillsTabProps> = ({ challengeData }) => {
  const [ratedCompetencedSkill, setRatedCompetencedSkill] = useState<
    ISoftSkill[]
  >([]);

  const skillsToRate: ISoftSkill[] =
    extractSkillsFromChallengeData(challengeData);

  useEffect(() => {
    const getData = async () => {
      try {
        const [ratedSoffSkillsValue] = await Promise.allSettled([
          serviceGetRatedSoftSkillCertifiedChallenge(challengeData?.id),
        ]);

        if (ratedSoffSkillsValue.status === "fulfilled") {
          const ratedSoffSkills = ratedSoffSkillsValue.value.data.map(
            (item) => {
              return {
                id: item.skill.id,
                skill: item.skill.skill,
                rating: item.rating,
              };
            }
          );
          setRatedCompetencedSkill(ratedSoffSkills);
        } else {
          console.log(
            "Error fetching rated skills:",
            ratedSoffSkillsValue.reason
          );
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    getData();
  }, [challengeData?.id]);

  return (
    <View className="mb-4 flex-1 px-4 pr-4 pt-4">
      <View className="mt-4 flex flex-col">
        {(ratedCompetencedSkill?.length === 0
          ? skillsToRate
          : ratedCompetencedSkill
        )?.map((skill: ISoftSkill, index) => {
          return (
            <SkillCompetenceProcess
              skillName={skill.skill}
              skillCompetence={skill.rating}
              key={index}
              skillGaugeClassName="bg-success-default"
            />
          );
        })}
      </View>
    </View>
  );
};

export default PersonalSkillsTab;
