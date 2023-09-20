import React, { FC } from "react";
import { View, Text, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";

import { useNav } from "../../../../hooks/useNav";

import SkillCompetenceProcess from "../../../../component/Profile/ProfileTabs/Users/Skills/SkillCompetenceProcess";
import Button, {
  FillButton,
} from "../../../../component/common/Buttons/Button";

interface ISoftSkillProps {
  rating: number;
  skill: {
    id: string;
    skill: string;
  };
}
interface ISkillsTabProps {
  skills: ISoftSkillProps[] | undefined;
  challengeIsClosed?: boolean;
  canRateSkills?: boolean;
}

const SkillsTab: FC<ISkillsTabProps> = ({
  skills,
  challengeIsClosed,
  canRateSkills,
}) => {
  const { t } = useTranslation();
  const navigation = useNav();

  const handleOpenRateSkillsModal = () => {
    navigation.navigate("CoachRateChallengeScreen", {
      challengeId: "1",
      userId: "1",
    });
  };

  return (
    <View className="mb-4 flex-1 px-4 pr-4 pt-4">
      {canRateSkills && (
        <Button
          isDisabled={challengeIsClosed || false}
          containerClassName="bg-primary-default flex-none px-1"
          textClassName="line-[30px] text-center text-md font-medium text-white ml-2"
          disabledContainerClassName="bg-gray-light flex-none px-1"
          disabledTextClassName="line-[30px] text-center text-md font-medium text-gray-medium ml-2"
          title={t("challenge_detail_screen.rate_skills") as string}
          onPress={handleOpenRateSkillsModal}
        />
      )}
      <View className="mt-4 flex flex-col">
        {skills?.map((skill: ISoftSkillProps, index) => {
          return (
            <SkillCompetenceProcess
              skillName={skill.skill.skill}
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

export default SkillsTab;
