import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";
<<<<<<< HEAD
import { FC, useEffect, useLayoutEffect, useState } from "react";
import { View, Text, SafeAreaView } from "react-native";

import {
  ICertifiedChallengeState,
  IChallenge,
} from "../../../../types/challenge";
=======
import { FC, useEffect, useState } from "react";
import { View, Text, SafeAreaView } from "react-native";

import { IChallenge } from "../../../../types/challenge";
import i18n from "../../../../i18n/i18n";
import TabView from "../../../../component/common/Tab/TabView";
>>>>>>> main
import DescriptionTab from "./DescriptionTab";
import ProgressTab from "./ProgressTab";

import CheckCircle from "./assets/check_circle.svg";

<<<<<<< HEAD
import {
  getChallengeStatusColor,
  isObjectEmpty,
} from "../../../../utils/common";
import { useUserProfileStore } from "../../../../store/user-store";
=======
import { getChallengeStatusColor } from "../../../../utils/common";
import { useUserProfileStore } from "../../../../store/user-store";
import Button from "../../../../component/common/Buttons/Button";
>>>>>>> main
import {
  getChallengeParticipants,
  serviceAddChallengeParticipant,
  serviceRemoveChallengeParticipant,
} from "../../../../service/challenge";
<<<<<<< HEAD

import PersonalSkillsTab from "./PersonalSkillsTab";
import TabView from "../../../../component/common/Tab/TabView";
import Button from "../../../../component/common/Buttons/Button";
import CoachTab from "../../CoachChallengesScreen/PersonalCoach/CoachTab";
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
=======
import GlobalDialogController from "../../../../component/common/Dialog/GlobalDialogController";
import ParticipantsTab from "../../CompanyChallengesScreen/ChallengeDetailScreen/ParticipantsTab";
import GlobalToastController from "../../../../component/common/Toast/GlobalToastController";

interface IChallengeDetailScreenProps {
  challengeData: IChallenge;
  shouldRefresh: boolean;
  setShouldRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  setIsJoinedLocal?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsNewProgressAdded?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ChallengeDetailScreen: FC<IChallengeDetailScreenProps> = ({
  shouldRefresh,
  setShouldRefresh,
  challengeData,
  setIsJoinedLocal,
  setIsNewProgressAdded,
}) => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [isJoined, setIsJoined] = useState<boolean>(true);
  const { goal, id: challengeId } = challengeData;
  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();
  const [participantList, setParticipantList] = useState([]);
>>>>>>> main

  const fetchParticipants = async () => {
    const response = await getChallengeParticipants(challengeId);
    setParticipantList(response.data);
  };
<<<<<<< HEAD
=======
  useEffect(() => {
    if (!shouldRefresh) return;
    fetchParticipants();
    setShouldRefresh(false);
  }, [shouldRefresh]);
>>>>>>> main

  const challengeOwner = Array.isArray(challengeData?.owner)
    ? challengeData?.owner[0]
    : challengeData?.owner;

<<<<<<< HEAD
  const challengeCoach = challengeData?.coach;

  const isCurrentUserParticipant = challengeData?.participants?.find(
    (participant) => participant.id === currentUser?.id
  );
  const isCurrentUserChallengeOnwer = challengeOwner?.id === currentUser?.id;
=======
  const isCurrentUserParticipant = challengeData?.participants?.find(
    (participant) => participant.id === currentUser?.id
  );
>>>>>>> main

  const challengeStatus =
    challengeOwner?.id === currentUser?.id
      ? challengeData?.status
      : isCurrentUserParticipant
      ? isCurrentUserParticipant?.challengeStatus
      : challengeData.status;

  const isChallengeCompleted =
    challengeStatus === "done" || challengeStatus === "closed";

<<<<<<< HEAD
  const isCertifiedChallenge = challengeData?.type === "certified";

  const isChallengeInProgress =
    !isObjectEmpty(challengeState) &&
    challengeCoach &&
    challengeState.intakeStatus !== "init" &&
    challengeState.intakeStatus !== "open" &&
    challengeState.closingStatus !== "closed";

=======
  const CHALLENGE_TABS_TITLE_TRANSLATION =
    participantList && challengeOwner?.companyAccount
      ? [
          i18n.t("challenge_detail_screen.progress"),
          i18n.t("challenge_detail_screen.description"),
          i18n.t("challenge_detail_screen.participants"),
        ]
      : [
          i18n.t("challenge_detail_screen.progress"),
          i18n.t("challenge_detail_screen.description"),
        ];
>>>>>>> main
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

<<<<<<< HEAD
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
=======
  return (
    <SafeAreaView>
      <View className="flex h-full flex-col bg-white py-2">
>>>>>>> main
        <View className="flex flex-row items-center justify-between px-4">
          <View className="flex-1 flex-row items-center gap-2 pb-2 pt-2">
            <CheckCircle fill={statusColor} />
            <View className="flex-1">
              <Text className="text-2xl font-semibold">{goal}</Text>
            </View>
          </View>
<<<<<<< HEAD
          {!isCurrentUserChallengeOnwer && !isChallengeCompleted && (
=======
          {challengeOwner?.id !== currentUser?.id && !isChallengeCompleted && (
>>>>>>> main
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
<<<<<<< HEAD
                    ? t("challenge_detail_screen.leave")
                    : t("challenge_detail_screen.join")
=======
                    ? i18n.t("challenge_detail_screen.leave")
                    : i18n.t("challenge_detail_screen.join")
>>>>>>> main
                }
                onPress={handleJoinLeaveChallenge}
              />
            </View>
          )}
<<<<<<< HEAD
          {!isCurrentUserChallengeOnwer && isChallengeCompleted && (
=======
          {isChallengeCompleted && (
>>>>>>> main
            <View className="ml-2 h-9">
              <Button
                containerClassName="border border-gray-dark flex items-center justify-center px-5"
                textClassName={`text-center text-md font-semibold text-gray-dark `}
<<<<<<< HEAD
                title={t("challenge_detail_screen.completed")}
=======
                title={i18n.t("challenge_detail_screen.completed")}
>>>>>>> main
              />
            </View>
          )}
        </View>

        <View className="mt-2 flex flex-1">
          <TabView
<<<<<<< HEAD
            titles={challengeTabTitles}
=======
            titles={CHALLENGE_TABS_TITLE_TRANSLATION}
>>>>>>> main
            activeTabIndex={index}
            setActiveTabIndex={setIndex}
          >
            <ProgressTab
              isJoined={isJoined}
              isChallengeCompleted={isChallengeCompleted}
              challengeData={challengeData}
<<<<<<< HEAD
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
=======
              setShouldRefresh={setIsNewProgressAdded}
            />
            <DescriptionTab challengeData={challengeData} />
            {participantList && challengeOwner?.companyAccount && (
              <ParticipantsTab participant={participantList} />
>>>>>>> main
            )}
          </TabView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChallengeDetailScreen;
