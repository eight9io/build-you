import clsx from "clsx";
import { t } from "i18next";
import { Image } from "expo-image";
import React, { FC, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

import {
  ICertifiedChallengeState,
  IChallenge,
  IChallengeOwner,
  ISoftSkill,
} from "../../../../types/challenge";

import {
  getCertifiedChallengeParticipants,
  serviceGetRatedSoftSkillCertifiedChallenge,
} from "../../../../service/challenge";

import Empty from "../../../../common/svg/empty-list.svg";
import RatedParticipant from "./assets/rated-participant.svg";
import CoachRateChallengeModal from "../../../../component/modal/CoachRateChallengeModal";
import { useTranslation } from "react-i18next";
import { useUserProfileStore } from "../../../../store/user-store";
import { IUserData } from "../../../../types/user";
import { extractSkillsFromChallengeData } from "../../../../utils/challenge";

interface IParticipantWithRatingSkills {
  id: number;
  name: string;
  surname: string;
  avatar: string;
  rating: number;
  challengeId: string;
  skills?: ISoftSkill[];
}

interface ICompanySkillsTabProps {
  challengeData: IChallenge;
  challengeState: ICertifiedChallengeState;
}

const isUserSkillRated = (skills: ISoftSkill[]) => {
  return skills?.every((skill) => skill?.isRated);
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

const CompanySkillsTab: FC<ICompanySkillsTabProps> = ({
  challengeData,
  challengeState,
}) => {
  const [participantsWithRatingSkills, setParticipantsWithRatingSkills] =
    useState<IParticipantWithRatingSkills[]>([]);
  const [ratedCompetencedSkill, setRatedCompetencedSkill] = useState<
    ISoftSkill[]
  >([]);
  const [selectedUser, setSelectedUser] = useState<IUserData>({} as IUserData);
  const [isRateSkillsModalVisible, setIsRateSkillsModalVisible] =
    useState<boolean>(false);
  const [shouldRefresh, setShouldRefresh] = useState<boolean>(true);

  const { t } = useTranslation();

  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();

  const isChallengeEnded = challengeState.closingStatus === "closed";
  const canCurrentUserRateSkills =
    currentUser.id === challengeData?.coach && isChallengeEnded;

  const fetchParticipantsCertifiedChallenge = async () => {
    try {
      const response = await getCertifiedChallengeParticipants(
        challengeData?.id
      );
      setParticipantsWithRatingSkills(response.data);
    } catch (error) {
      console.error("Error occurred while fetching participants:", error);
    }
  };

  const handleSelectUserToRate = (user) => {
    setSelectedUser(user);
    setIsRateSkillsModalVisible(true);
  };

  useEffect(() => {
    fetchParticipantsCertifiedChallenge();
  }, []);

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
                id: item.skillId,
                skill: item.skillName,
                rating: item.skillRating,
                isRating: item.isRating,
                userId: item.userId,
              };
            }
          );
          setRatedCompetencedSkill(ratedSoffSkills);
        } else {
          console.error(
            " Error fetching rated skills:",
            ratedSoffSkillsValue.reason
          );
        }
      } catch (error) {
        console.error(" Error fetching data:", error);
      }
    };
    if (challengeData?.id && shouldRefresh) {
      getData();
      setShouldRefresh(false);
    }
  }, [challengeData?.id, shouldRefresh]);

  const skillsToRate: ISoftSkill[] =
    extractSkillsFromChallengeData(challengeData);

  return (
    <View className="flex-1 bg-gray-veryLight">
      {isRateSkillsModalVisible && (
        <CoachRateChallengeModal
          isVisible={isRateSkillsModalVisible}
          setIsVisible={setIsRateSkillsModalVisible}
          challengeData={challengeData}
          userToRate={selectedUser}
          setShouldParentRefresh={setShouldRefresh}
          ratedCompetencedSkill={ratedCompetencedSkill}
          canCurrentUserRateSkills={canCurrentUserRateSkills}
        />
      )}
      {skillsToRate.length > 0 && (
        <View
          className={clsx(
            "mx-4 mt-4 flex flex-col border-b border-gray-70 pb-4"
          )}
        >
          <Text className="text-h6 font-semibold leading-6 text-black-light">
            {t("challenge_description_tab.soft_skills") || "Soft skills"}
          </Text>
          {renderSkills(skillsToRate)}
        </View>
      )}
      {participantsWithRatingSkills?.length > 0 && (
        <FlatList
          data={participantsWithRatingSkills}
          className="mx-4 pt-4"
          showsVerticalScrollIndicator={true}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => handleSelectUserToRate(item)}
                className="mb-5 flex-row items-center gap-3 "
              >
                <View className="relative">
                  {!item?.avatar && (
                    <Image
                      className="h-10 w-10 rounded-full"
                      source={require("../../../../common/image/avatar-load.png")}
                    />
                  )}
                  {item?.avatar && (
                    <Image
                      source={{ uri: item.avatar.trim() }}
                      className={clsx("h-10 w-10  rounded-full")}
                    />
                  )}
                  {isUserSkillRated(item?.skills) && (
                    <View className="absolute bottom-[-5] right-2.5">
                      <RatedParticipant />
                    </View>
                  )}
                </View>
                <Text className="flex w-full flex-row flex-wrap gap-1 pr-[40px]  text-base font-semibold text-basic-black">
                  {item.name + " " + item.surname}
                </Text>
              </TouchableOpacity>
            );
          }}
          onRefresh={fetchParticipantsCertifiedChallenge}
          refreshing={shouldRefresh}
          ListFooterComponent={<View className="h-20" />}
        />
      )}
      {participantsWithRatingSkills?.length == 0 && (
        <View className="mt-2 flex-1">
          <FlatList
            data={[]}
            renderItem={() => <></>}
            showsVerticalScrollIndicator={true}
            ListFooterComponent={
              <View className="flex-1 items-center justify-center">
                <Empty />
              </View>
            }
            ListFooterComponentStyle={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            onRefresh={fetchParticipantsCertifiedChallenge}
            refreshing={shouldRefresh}
          />
        </View>
      )}
    </View>
  );
};

export default CompanySkillsTab;
