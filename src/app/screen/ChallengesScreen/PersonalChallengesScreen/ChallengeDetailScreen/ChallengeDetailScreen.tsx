import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import { FC, useEffect, useLayoutEffect, useState } from "react";
import { View, Text, SafeAreaView } from "react-native";

import {
  ICertifiedChallengeState,
  IChallenge,
} from "../../../../types/challenge";
import DescriptionTab from "./DescriptionTab";
import ProgressTab from "./ProgressTab";

import CheckCircle from "./assets/check_circle.svg";

import {
  getChallengeStatusColor,
  isObjectEmpty,
} from "../../../../utils/common";
import { useUserProfileStore } from "../../../../store/user-store";
import {
  getChallengeParticipants,
  serviceAddChallengeParticipant,
  serviceRemoveChallengeParticipant,
} from "../../../../service/challenge";

import PersonalSkillsTab from "./PersonalSkillsTab";
import TabView from "../../../../component/common/Tab/TabView";
import Button from "../../../../component/common/Buttons/Button";
import { ChatCoachTab } from "../../CoachChallengesScreen/PersonalCoach/ChatCoachTab";
import GlobalToastController from "../../../../component/common/Toast/GlobalToastController";
import GlobalDialogController from "../../../../component/common/Dialog/GlobalDialogController";
import ParticipantsTab from "../../CompanyChallengesScreen/ChallengeDetailScreen/ParticipantsTab";
import PersonalCoachTab from "./PersonalCoachTab";

