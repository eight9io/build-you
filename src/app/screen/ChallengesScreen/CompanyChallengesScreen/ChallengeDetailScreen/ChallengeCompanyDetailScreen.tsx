import { View, Text, SafeAreaView } from "react-native";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";

import { IChallenge } from "../../../../types/challenge";
import { getChallengeStatusColor } from "../../../../utils/common";
import { useUserProfileStore } from "../../../../store/user-store";
import {
  getChallengeParticipants,
  serviceAddChallengeParticipant,
  serviceRemoveChallengeParticipant,
} from "../../../../service/challenge";

import ParticipantsTab from "./ParticipantsTab";
import CompanyCoachTab from "./CompanyCoachTab";
import TabView from "../../../../component/common/Tab/TabView";
import ProgressTab from "../../PersonalChallengesScreen/ChallengeDetailScreen/ProgressTab";
import DescriptionTab from "../../PersonalChallengesScreen/ChallengeDetailScreen/DescriptionTab";

import CheckCircle from "./assets/check_circle.svg";

import Button from "../../../../component/common/Buttons/Button";
import GlobalDialogController from "../../../../component/common/Dialog/GlobalDialogController";
import GlobalToastController from "../../../../component/common/Toast/GlobalToastController";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/navigation.type";
import CompanySkillsTab from "./CompanySkillsTab";

export type ChallengeCompanyDetailScreenNavigationProps =
  NativeStackNavigationProp<RootStackParamList, "ChallengeCompanyDetailScreen">;

