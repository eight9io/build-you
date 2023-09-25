import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect, ReactNode, FC } from "react";
import { Image } from "expo-image";

import { IUserData } from "../../../../types/user";
import {
  CheckpointType,
  IChallengeState,
  IChallengeTouchpointStatus,
} from "../../../../types/challenge";

import { useNav } from "../../../../hooks/useNav";

import DefaultAvatar from "../../../../common/svg/default-avatar.svg";
import TouchPointCircle from "../../../../common/svg/touchpoint-circle.svg";
import TouchPointCheckCircle from "../../../../common/svg/check-circle-24.svg";
import TouchPointRetangle from "../../../../common/svg/touchpoint-rectangle.svg";
import ConfirmDialog from "../../../../component/common/Dialog/ConfirmDialog";
import { serviceGetOtherUserData } from "../../../../service/user";

interface ICoachTabProps {
  coachID: string;
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
  numberOfChecks,
  currentTouchpoint,
  currentTouchpointStatus,
  handleOpenChangeTouchpointStatusModal,
}: IChallengeState) => {
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
  for (let i = 0; i < numberOfChecks; i++) {
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
              {touchpoint.name}
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

const CoachTab: FC<ICoachTabProps> = ({ coachID }) => {
  const [
    isChangeTouchpointStatusModalVisible,
    setChangeTouchpointStatusModalVisible,
  ] = useState<boolean>(false);
  const [coachData, setCoachData] = useState<IUserData>({} as IUserData);

  const { t } = useTranslation();

  const handleOpenChangeTouchpointStatusModal = () => {
    setChangeTouchpointStatusModalVisible(true);
  };

  const handleCloseChangeTouchpointStatusModal = () => {
    setChangeTouchpointStatusModalVisible(false);
  };

  const getCoachData = async () => {
    if (!coachID) return;
    try {
      const response = await serviceGetOtherUserData(coachID);
      setCoachData(response.data);
    } catch (error) {
      console.log("get coach data error", error);
    }
  };

  useEffect(() => {
    getCoachData();
  }, [coachID]);

  return (
    <View className="w-screen">
      <ConfirmDialog
        isVisible={isChangeTouchpointStatusModalVisible}
        title="Are you sure?"
        description="You cannot undo this action"
        onConfirm={() => {}}
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
            numberOfChecks={3}
            currentTouchpoint="check-2"
            currentTouchpointStatus="in-progress"
            handleOpenChangeTouchpointStatusModal={
              handleOpenChangeTouchpointStatusModal
            }
          />
        </View>
      </View>
    </View>
  );
};

export default CoachTab;
