import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import { FC, useEffect, useState } from "react";
import { View, Text, SafeAreaView } from "react-native";

import {
  ICertifiedChallengeState,
  IChallenge,
} from "../../../../types/challenge";
import { CHALLENGE_TABS_KEY } from "../../../../common/enum";
import { NavigationRouteProps } from "../../../../navigation/navigation.type";

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

import { useTabIndex } from "../../../../hooks/useTabIndex";

import PersonalCoachTab from "./PersonalCoachTab";
import PersonalSkillsTab from "./PersonalSkillsTab";
import Button from "../../../../component/common/Buttons/Button";
import CustomTabView from "../../../../component/common/Tab/CustomTabView";
import ChatCoachTab from "../../CoachChallengesScreen/PersonalCoach/ChatCoachTab";
import GlobalToastController from "../../../../component/common/Toast/GlobalToastController";
import GlobalDialogController from "../../../../component/common/Dialog/GlobalDialogController";
import ParticipantsTab from "../../CompanyChallengesScreen/ChallengeDetailScreen/ParticipantsTab";
import IndividualCoachCalendarTab from "../../../../component/IndividualCoachCalendar/IndividualCoachCalendarTab";
import CompanyCoachCalendarTabCoachView from "../../CompanyChallengesScreen/ChallengeDetailScreen/CompanyCoachCalendarTabCoachView";

interface IChallengeDetailScreenProps {
  challengeData: IChallenge;
  shouldScreenRefresh?: boolean;
  setIsJoinedLocal?: React.Dispatch<React.SetStateAction<boolean>>;
  route?: NavigationRouteProps<"PersonalChallengeDetailScreen">;
  setShouldScreenRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ChallengeDetailScreen: FC<IChallengeDetailScreenProps> = ({
  challengeData,
  shouldScreenRefresh,
  setIsJoinedLocal,
  route,
  setShouldScreenRefresh,
}) => {
  const { t } = useTranslation();
  const [isJoined, setIsJoined] = useState<boolean>(true);
  const [participantList, setParticipantList] = useState([]);
  const [challengeState, setChallengeState] =
    useState<ICertifiedChallengeState>({} as ICertifiedChallengeState);
  const [tabRoutes, setTabRoutes] = useState([
    {
      key: CHALLENGE_TABS_KEY.PROGRESS,
      title: t("challenge_detail_screen.progress"),
    },
    {
      key: CHALLENGE_TABS_KEY.DESCRIPTION,
      title: t("challenge_detail_screen.description"),
    },
  ]);
  const { index, setTabIndex } = useTabIndex({ tabRoutes, route });

  const { goal, id: challengeId, coach: challengeCoach } = challengeData;
  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();

  const fetchParticipants = async () => {
    const response = await getChallengeParticipants(challengeId);
    setParticipantList(response.data);
  };

  const challengeOwner = Array.isArray(challengeData?.owner)
    ? challengeData?.owner[0]
    : challengeData?.owner;

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

  useEffect(() => {
    const tempTabRoutes = [...tabRoutes];

    if (participantList && challengeOwner?.companyAccount) {
      const isParticipantsTabAlreadyExist = tempTabRoutes.find(
        (tab) => tab.key === CHALLENGE_TABS_KEY.PARTICIPANTS
      );
      if (!isParticipantsTabAlreadyExist)
        tempTabRoutes.push({
          key: CHALLENGE_TABS_KEY.PARTICIPANTS,
          title: t("challenge_detail_screen.participants"),
        });
    }
    if (isCertifiedChallenge) {
      const isSkillsTabAlreadyExist = tempTabRoutes.find(
        (tab) => tab.key === CHALLENGE_TABS_KEY.SKILLS
      );
      if (!isSkillsTabAlreadyExist)
        tempTabRoutes.push(
          {
            key: CHALLENGE_TABS_KEY.SKILLS,
            title: t("challenge_detail_screen.skills"),
          },
          {
            key: CHALLENGE_TABS_KEY.COACH,
            title: t("challenge_detail_screen.coach"),
          }
        );
      if (challengeData.package.type === "chat") {
        const isChatTabAlreadyExist = tempTabRoutes.find(
          (tab) => tab.key === CHALLENGE_TABS_KEY.CHAT
        );
        if (!isChatTabAlreadyExist)
          tempTabRoutes.push({
            key: CHALLENGE_TABS_KEY.CHAT,
            title: t("challenge_detail_screen.chat_coach"),
          });
      } else if (challengeData.package.type === "videocall") {
        const isCoachCalendarTabAlreadyExist = tempTabRoutes.find(
          (tab) => tab.key === CHALLENGE_TABS_KEY.COACH_CALENDAR
        );
        if (!isCoachCalendarTabAlreadyExist)
          tempTabRoutes.push({
            key: CHALLENGE_TABS_KEY.COACH_CALENDAR,
            title: t("challenge_detail_screen_tab.coach_calendar.title"),
          });
      }
    }
    setTabRoutes(tempTabRoutes);
  }, []);

  const isCertifiedChallenge = challengeData?.type === "certified";

  const isChallengeInProgress =
    (!isObjectEmpty(challengeState) &&
      challengeState.intakeStatus === "in-progress") ||
    challengeState.checkStatus === "in-progress" ||
    challengeState.closingStatus === "in-progress";

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
    if (!shouldScreenRefresh) return;
    fetchParticipants();
  }, [shouldScreenRefresh]);

  useEffect(() => {
    fetchParticipants();
  }, []);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case CHALLENGE_TABS_KEY.PROGRESS:
        return (
          <ProgressTab
            isJoined={isJoined}
            isChallengeCompleted={isChallengeCompleted}
            challengeData={challengeData}
            setShouldRefresh={setShouldScreenRefresh}
          />
        );
      case CHALLENGE_TABS_KEY.DESCRIPTION:
        return <DescriptionTab challengeData={challengeData} />;
      case CHALLENGE_TABS_KEY.PARTICIPANTS:
        return (
          <>
            {participantList && challengeOwner?.companyAccount && (
              <ParticipantsTab
                participant={participantList}
                fetchParticipants={fetchParticipants}
              />
            )}
          </>
        );
      case CHALLENGE_TABS_KEY.SKILLS:
        return <PersonalSkillsTab challengeData={challengeData} />;
      case CHALLENGE_TABS_KEY.COACH:
        return (
          <PersonalCoachTab
            coachID={challengeCoach}
            challengeId={challengeId}
            challengeState={challengeState}
            setChallengeState={setChallengeState}
            setShouldParentRefresh={setShouldScreenRefresh}
            isCurrentUserChallengeOnwer={isCurrentUserChallengeOnwer}
          />
        );
      case CHALLENGE_TABS_KEY.CHAT:
        return (
          <>
            {isCertifiedChallenge && (
              <ChatCoachTab
                challengeData={challengeData}
                isChallengeInProgress={isChallengeInProgress}
              />
            )}
          </>
        );
      case CHALLENGE_TABS_KEY.COACH_CALENDAR:
        return (
          <>
            {isCertifiedChallenge ? (
              challengeOwner.companyAccount ? (
                <CompanyCoachCalendarTabCoachView />
              ) : (
                <IndividualCoachCalendarTab
                  isCoach={false}
                  isChallengeInProgress={isChallengeInProgress}
                />
              )
            ) : null}
          </>
        );
    }
  };

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

        <View className="mt-2 flex flex-1 bg-gray-veryLight">
          <CustomTabView
            routes={tabRoutes}
            renderScene={renderScene}
            index={index}
            setIndex={setTabIndex}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChallengeDetailScreen;
