import { useTranslation } from "react-i18next";
import React, { useState, useEffect, FC } from "react";
import { View, Text, FlatList } from "react-native";

import { ICertifiedChallengeState } from "../../../../types/challenge";

import DefaultAvatar from "../../../../common/svg/default-avatar.svg";

import ConfirmDialog from "../../../../component/common/Dialog/ConfirmDialog/ConfirmDialog";
import {
  CoachBanner,
  TouchPointProgress,
  translateCheckpointToText,
} from "../../PersonalChallengesScreen/ChallengeDetailScreen/PersonalCoachTab";
import { IUserData } from "../../../../types/user";
import { formatChallengeStatePayload } from "../../../../utils/challenge";
import GlobalToastController from "../../../../component/common/Toast/GlobalToastController";
import {
  serviceGetCertifiedChallengeStatus,
  serviceOpenTouchpoint,
} from "../../../../service/challenge";
import { serviceGetOtherUserData } from "../../../../service/user";

interface ICompanyCoachTabProps {
  coachID: string;
  challengeId: string;
  challengeState: ICertifiedChallengeState;
  setChallengeState: React.Dispatch<
    React.SetStateAction<ICertifiedChallengeState>
  >;
  setShouldParentRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
}

const EmptyCoachBanner = () => {
  const { t } = useTranslation();
  return (
    <View className="flex flex-row items-center rounded-lg bg-gray-light p-4">
      <DefaultAvatar />
      <View className="ml-4" />
      <Text className="text-md font-semibold text-gray-dark">
        {t("challenge_detail_screen_tab.coach.waiting_for_coach") ||
          "Waiting for coach..."}
      </Text>
    </View>
  );
};

const CompanyCoachTab: FC<ICompanyCoachTabProps> = ({
  coachID,
  challengeId,
  challengeState,
  setChallengeState,
  setShouldParentRefresh,
}) => {
  const [
    isChangeTouchpointStatusModalVisible,
    setChangeTouchpointStatusModalVisible,
  ] = useState<boolean>(false);
  const [coachData, setCoachData] = useState<IUserData>({} as IUserData);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const { t } = useTranslation();

  const {
    currentTouchpoint,
    status: currentTouchpointStatus,
    totalChecks,
  } = formatChallengeStatePayload(challengeState);

  const handleOpenChangeTouchpointStatusModal = () => {
    setChangeTouchpointStatusModalVisible(true);
  };

  const handleCloseChangeTouchpointStatusModal = () => {
    setChangeTouchpointStatusModalVisible(false);
  };

  const onConfirmChangeTouchpointStatusModal = async () => {
    handleCloseChangeTouchpointStatusModal();
    try {
      const response = await serviceOpenTouchpoint(challengeId);
      if (response) {
        GlobalToastController.showModal({
          message: t("toast.open_touchpoint_success") as string,
        });
        getChallengeStatusOnRefresh();
      }
    } catch (error) {
      GlobalToastController.showModal({
        message: t("toast.open_touchpoint_error") as string,
      });
    }
  };

  const getChallengeStatusOnRefresh = async () => {
    if (!challengeId) return;
    setRefreshing(true);
    setShouldParentRefresh && setShouldParentRefresh(true);
    try {
      const response = await serviceGetCertifiedChallengeStatus(challengeId);
      setChallengeState(response.data);
    } catch (error) {
      console.error("error", error);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    const getCoachData = async () => {
      if (!coachID) return;
      try {
        const response = await serviceGetOtherUserData(coachID);
        setCoachData(response.data);
      } catch (error) {
        console.error("get coach data error", error);
      }
    };
    const getChallengeStatus = async () => {
      if (!challengeId) return;
      try {
        const response = await serviceGetCertifiedChallengeStatus(challengeId);
        setChallengeState(response.data);
      } catch (error) {
        console.error("error", error);
      }
    };
    getCoachData();
    getChallengeStatus();
  }, [coachID, challengeId]);

  return (
    <FlatList
      data={[]}
      renderItem={({ item }) => <View />}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View className="w-screen">
          <ConfirmDialog
            isVisible={isChangeTouchpointStatusModalVisible}
            title={t("challenge_detail_screen_tab.coach.confirm_open_phase", {
              phaseName: translateCheckpointToText(currentTouchpoint) || "",
            })}
            onConfirm={onConfirmChangeTouchpointStatusModal}
            confirmButtonLabel={t("challenge_detail_screen_tab.coach.yes")}
            closeButtonLabel={t("challenge_detail_screen_tab.coach.no")}
            onClosed={handleCloseChangeTouchpointStatusModal}
          />

          <View className="p-4">
            {coachData?.id ? (
              <CoachBanner coachData={coachData} />
            ) : (
              <EmptyCoachBanner />
            )}
            <View className="flex flex-col">
              <Text className="mt-6 text-md font-semibold text-primary-default">
                {t(
                  "challenge_detail_screen_tab.coach.touchpoint_of_challenge"
                ) || "Touchpoints of your challenge"}
              </Text>
              <TouchPointProgress
                currentTouchpoint={currentTouchpoint}
                currentTouchpointStatus={currentTouchpointStatus}
                totalChecks={totalChecks}
                handleOpenChangeTouchpointStatusModal={
                  handleOpenChangeTouchpointStatusModal
                }
              />
            </View>
          </View>
        </View>
      }
      refreshing={refreshing}
      onRefresh={getChallengeStatusOnRefresh}
    />
  );
};

export default CompanyCoachTab;
