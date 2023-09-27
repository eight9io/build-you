import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect, ReactNode, FC } from "react";
import { Image } from "expo-image";

import { IUserData } from "../../../../types/user";
import {
  CheckpointType,
  ICertifiedChallengeState,
  IChallengeTouchpointStatus,
} from "../../../../types/challenge";

import { useNav } from "../../../../hooks/useNav";
import { serviceGetOtherUserData } from "../../../../service/user";
import { formatChallengeStatePayload } from "../../../../utils/challenge";

import DefaultAvatar from "../../../../common/svg/default-avatar.svg";
import TouchPointCircle from "../../../../common/svg/touchpoint-circle.svg";
import TouchPointCheckCircle from "../../../../common/svg/check-circle-24.svg";
import TouchPointRetangle from "../../../../common/svg/touchpoint-rectangle.svg";
import ConfirmDialog from "../../../../component/common/Dialog/ConfirmDialog";
import {
  serviceGetCertifiedChallengeStatus,
  serviceOpenTouchpoint,
} from "../../../../service/challenge";
import GlobalToastController from "../../../../component/common/Toast/GlobalToastController";

interface ICoachTabProps {
  coachID: string;
  challengeId: string;
}

export const renderTouchpointCircle = (status: IChallengeTouchpointStatus) => {
  switch (status) {
    case "init":
      return <TouchPointCircle fill={"#C5C8D2"} />;
    case "open":
      return <TouchPointCircle fill={"#6C6E76"} />;
    case "in-progress":
      return <TouchPointCircle fill={"#FFC632"} />;
    case "closed":
      return <TouchPointCheckCircle />;
  }
};

export const getButtonColor = (status: IChallengeTouchpointStatus) => {
  switch (status) {
    case "open":
      return "bg-primary-default";
    case "in-progress":
      return "bg-secondary-dark";
    case "closed":
      return "bg-gray-medium";
  }
};

const translateCheckpointToText = (checkpoint: CheckpointType) => {
  if (!checkpoint) return;
  const match = checkpoint.match(/check-(\d+)/);
  if (match) {
    const checkNumber = match[1];
    let suffix = "th";
    if (checkNumber.endsWith("1")) {
      suffix = "st";
    } else if (checkNumber.endsWith("2")) {
      suffix = "nd";
    } else if (checkNumber.endsWith("3")) {
      suffix = "rd";
    }
    return `${checkNumber}${suffix} Check`;
  }
  switch (checkpoint) {
    case "intake":
      return "Intake";
    case "closing":
      return "Closing";
    default:
      return checkpoint;
  }
};

const EmptyCoachBanner = (translation) => {
  return (
    <View className="flex flex-row items-center rounded-lg bg-gray-light p-4">
      <DefaultAvatar />
      <View className="ml-4" />
      <Text className="text-md font-semibold text-gray-dark">
        Waiting for coach...
      </Text>
    </View>
  );
};