interface ICompanyChallengeDetailScreenProps {
  challengeData: IChallenge;
  shouldRefresh: boolean;
  setShouldRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  setIsNewProgressAdded?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ChallengeCompanyDetailScreen: FC<
  ICompanyChallengeDetailScreenProps
> = ({
  challengeData,
  shouldRefresh,
  setShouldRefresh,
  setIsNewProgressAdded,
}) => {
  const { t } = useTranslation();
  const [challengeTabTitles, setChallengeTabTitles] = useState<string[]>([]);
  const [participantList, setParticipantList] = useState(
    challengeData?.participants || []
  );
  const [index, setIndex] = useState<number>(0);

  const { goal, id: challengeId, owner } = challengeData;

  const { getUserProfile } = useUserProfileStore();

  const currentUser = getUserProfile();

  const navigation =
    useNavigation<
      NavigationProp<ChallengeCompanyDetailScreenNavigationProps>
    >();

  const fetchParticipants = async () => {
    const response = await getChallengeParticipants(challengeId);
    setParticipantList(response.data);
  };
  const challengeOwner = Array.isArray(challengeData?.owner)
    ? challengeData?.owner[0]
    : challengeData?.owner;

  const isCurrentUserOwner = challengeOwner?.id === currentUser?.id;
  const isCurrentUserParticipant = participantList?.find(
    (participant: any) => participant.id === currentUser?.id
  );

  const [isJoined, setIsJoined] = useState<boolean>(
    isCurrentUserOwner || !!isCurrentUserParticipant
  );
  const challengeStatus =
    challengeOwner.id === currentUser?.id
      ? challengeData.status
      : isJoined
      ? isCurrentUserParticipant?.challengeStatus
      : challengeData.status;
  const isChallengeCompleted =
    challengeStatus === "done" || challengeStatus === "closed";

  const handleJoinChallenge = async () => {
    if (!currentUser?.id || !challengeId) return;
    try {
      await serviceAddChallengeParticipant(challengeId);
      await fetchParticipants();
      GlobalToastController.showModal({
        message: t("toast.joined_success") || "You have joined the challenge!",
      });
      setIsJoined(true);
    } catch (error: AxiosError | any) {
      if (error?.response.status == 400) {
        GlobalDialogController.showModal({
          title: t("maximum_participants_reached"),
          message:
            t("dialog.err_max_join") ||
            "Sorry! You can not join this challenge, it has reached the maximum number of participants.",
        });
        return;
      }
      GlobalDialogController.showModal({
        title: t("dialog.err_title"),
        message:
          t("error_general_message") ||
          "Something went wrong. Please try again later!",
      });
    }
  };

  const handleLeaveChallenge = async () => {
    if (!currentUser?.id || !challengeId) return;
    try {
      await serviceRemoveChallengeParticipant(challengeId);
      await fetchParticipants();
      GlobalToastController.showModal({
        message: t("toast.leave_success") || "You have left the challenge!",
      });
      setIsJoined(false);
    } catch (err) {
      GlobalDialogController.showModal({
        title: t("dialog.err_title"),
        message:
          t("error_general_message") ||
          "Something went wrong. Please try again later!",
      });
    }
  };

  const handleJoinLeaveChallenge = async () => {
    if (isJoined) {
      await handleLeaveChallenge();
    } else {
      await handleJoinChallenge();
    }
    setShouldRefresh(true);
  };

  useEffect(() => {
    const CHALLENGE_TABS_TITLE_TRANSLATION = [
      t("challenge_detail_screen.progress"),
      t("challenge_detail_screen.description"),
      t("challenge_detail_screen.participants"),
    ];

    if (challengeData?.type === "certified") {
      CHALLENGE_TABS_TITLE_TRANSLATION.push(
        t("challenge_detail_screen.coach"),
        t("challenge_detail_screen.skills")
      );
    }
    setChallengeTabTitles(CHALLENGE_TABS_TITLE_TRANSLATION);
  }, []);

  useEffect(() => {
    if (!shouldRefresh) return;
    fetchParticipants();
    setShouldRefresh(false);
  }, [shouldRefresh]);

  return (
    <SafeAreaView>
      <View className="flex h-full flex-col bg-white pt-4">
        <View className="flex flex-row items-center justify-between px-4">
          <View className="flex-1 flex-row items-center gap-2 pb-2 pt-2">
            <CheckCircle
              fill={getChallengeStatusColor(
                challengeStatus,
                challengeData.status
              )}
            />
            <View className="flex-1">
              <Text className="text-2xl font-semibold">{goal}</Text>
            </View>
          </View>
          {!isCurrentUserOwner && !isChallengeCompleted && (
            <View className="ml-2 h-9">
              <Button
                isDisabled={false}
                containerClassName={
                  isJoined
                    ? "border border-gray-dark flex items-center justify-center px-5"
                    : "bg-primary-default flex items-center justify-center px-5"
                }
                textClassName={`text-center text-md font-semibold ${
                  isJoined ? "text-gray-dark" : "text-white"
                } `}
                disabledContainerClassName="bg-gray-light flex items-center justify-center px-5"
                disabledTextClassName="text-center text-md font-semibold text-gray-medium"
                title={
                  isJoined
                    ? t("challenge_detail_screen.leave")
                    : t("challenge_detail_screen.join")
                }
                onPress={handleJoinLeaveChallenge}
              />
            </View>
          )}
          {isChallengeCompleted && (
            <View className="ml-2 h-9">
              <Button
                containerClassName="border border-gray-dark flex items-center justify-center px-5"
                textClassName={`text-center text-md font-semibold text-gray-dark `}
                title={t("challenge_detail_screen.completed")}
              />
            </View>
          )}
        </View>

        <View className="mt-3 flex flex-1">
          <TabView
            titles={challengeTabTitles}
            activeTabIndex={index}
            setActiveTabIndex={setIndex}
          >
            <ProgressTab
              isJoined={isJoined}
              challengeData={challengeData}
              isChallengeCompleted={isChallengeCompleted}
              isOtherUserProfile={challengeOwner.id !== currentUser?.id}
              setShouldRefresh={setIsNewProgressAdded}
            />
            <DescriptionTab challengeData={challengeData} />
            <ParticipantsTab participant={participantList as any} />
            <CompanyCoachTab navigation={navigation} />
            <CompanySkillsTab
              navigation={navigation}
              challengeId={challengeData?.id}
            />
          </TabView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChallengeCompanyDetailScreen;
