import { View, Text, SafeAreaView } from "react-native";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import {
  ICertifiedChallengeState,
  IChallenge,
} from "../../../../types/challenge";
import {
  NavigationRouteProps,
  RootStackParamList,
} from "../../../../navigation/navigation.type";
import { CHALLENGE_TABS_KEY } from "../../../../common/enum";

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

import ParticipantsTab from "./ParticipantsTab";
import CompanyCoachTab from "./CompanyCoachTab";
import CompanySkillsTab from "./CompanySkillsTab";
import CompanyCoachCalendarTabCompanyView from "./CompanyCoachCalendarTabCompanyView";

import Button from "../../../../component/common/Buttons/Button";
import CustomTabView from "../../../../component/common/Tab/CustomTabView";
import ProgressTab from "../../PersonalChallengesScreen/ChallengeDetailScreen/ProgressTab";
import GlobalToastController from "../../../../component/common/Toast/GlobalToastController";
import GlobalDialogController from "../../../../component/common/Dialog/GlobalDialogController";
import DescriptionTab from "../../PersonalChallengesScreen/ChallengeDetailScreen/DescriptionTab";
import ChatCoachTab from "../../CoachChallengesScreen/PersonalCoach/ChatCoachTab";

import CheckCircle from "./assets/check_circle.svg";

export type ChallengeCompanyDetailScreenNavigationProps =
  NativeStackNavigationProp<RootStackParamList, "ChallengeCompanyDetailScreen">;

interface ICompanyChallengeDetailScreenProps {
  challengeData: IChallenge;
  shouldScreenRefresh: boolean;
  route: NavigationRouteProps<"CompanyChallengeDetailScreen">;
  setShouldScreenRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ChallengeCompanyDetailScreen: FC<
  ICompanyChallengeDetailScreenProps
> = ({ challengeData, shouldScreenRefresh, setShouldScreenRefresh, route }) => {
  const { t } = useTranslation();
  const [participantList, setParticipantList] = useState(
    challengeData?.participants || []
  );
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

  const { goal, id: challengeId, coach: challengeCoach } = challengeData;

  const { getUserProfile } = useUserProfileStore();

  const currentUser = getUserProfile();

  const isCertifiedChallenge = challengeData?.type === "certified";
  const isVideoChallenge = challengeData?.package?.type === "videocall";
  const isCurrentUserCoach = currentUser.isCoach;

  const { index, setTabIndex } = useTabIndex({ tabRoutes, route });

  const fetchParticipants = async () => {
    try {
      const response = await getChallengeParticipants(challengeId);
      setParticipantList(response.data);
    } catch (error) {
      console.error("Error occurred while fetching participants:", error);
    }
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
  const isChallengeInProgress =
    (!isObjectEmpty(challengeState) &&
      challengeState.intakeStatus === "in-progress") ||
    challengeState.checkStatus === "in-progress" ||
    challengeState.closingStatus === "in-progress";

  const handleJoinChallenge = async () => {
    if (!currentUser?.id || !challengeId) return;

    if (isCertifiedChallenge) {
      const shouldPreventJoin =
        challengeState.intakeStatus &&
        challengeState.intakeStatus !== "init" &&
        challengeState.intakeStatus !== "open"
          ? true
          : false;

      if (shouldPreventJoin) {
        GlobalDialogController.showModal({
          message: t("dialog.err_join_in_progress_challenge"),
          title: t("dialog.err_title"),
        });
        return;
      }
    }

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
    setShouldScreenRefresh(true);
  };

  useEffect(() => {
    const tempTabRoutes = [...tabRoutes];

    if (challengeOwner?.companyAccount)
      if (
        !tempTabRoutes.find(
          (tabRoute) => tabRoute.key === CHALLENGE_TABS_KEY.PARTICIPANTS
        )
      )
        tempTabRoutes.push({
          key: CHALLENGE_TABS_KEY.PARTICIPANTS,
          title: t("challenge_detail_screen.participants"),
        });

    if (isCertifiedChallenge) {
      if (
        !tempTabRoutes.find(
          (tabRoute) => tabRoute.key === CHALLENGE_TABS_KEY.SKILLS
        )
      )
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
      if (isVideoChallenge) {
        if (
          !tempTabRoutes.find(
            (tabRoute) => tabRoute.key === CHALLENGE_TABS_KEY.COACH_CALENDAR
          )
        ) {
          tempTabRoutes.push({
            key: CHALLENGE_TABS_KEY.COACH_CALENDAR,
            title: t("challenge_detail_screen.coach_calendar"),
          });
        }
      } else {
        if (
          !tempTabRoutes.find(
            (tabRoute) => tabRoute.key === CHALLENGE_TABS_KEY.CHAT
          )
        )
          tempTabRoutes.push({
            key: CHALLENGE_TABS_KEY.CHAT,
            title: t("challenge_detail_screen.chat_coach"),
          });
      }
    }

    setTabRoutes(tempTabRoutes);
  }, []);

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
            challengeData={challengeData}
            isChallengeCompleted={isChallengeCompleted}
            isOtherUserProfile={challengeOwner.id !== currentUser?.id}
            setShouldRefresh={setShouldScreenRefresh}
          />
        );
      case CHALLENGE_TABS_KEY.DESCRIPTION:
        return <DescriptionTab challengeData={challengeData} />;
      case CHALLENGE_TABS_KEY.PARTICIPANTS:
        return <ParticipantsTab participant={participantList as any} />;
      case CHALLENGE_TABS_KEY.SKILLS:
        return (
          <CompanySkillsTab
            challengeData={challengeData}
            challengeState={challengeState}
          />
        );
      case CHALLENGE_TABS_KEY.COACH:
        return (
          <CompanyCoachTab
            coachID={challengeCoach}
            challengeId={challengeId}
            challengeState={challengeState}
            setChallengeState={setChallengeState}
            setShouldParentRefresh={setShouldScreenRefresh}
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
          <CompanyCoachCalendarTabCompanyView
            challengeId={challengeId}
            challengeState={challengeState}
          />
        );
    }
  };
  console.log("challengeStateChallCompnay: ", challengeState);
  return (
    <SafeAreaView>
      <View className="flex h-full flex-col bg-gray-veryLight ">
        <View className="flex flex-row items-center justify-between bg-white px-4 pb-3 pt-4">
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

        <View className="flex flex-1">
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

export default ChallengeCompanyDetailScreen;