const CoachBanner = ({ coachData }: { coachData: IUserData }) => {
  const navigation = useNav();

  const handleOpenCoachProfile = () => {
    navigation.navigate("OtherUserProfileScreen", { userId: coachData?.id });
  };

  return (
    <View className="flex flex-row items-center justify-between rounded-lg bg-gray-light p-4">
      <View className="flex flex-row items-center">
        {coachData?.avatar ? (
          <Image
            source={{ uri: coachData?.avatar }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        ) : (
          <DefaultAvatar />
        )}
        <View className="ml-4" />
        <View className="flex flex-col items-start">
          <Text className="text-black text-md font-semibold ">
            {coachData.name} {coachData.surname}
          </Text>
          <Text className="w-44 text-sm capitalize text-gray-dark">
            {coachData?.occupation?.name}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        className="flex flex-row items-center justify-center rounded-full bg-white p-2 px-6 "
        onPress={handleOpenCoachProfile}
      >
        <Text className="font-semibold text-primary-default">Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const TouchPointProgress = ({
  currentTouchpoint,
  currentTouchpointStatus,
  totalChecks,
  handleOpenChangeTouchpointStatusModal,
}: {
  currentTouchpoint: CheckpointType;
  currentTouchpointStatus: IChallengeTouchpointStatus;
  totalChecks: number;
  handleOpenChangeTouchpointStatusModal: () => void;
}) => {
  const defaultTouchpoint: {
    name: CheckpointType;
    status: IChallengeTouchpointStatus;
  }[] = [
    {
      name: "intake",
      status: "init",
    },
    {
      name: "closing",
      status: "init",
    },
  ];
  // add number of checks
  for (let i = 0; i < totalChecks; i++) {
    defaultTouchpoint.splice(-1, 0, {
      name: `check-${i + 1}`,
      status: "init",
    });
  }

  // update current touchpoint status
  // update previous touchpoint status to closed and current touchpoint status to currenttouchpointstatus
  const currentTouchpointIndex = defaultTouchpoint.findIndex(
    (touchpoint) => touchpoint.name === currentTouchpoint
  );
  if (currentTouchpointIndex !== -1) {
    for (let i = 0; i < currentTouchpointIndex; i++) {
      defaultTouchpoint[i].status = "closed";
    }
    defaultTouchpoint[currentTouchpointIndex].status = currentTouchpointStatus;
  }

  const renderProgress = (
    touchpoint: {
      name: CheckpointType;
      status: IChallengeTouchpointStatus;
    },
    status: IChallengeTouchpointStatus,
    isLastIndex: boolean
  ): ReactNode => {
    return (
      <View className="flex w-full flex-row items-start justify-between">
        <View className="flex flex-row">
          <View className="flex flex-col items-center justify-center">
            {renderTouchpointCircle(touchpoint.status)}
            {!isLastIndex && (
              <View className="py-2">
                <TouchPointRetangle />
              </View>
            )}
          </View>
          <View className="pl-3 pt-1">
            <Text
              className={clsx(
                "text-md capitalize",
                touchpoint.status === "init" ? "" : "font-semibold"
              )}
            >
              {translateCheckpointToText(touchpoint.name)}
            </Text>
          </View>
        </View>

        {touchpoint.status !== "init" && (
          <TouchableOpacity
            className={clsx(
              "flex w-[120] flex-row items-center justify-center rounded-full p-1.5",
              getButtonColor(touchpoint.status)
            )}
            disabled={touchpoint.status !== "open"}
            onPress={handleOpenChangeTouchpointStatusModal}
          >
            <Text className="font-semibold capitalize text-white">
              {touchpoint.status}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View className="flex flex-col py-4">
      {defaultTouchpoint.map((touchpoint, index) => {
        const isLastIndex = index === defaultTouchpoint.length - 1;
        return (
          <View
            key={index}
            className="flex flex-row items-center justify-between"
          >
            {renderProgress(touchpoint, currentTouchpointStatus, isLastIndex)}
          </View>
        );
      })}
    </View>
  );
};

const PersonalCoachTab: FC<ICoachTabProps> = ({ coachID, challengeId }) => {
  const [
    isChangeTouchpointStatusModalVisible,
    setChangeTouchpointStatusModalVisible,
  ] = useState<boolean>(false);
  const [coachData, setCoachData] = useState<IUserData>({} as IUserData);
  const [challengeState, setChallengeState] =
    useState<ICertifiedChallengeState>({} as ICertifiedChallengeState);

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
      const response = await serviceOpenTouchpoint(
        challengeId,
        currentTouchpoint
      );
      if (response) {
        GlobalToastController.showModal({
          message: t("toast.open_touchpoint_success") as string,
        });
        getChallengeStatus();
      }
    } catch (error) {
      GlobalToastController.showModal({
        message: t("toast.open_touchpoint_error") as string,
      });
    }
  };

  const getChallengeStatus = async () => {
    if (!challengeId) return;
    try {
      const response = await serviceGetCertifiedChallengeStatus(challengeId);
      setChallengeState(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    const getCoachData = async () => {
      if (!coachID) return;
      try {
        const response = await serviceGetOtherUserData(coachID);
        setCoachData(response.data);
      } catch (error) {
        console.log("get coach data error", error);
      }
    };

    getCoachData();
    getChallengeStatus();
  }, [coachID, challengeId]);

  return (
    <View className="w-screen">
      <ConfirmDialog
        isVisible={isChangeTouchpointStatusModalVisible}
        title={`Do you really want to start the ${
          translateCheckpointToText(currentTouchpoint) || ""
        } Phase?`}
        onConfirm={onConfirmChangeTouchpointStatusModal}
        confirmButtonLabel="Yes"
        closeButtonLabel="No"
        onClosed={handleCloseChangeTouchpointStatusModal}
      />

      <View className="p-4">
        {coachData?.id ? (
          <CoachBanner coachData={coachData} />
        ) : (
          <EmptyCoachBanner translation={t} />
        )}
        <View className="flex flex-col">
          <Text className="mt-6 text-md font-semibold text-primary-default">
            Touchpoints of your challenge
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
  );
};

export default PersonalCoachTab;
