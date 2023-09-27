import React, { FC, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";

import { useNav } from "../../../../hooks/useNav";
import {
  serviceGetSkillsToRate,
  servicePostRatingSkills,
} from "../../../../service/challenge";

import SkillCompetenceProcess from "../../../../component/Profile/ProfileTabs/Users/Skills/SkillCompetenceProcess";
import Button, {
  FillButton,
} from "../../../../component/common/Buttons/Button";
import { IChallenge } from "../../../../types/challenge";
import { useUserProfileStore } from "../../../../store/user-store";

interface ISoftSkillProps {
  rating: number;
  skill: {
    id: string;
    skill: string;
  };
}
interface ISkillsTabProps {
  challengeData: IChallenge;
}

const PersonalSkillsTab: FC<ISkillsTabProps> = ({ challengeData }) => {
  const [skills, setSkills] = React.useState<ISoftSkillProps[]>([]);
  const { t } = useTranslation();
  const navigation = useNav();

  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();

  const canCurrentUserRateSkills = currentUser.id === challengeData?.coach;

  const handleOpenRateSkillsModal = () => {
    navigation.navigate("CoachRateChallengeScreen", {
      challengeId: challengeData.id,
      userId: currentUser.id,
    });
  };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await serviceGetSkillsToRate(challengeData.id);
        setSkills(response.data);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchSkills();
  }, []);

  return (
    <View className="mb-4 flex-1 px-4 pr-4 pt-4">
      {canCurrentUserRateSkills && (
        <Button
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

export default PersonalSkillsTab;
