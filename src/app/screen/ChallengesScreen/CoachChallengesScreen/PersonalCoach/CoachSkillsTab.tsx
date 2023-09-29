import React, { FC, useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";

import { useNav } from "../../../../hooks/useNav";
import {
  serviceGetRatedSoftSkillCertifiedChallenge,
  serviceGetSkillsToRate,
  servicePostRatingSkills,
} from "../../../../service/challenge";
import { extractSkillsFromChallengeData } from "../../../../utils/challenge";

import SkillCompetenceProcess from "../../../../component/Profile/ProfileTabs/Users/Skills/SkillCompetenceProcess";
import Button, {
  FillButton,
} from "../../../../component/common/Buttons/Button";
import {
  IChallenge,
  IChallengeOwner,
  ISoftSkill,
} from "../../../../types/challenge";
import { useUserProfileStore } from "../../../../store/user-store";
import CoachRateChallengeModal from "../../../../component/modal/CoachRateChallengeModal";

interface ISkillsTabProps {
  challengeData: IChallenge;
}

const CoachSkillsTab: FC<ISkillsTabProps> = ({ challengeData }) => {
  const [ratedCompetencedSkill, setRatedCompetencedSkill] = useState<
    ISoftSkill[]
  >([]);
  const [isRateSkillsModalVisible, setIsRateSkillsModalVisible] =
    useState<boolean>(false);

  const [shouldRefresh, setShouldRefresh] = useState<boolean>(true);

  const { t } = useTranslation();

  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();

  const canCurrentUserRateSkills = currentUser.id === challengeData?.coach;

  const challengeOwner = (challengeData?.owner?.[0] as IChallengeOwner) ?? null;

  const handleOpenRateSkillsModal = () => {
    setIsRateSkillsModalVisible(true);
  };

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
            "CoachRateChallengeScreen - Error fetching rated skills:",
            ratedSoffSkillsValue.reason
          );
        }
      } catch (error) {
        console.log("CoachRateChallengeScreen - Error fetching data:", error);
      }
    };
    if (challengeData?.id && shouldRefresh) {
      getData();
      setShouldRefresh(false);
    }
  }, [challengeData?.id, shouldRefresh]);

  console.log(shouldRefresh);

  return (
    <View className="mb-4 flex-1 px-4 pr-4 pt-4">
      <CoachRateChallengeModal
        isVisible={isRateSkillsModalVisible}
        setIsVisible={setIsRateSkillsModalVisible}
        challengeData={challengeData}
        challengeOwner={challengeOwner}
        setShouldParentRefresh={setShouldRefresh}
      />
      {canCurrentUserRateSkills && ratedCompetencedSkill?.length === 0 && (
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

export default CoachSkillsTab;
