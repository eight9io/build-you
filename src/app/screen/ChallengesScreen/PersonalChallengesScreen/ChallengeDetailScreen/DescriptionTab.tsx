import { FC } from "react";
import clsx from "clsx";
import { Text, View, ScrollView } from "react-native";

import dayjs from "../../../../utils/date.util";
import { IChallenge, ISoftSkill } from "../../../../types/challenge";
import { useTranslation } from "react-i18next";
import { extractSkillsFromChallengeData } from "../../../../utils/challenge";

interface ISingleDescriptionProps {
  title: string;
  description: string;

}

interface IDescriptionTabProps {
  challengeData: IChallenge;
  maxPepleCanJoin?: number;
  participant?: any;
}

const SingleDescription: FC<ISingleDescriptionProps> = ({
  title,
  description,
}) => {
  return (
    <View className={clsx("mb-4 flex flex-col border-b border-gray-70 pb-4")}>
      <Text className="text-h6 font-semibold leading-6 text-black-light">
        {title}
      </Text>
      <Text className="text-h6 font-normal leading-6 text-gray-dark">
        {description}
      </Text>
    </View>
  );
};

const renderSkills = (skills: ISoftSkill[]) => {
  return skills.map((skill: ISoftSkill, index) => {
    return (
      <View className="flex flex-col" key={index}>
        <Text className="text-h6 leading-6 text-black-light">
          {skill.skill}
        </Text>
      </View>
    );
  });
};

export const DescriptionTab: FC<IDescriptionTabProps> = ({
  challengeData,
  maxPepleCanJoin,
  participant
}) => {
  const { t } = useTranslation();
  const { id, achievementTime, benefits, image, goal, reasons } = challengeData;
  const date = new Date(achievementTime);

  const skillsToRate: ISoftSkill[] =
    extractSkillsFromChallengeData(challengeData);
  return (
    <ScrollView className="h-full bg-gray-veryLight px-4 pt-4">
      <SingleDescription
        title={t("challenge_description_tab.the_benefits") || "The benefits"}
        description={benefits}
      />
      <SingleDescription
        title={t("challenge_description_tab.the_reason") || "The reason"}
        description={reasons}
      />
      <SingleDescription
        title={
          t("challenge_description_tab.time_to_reach_goal") ||
          "Time to reach goal"
        }
        description={dayjs(date).format("DD/MM/YYYY")}
      />
      {maxPepleCanJoin && (
        <SingleDescription
          title={t("challenge_description_tab.participants") || "Participants"}
          description={`${participant?.length || 0
            }/${maxPepleCanJoin}`}
        />
      )}
      {skillsToRate.length > 0 && (
        <View
          className={clsx("mb-4 flex flex-col border-b border-gray-70 pb-4")}
        >
          <Text className="text-h6 font-semibold leading-6 text-black-light">
            {t("challenge_description_tab.soft_skills") || "Soft skills"}
          </Text>
          {renderSkills(skillsToRate)}
        </View>
      )}
    </ScrollView>
  );
};

export default DescriptionTab;
