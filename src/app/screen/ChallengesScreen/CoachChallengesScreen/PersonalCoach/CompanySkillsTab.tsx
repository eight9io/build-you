import clsx from "clsx";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import React, { FC, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

import {
  ICertifiedChallengeState,
  IChallenge,
  ISoftSkill,
} from "../../../../types/challenge";

import {
  getCertifiedChallengeParticipants,
  serviceGetRatedSoftSkillCertifiedChallenge,
} from "../../../../service/challenge";

import CoachRateChallengeModal from "../../../../component/modal/CoachRateChallengeModal";
import { useUserProfileStore } from "../../../../store/user-store";
import { IUserData } from "../../../../types/user";

import RatedParticipant from "../assets/rated-participant.svg";
import Empty from "../../../../common/svg/empty-list.svg";

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
  }, [shouldRefresh]);

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

  return (
    <View className="flex-1 pl-4 ">
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
      {participantsWithRatingSkills?.length > 0 && (
        <FlatList
          data={participantsWithRatingSkills}
          className="pt-4"
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
        <View className="mt-2 h-full flex-1 items-center justify-center">
          <FlatList
            data={[]}
            renderItem={() => <></>}
            showsVerticalScrollIndicator={true}
            ListFooterComponent={
              <View className=" justify-cente mt-6 items-center pt-10">
                <Empty />
                <Text className="text-h6 font-light leading-10 text-[#6C6E76]">
                  {t("empty_followers")}
                </Text>
              </View>
            }
            onRefresh={fetchParticipantsCertifiedChallenge}
            refreshing={shouldRefresh}
          />
        </View>
      )}
    </View>
  );
};

export default CompanySkillsTab;
