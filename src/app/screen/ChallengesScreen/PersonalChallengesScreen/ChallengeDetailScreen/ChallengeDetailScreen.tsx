import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import { FC, useEffect, useState } from "react";
import { View, Text } from "react-native";

import { IChallenge } from "../../../../types/challenge";
import i18n from "../../../../i18n/i18n";
import TabView from "../../../../component/common/Tab/TabView";
import DescriptionTab from "./DescriptionTab";
import ProgressTab from "./ProgressTab";

import CheckCircle from "./assets/check_circle.svg";

import { getChallengeStatusColor } from "../../../../utils/common";
import { useUserProfileStore } from "../../../../store/user-store";
import Button from "../../../../component/common/Buttons/Button";
import {
  getChallengeParticipants,
  serviceAddChallengeParticipant,
  serviceRemoveChallengeParticipant,
} from "../../../../service/challenge";
import GlobalDialogController from "../../../../component/common/Dialog/GlobalDialogController";
import ParticipantsTab from "../../CompanyChallengesScreen/ChallengeDetailScreen/ParticipantsTab";
import GlobalToastController from "../../../../component/common/Toast/GlobalToastController";

interface IChallengeDetailScreenProps {
  challengeData: IChallenge;

  setIsJoinedLocal?: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: React.Dispatch<React.SetStateAction<void>>;
}

export const ChallengeDetailScreen: FC<IChallengeDetailScreenProps> = ({
  challengeData,
  setIsJoinedLocal,
  refresh,
}) => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [isJoined, setIsJoined] = useState<boolean>(true);
  const { goal, id: challengeId } = challengeData;
  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();
  const [participantList, setParticipantList] = useState([]);

  const fetchParticipants = async () => {
    const response = await getChallengeParticipants(challengeId);
    setParticipantList(response.data);
  };
  useEffect(() => {
    fetchParticipants();
  }, []);

  const challengeOwner = Array.isArray(challengeData?.owner)
    ? challengeData?.owner[0]
    : challengeData?.owner;

  const isCurrentUserParticipant = challengeData?.participants?.find(
    (participant) => participant.id === currentUser?.id
  );

  const challengeStatus =
    challengeOwner?.id === currentUser?.id
      ? challengeData?.status
      : isCurrentUserParticipant
      ? isCurrentUserParticipant?.challengeStatus
      : challengeData.status;

  const isChallengeCompleted =
    challengeStatus === "done" || challengeStatus === "closed";

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
          title: "Maximum people reached",
          message:
            t("dialog.err_max_join") ||
            "Sorry! You can not join this challenge, it has reached the maximum number of participants.",
        });
        return;
      }
      GlobalDialogController.showModal({
        title: "Error",
        message: "Something went wrong. Please try again later!",
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
        title: "Error",
        message: "Something went wrong. Please try again later!",
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

  return (
    <View className="flex h-full flex-col bg-white py-2">
      <View className="flex flex-row items-center justify-between px-4">
        <View className="flex-1 flex-row items-center gap-2 pb-2 pt-2">
          <CheckCircle fill={statusColor} />
          <View className="flex-1">
            <Text className="text-2xl font-semibold">{goal}</Text>
          </View>
        </View>
        {challengeOwner?.id !== currentUser?.id && !isChallengeCompleted && (
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
                  ? i18n.t("challenge_detail_screen.leave")
                  : i18n.t("challenge_detail_screen.join")
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
              title={i18n.t("challenge_detail_screen.completed")}
            />
          </View>
        )}
      </View>

      <View className="mt-2 flex flex-1">
        <TabView
          titles={CHALLENGE_TABS_TITLE_TRANSLATION}
          activeTabIndex={index}
          setActiveTabIndex={setIndex}
        >
          <ProgressTab
            isJoined={isJoined}
            isChallengeCompleted={isChallengeCompleted}
            challengeData={challengeData}
            refresh={refresh}
          />
          <DescriptionTab challengeData={challengeData} />
          {participantList && challengeOwner?.companyAccount && (
            <ParticipantsTab participant={participantList} />
          )}
        </TabView>
      </View>
    </View>
  );
};

export default ChallengeDetailScreen;
