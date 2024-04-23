import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import { FC, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import clsx from "clsx";
import {
  ICertifiedChallengeState,
  IChallenge,
} from "../../../../types/challenge";
import { CHALLENGE_TABS_KEY } from "../../../../common/enum";
import { NavigationRouteProps } from "../../../../navigation/navigation.type";

import DescriptionTab from "./DescriptionTab";
import ProgressTab from "./ProgressTab";

import CheckCircle from "./assets/check_circle.svg";
import TaskAltIcon from "./assets/task-alt.svg";
import TaskAltGrayIcon from "./assets/task-alt-gray.svg";
import {
  getChallengeStatusColor,
  isObjectEmpty,
} from "../../../../utils/common";
import { useUserProfileStore } from "../../../../store/user-store";
import {
  completeChallenge,
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
import GlobalDialogController from "../../../../component/common/Dialog/GlobalDialog/GlobalDialogController";
import ParticipantsTab from "../../CompanyChallengesScreen/ChallengeDetailScreen/ParticipantsTab";
import IndividualCoachCalendarTab from "../../../../component/IndividualCoachCalendar/IndividualCoachCalendarTab";
import CompanyCoachCalendarTabCoachView from "../../CompanyChallengesScreen/ChallengeDetailScreen/CompanyCoachCalendarTabCoachView";
import CompanyCoachCalendarTabCompanyView from "../../CompanyChallengesScreen/ChallengeDetailScreen/CompanyCoachCalendarTabCompanyView";
import { IUserData } from "../../../../types/user";
import { serviceGetOtherUserData } from "../../../../service/user";

import ConfirmDialog from "../../../../component/common/Dialog/ConfirmDialog/ConfirmDialog";
import { LAYOUT_THRESHOLD } from "../../../../common/constants";

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
  const [isDesktopView, setIsDesktopView] = useState(false);
  const [isJoined, setIsJoined] = useState<boolean>(true);
  const [participantList, setParticipantList] = useState([]);
  const [coachData, setCoachData] = useState<IUserData>({} as IUserData);
  const coachID = challengeData?.coach;
  const [challengeState, setChallengeState] =
    useState<ICertifiedChallengeState>({} as ICertifiedChallengeState);

  // Complete challenge states
  const [isChallengeCompleted, setIsChallengeCompleted] = useState<
    boolean | null
  >(null);
  const [
    isChallengeAlreadyCompletedDialogVisible,
    setIsChallengeAlreadyCompletedDialogVisible,
  ] = useState<boolean>(false);
  const [
    isCompletedChallengeDialogVisible,
    setIsCompletedChallengeDialogVisible,
  ] = useState<boolean>(false);

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

  // const isChallengeCompleted =
  //   challengeStatus === "done" || challengeStatus === "closed";

  useEffect(() => {
    // Check device width to determine if it's desktop view on the first load
    if (Dimensions.get("window").width <= LAYOUT_THRESHOLD) {
      setIsDesktopView(false);
    } else setIsDesktopView(true);
    // Add event listener to check if the device width is changed when the app is running
    const unsubscribeDimensions = Dimensions.addEventListener(
      "change",
      ({ window }) => {
        if (window.width <= LAYOUT_THRESHOLD) {
          setIsDesktopView(false);
        } else setIsDesktopView(true);
      }
    );

    return () => {
      unsubscribeDimensions.remove();
    };
  }, []);

  useEffect(() => {
    if (!challengeData) return;
    setIsChallengeCompleted(
      challengeStatus === "done" || challengeStatus === "closed"
    );
  }, [challengeData]);

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
    const getCoachData = async () => {
      if (!coachID) return;
      try {
        const response = await serviceGetOtherUserData(coachID);
        setCoachData(response.data);
      } catch (error) {
        console.error("get coach data error", error);
      }
    };
    getCoachData();
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
      GlobalToastController.showModal({
        message: t("toast.joined_success") || "You have joined the challenge!",
        isScreenHasBottomNav: false,
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
        isScreenHasBottomNav: false,
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

  const onCheckChallengeCompleted = () => {
    if (!challengeData) return;

    if (challengeData.type === "certified" && !challengeData.coach) {
      // certified challenge required coach before complete
      GlobalDialogController.showModal({
        title: t("dialog.challenge_is_not_assigned_to_coach.title"),
        message: t("dialog.challenge_is_not_assigned_to_coach.description"),
      });
      return;
    }

    if (isChallengeCompleted) {
      setIsChallengeAlreadyCompletedDialogVisible(true);
    } else {
      setIsCompletedChallengeDialogVisible(true);
    }
  };
  const onCompleteChallenge = () => {
    if (!challengeData) return;
    completeChallenge(challengeData.id)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsChallengeCompleted(true);
          setIsCompletedChallengeDialogVisible(false);
          // getChallengeData();
          setShouldScreenRefresh && setShouldScreenRefresh(true);
          GlobalToastController.showModal({
            message:
              t("toast.completed_challenge_success") ||
              "Challenge has been completed successfully !",
            isScreenHasBottomNav: false,
          });
        }
      })
      .catch((err) => {
        console.error("Error when completing challenge: ", err);
        setIsCompletedChallengeDialogVisible(false);
      });
  };

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
            coachData={coachData}
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
            {isCertifiedChallenge ? (
              <ChatCoachTab
                challengeData={challengeData}
                isChallengeInProgress={isChallengeInProgress}
              />
            ) : null}
          </>
        );
      case CHALLENGE_TABS_KEY.COACH_CALENDAR:
        return (
          <>
            {isCertifiedChallenge ? (
              challengeOwner.companyAccount ? (
                <CompanyCoachCalendarTabCompanyView
                  challengeId={challengeId}
                  challengeState={challengeState}
                />
              ) : (
                <IndividualCoachCalendarTab
                  coachData={coachData}
                  challengeData={challengeData}
                  isChallengeInProgress={isChallengeInProgress}
                />
              )
            ) : null}
          </>
        );
    }
  };

  return (
    <View className="flex flex-1 flex-col bg-white pt-2">
      <View className="flex flex-row items-center justify-between px-4">
        <View className="flex-1 flex-row items-center gap-2 pb-2 pt-2">
          <CheckCircle fill={statusColor} />
          <View className="flex-1">
            <Text className="text-2xl font-semibold">{goal}</Text>
          </View>
        </View>

        {isDesktopView ? (
          <View className="flex flex-row items-center justify-center space-x-2">
            {!isCurrentUserChallengeOnwer && !isChallengeCompleted ? (
              <View className="flex-1">
                <Button
                  isDisabled={false}
                  containerClassName={`px-3 py-[11px] ${
                    isJoined
                      ? "border border-gray-dark flex items-center justify-center px-5 text-gray-dark"
                      : "bg-primary-default flex items-center justify-center px-5"
                  }`}
                  textClassName={`text-center text-[14px] font-semibold ${
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
            ) : null}
            {isJoined ? (
              <View>
                {isChallengeCompleted ? (
                  <TouchableOpacity
                    onPress={onCheckChallengeCompleted}
                    className="flex flex-row items-center justify-center space-x-2 rounded-full bg-gray-light px-3 py-2"
                  >
                    <TaskAltGrayIcon />
                    <Text className="text-[14px] font-semibold text-gray-medium">
                      {t("challenge_detail_screen.completed")}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={onCheckChallengeCompleted}
                    className="flex flex-row items-center justify-center space-x-2 rounded-full border-[1px] border-primary-default bg-white px-3 py-2"
                  >
                    <TaskAltIcon />
                    <Text className="text-[14px] font-semibold text-primary-default">
                      {t("challenge_detail_screen.complete")}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : null}
          </View>
        ) : null}

        {/* {!isCurrentUserChallengeOnwer && isChallengeCompleted ? (
          <View className="ml-2 h-9">
            <Button
              containerClassName="border border-gray-dark flex items-center justify-center px-5"
              textClassName={`text-center text-md font-semibold text-gray-dark `}
              title={t("challenge_detail_screen.completed")}
            />
          </View>
        ) : null} */}
      </View>

      {!isDesktopView ? (
        <View className="mt-3 flex flex-row items-center justify-center space-x-2 px-4">
          {!isCurrentUserChallengeOnwer && !isChallengeCompleted ? (
            <View className="flex-1">
              <Button
                isDisabled={false}
                containerClassName={`px-3 py-[11px] ${
                  isJoined
                    ? "border border-gray-dark flex items-center justify-center px-5 text-gray-dark"
                    : "bg-primary-default flex items-center justify-center px-5"
                }`}
                textClassName={`text-center text-[14px] font-semibold ${
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
          ) : null}
          {isJoined ? (
            <View className="flex-1">
              {isChallengeCompleted ? (
                <TouchableOpacity
                  onPress={onCheckChallengeCompleted}
                  className="flex flex-row items-center justify-center space-x-2 rounded-full bg-gray-light px-3 py-2"
                >
                  <TaskAltGrayIcon />
                  <Text className="text-[14px] font-semibold text-gray-medium">
                    {t("challenge_detail_screen.completed")}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={onCheckChallengeCompleted}
                  className="flex flex-row items-center justify-center space-x-2 rounded-full border-[1px] border-primary-default bg-white px-3 py-2"
                >
                  <TaskAltIcon />
                  <Text className="text-[14px] font-semibold text-primary-default">
                    {t("challenge_detail_screen.complete")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null}
        </View>
      ) : null}

      <View className="mt-2 flex flex-1">
        <CustomTabView
          routes={tabRoutes}
          renderScene={renderScene}
          index={index}
          setIndex={setTabIndex}
        />
      </View>
      <ConfirmDialog
        isVisible={isCompletedChallengeDialogVisible}
        title={
          t("dialog.mark_challenge.title") || "Mark challenge as completed"
        }
        description={
          t("dialog.mark_challenge.description") ||
          "You cannot edit challenge or update progress after marking the challenge as complete"
        }
        confirmButtonLabel={t("dialog.complete") || "Complete"}
        closeButtonLabel={t("dialog.cancel") || "Cancel"}
        onConfirm={onCompleteChallenge}
        onClosed={() => setIsCompletedChallengeDialogVisible(false)}
      />

      <ConfirmDialog
        isVisible={isChallengeAlreadyCompletedDialogVisible}
        title={
          t("dialog.challenge_already_completed.title") ||
          "Challenge already complete"
        }
        description={
          t("dialog.challenge_already_completed.description") ||
          "This challenge has already been completed. Please try another one."
        }
        confirmButtonLabel={t("dialog.got_it") || "Got it"}
        onConfirm={() => {
          setIsChallengeAlreadyCompletedDialogVisible(false);
        }}
      />
    </View>
  );
};

export default ChallengeDetailScreen;