interface IChallengeDetailScreenProps {
  challengeData: IChallenge;
  shouldScreenRefresh?: boolean;
  setIsJoinedLocal?: React.Dispatch<React.SetStateAction<boolean>>;
  setShouldScreenRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ChallengeDetailScreen: FC<IChallengeDetailScreenProps> = ({
  challengeData,
  shouldScreenRefresh,
  setIsJoinedLocal,
  setShouldScreenRefresh,
}) => {
  const { t } = useTranslation();
  const [index, setIndex] = useState<number>(0);
  const [isJoined, setIsJoined] = useState<boolean>(true);
  const [participantList, setParticipantList] = useState([]);
  const [challengeTabTitles, setChallengeTabTitles] = useState<string[]>([]);
  const [challengeState, setChallengeState] =
    useState<ICertifiedChallengeState>({} as ICertifiedChallengeState);
  const [shouldRefresh, setShouldRefresh] = useState<boolean>(true);

  const { goal, id: challengeId } = challengeData;
  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();

  const fetchParticipants = async () => {
    const response = await getChallengeParticipants(challengeId);
    setParticipantList(response.data);
  };

  const challengeOwner = Array.isArray(challengeData?.owner)
    ? challengeData?.owner[0]
    : challengeData?.owner;

  const challengeCoach = challengeData?.coach;

  const isCurrentUserParticipant = challengeData?.participants?.find(
    (participant) => participant.id === currentUser?.id
  );
  const isCurrentUserChallengeOnwer = challengeOwner?.id === currentUser?.id;

  const challengeStatus =
    challengeOwner?.id === currentUser?.id
      ? challengeData?.status
      : isCurrentUserParticipant
      ? isCurrentUserParticipant?.challengeStatus
      : challengeData.status;

  const isChallengeCompleted =
    challengeStatus === "done" || challengeStatus === "closed";

  const isCertifiedChallenge = challengeData?.type === "certified";

  const isChallengeInProgress =
    !isObjectEmpty(challengeState) &&
    challengeCoach &&
    challengeState.intakeStatus !== "init" &&
    challengeState.intakeStatus !== "open" &&
    challengeState.closingStatus !== "closed";

  const statusColor = getChallengeStatusColor(
    challengeStatus,
    challengeData?.status
  );

  const handleJoinChallenge = async () => {
    if (!currentUser?.id || !challengeId) return;
    try {
      await serviceAddChallengeParticipant(challengeId);
      GlobalToastController.showModal({
        message: t("toast.joined_success") || "You have joined the challenge!",
      });
      setIsJoined(true);
      setIsJoinedLocal && setIsJoinedLocal(true);
      fetchParticipants();
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
      GlobalToastController.showModal({
        message: t("toast.leave_success") || "You have left the challenge!",
      });
      setIsJoined(false);
      setIsJoinedLocal && setIsJoinedLocal(false);
      fetchParticipants();
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
  };

  useEffect(() => {
    const CHALLENGE_TABS_TITLE_TRANSLATION =
      participantList && challengeOwner?.companyAccount
        ? [
            t("challenge_detail_screen.progress"),
            t("challenge_detail_screen.description"),
            t("challenge_detail_screen.participants"),
          ]
        : [
            t("challenge_detail_screen.progress"),
            t("challenge_detail_screen.description"),
          ];

    if (challengeData?.type === "certified") {
      CHALLENGE_TABS_TITLE_TRANSLATION.push(
        t("challenge_detail_screen.coach"),
        t("challenge_detail_screen.skills"),
        t("challenge_detail_screen.chat_coach")
      );
    }
    setChallengeTabTitles(CHALLENGE_TABS_TITLE_TRANSLATION);
  }, []);

  useEffect(() => {
    if (!shouldScreenRefresh) return;
    fetchParticipants();
  }, [shouldScreenRefresh]);

  useEffect(() => {
    fetchParticipants();
  }, []);

  return (
    <SafeAreaView>
      <View className="flex h-full flex-col bg-white pt-2">
        <View className="flex flex-row items-center justify-between px-4">
          <View className="flex-1 flex-row items-center gap-2 pb-2 pt-2">
            <CheckCircle fill={statusColor} />
            <View className="flex-1">
              <Text className="text-2xl font-semibold">{goal}</Text>
            </View>
          </View>
          {!isCurrentUserChallengeOnwer && !isChallengeCompleted && (
            <View className="ml-2 h-9">
              <Button
                isDisabled={false}
                containerClassName={
                  isJoined
                    ? "border border-gray-dark flex items-center justify-center px-5 text-gray-dark"
                    : "bg-primary-default flex items-center justify-center px-5"
                }
                textClassName={`text-center text-md font-semibold ${
                  isJoined ? "text-gray-dark" : "text-white"
                } `}
                title={
                  isJoined
                    ? t("challenge_detail_screen.leave")
                    : t("challenge_detail_screen.join")
                }
                onPress={handleJoinLeaveChallenge}
              />
            </View>
          )}
          {!isCurrentUserChallengeOnwer && isChallengeCompleted && (
            <View className="ml-2 h-9">
              <Button
                containerClassName="border border-gray-dark flex items-center justify-center px-5"
                textClassName={`text-center text-md font-semibold text-gray-dark `}
                title={t("challenge_detail_screen.completed")}
              />
            </View>
          )}
        </View>

        <View className="mt-2 flex flex-1">
          <TabView
            titles={challengeTabTitles}
            activeTabIndex={index}
            setActiveTabIndex={setIndex}
          >
            <ProgressTab
              isJoined={isJoined}
              isChallengeCompleted={isChallengeCompleted}
              challengeData={challengeData}
              setShouldRefresh={setShouldScreenRefresh}
            />
            <DescriptionTab challengeData={challengeData} />
            {participantList && challengeOwner?.companyAccount && (
              <ParticipantsTab
                participant={participantList}
                fetchParticipants={fetchParticipants}
              />
            )}
            <PersonalCoachTab
              coachID={challengeCoach}
              challengeId={challengeId}
              challengeState={challengeState}
              setChallengeState={setChallengeState}
              setShouldParentRefresh={setShouldScreenRefresh}
            />
            <PersonalSkillsTab challengeData={challengeData} />
            {isCertifiedChallenge && (
              <ChatCoachTab
                challengeData={challengeData}
                isChallengeInProgress={isChallengeInProgress}
              />
            )}
          </TabView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChallengeDetailScreen;
