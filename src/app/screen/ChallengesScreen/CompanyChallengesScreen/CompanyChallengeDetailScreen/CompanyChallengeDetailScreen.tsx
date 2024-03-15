import clsx from "clsx";
import { useTranslation } from "react-i18next";
import React, { FC, useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView, TouchableOpacity, View, Text } from "react-native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import httpInstance from "../../../../utils/http";
import { onShareChallengeLink } from "../../../../utils/shareLink.util";
import {
  deleteChallenge,
  completeChallenge,
} from "../../../../service/challenge";

import { RootStackParamList } from "../../../../navigation/navigation.type";
import { IChallenge } from "../../../../types/challenge";

import PopUpMenu from "../../../../component/common/PopUpMenu";
import Button from "../../../../component/common/Buttons/Button";
import EditChallengeModal from "../../../../component/modal/EditChallengeModal";
import ConfirmDialog from "../../../../component/common/Dialog/ConfirmDialog/ConfirmDialog";

import ShareIcon from "./assets/share.svg";
import TaskAltIcon from "./assets/task-alt.svg";
import ChallengeCompanyDetailScreen from "../ChallengeDetailScreen/ChallengeCompanyDetailScreen";
import { useUserProfileStore } from "../../../../store/user-store";
import GlobalToastController from "../../../../component/common/Toast/GlobalToastController";
import GlobalDialogController from "../../../../component/common/Dialog/GlobalDialog/GlobalDialogController";

type CompanyChallengeDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CompanyChallengeDetailScreen"
>;

interface IRightCompanyChallengeDetailOptionsProps {
  challengeData: IChallenge | undefined;
  onEditChallengeBtnPress: () => void;
  setShouldRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteChallengeDialogVisible: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export const RightCompanyChallengeDetailOptions: FC<
  IRightCompanyChallengeDetailOptionsProps
> = ({
  challengeData,
  onEditChallengeBtnPress,
  setIsDeleteChallengeDialogVisible,
}) => {
  const { t } = useTranslation();

  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();

  const challengeOwner = Array.isArray(challengeData?.owner)
    ? challengeData?.owner[0]
    : challengeData?.owner;

  const currentUserInParticipant = challengeData?.participants?.find(
    (participant) => participant.id === currentUser?.id
  );

  const isCurrentUserOwner = challengeOwner?.id === currentUser?.id;

  const challengeStatus =
    challengeOwner?.id === currentUser?.id
      ? challengeData?.status
      : currentUserInParticipant?.challengeStatus;
  const isChallengeCompleted =
    challengeStatus === "done" || challengeStatus === "closed";

  const onShare = async () => {
    onShareChallengeLink(challengeData?.id);
  };

  return (
    <View>
      <View className="-mt-1 flex flex-row items-center">
        <View className="pl-4 pr-2">
          <Button Icon={<ShareIcon />} onPress={onShare} />
        </View>

        {isCurrentUserOwner && (
          <PopUpMenu
            iconColor="#FF7B1D"
            isDisabled={isChallengeCompleted}
            options={[
              {
                text: t("pop_up_menu.edit") as string,
                onPress: onEditChallengeBtnPress,
              },
              {
                text: t("pop_up_menu.delete") as string,
                onPress: () => setIsDeleteChallengeDialogVisible(true),
              },
            ]}
          />
        )}
      </View>
    </View>
  );
};

const CompanyChallengeDetailScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: CompanyChallengeDetailScreenNavigationProp;
}) => {
  const { t } = useTranslation();
  const [isEditChallengeModalVisible, setIsEditChallengeModalVisible] =
    useState<boolean>(false);
  const [challengeData, setChallengeData] = useState<IChallenge | undefined>(
    undefined
  );
  const [
    isCompletedChallengeDialogVisible,
    setIsCompletedChallengeDialogVisible,
  ] = useState<boolean>(false);
  const [
    isChallengeAlreadyCompletedDialogVisible,
    setIsChallengeAlreadyCompletedDialogVisible,
  ] = useState<boolean>(false);
  const [isCompletedChallengeSuccess, setIsCompletedChallengeSuccess] =
    useState<boolean | null>(null);

  // use for refresh screen when add new progress, refetch participant list,  edit challenge
  const [shouldScreenRefresh, setShouldScreenRefresh] =
    useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  const [isDeleteChallengeDialogVisible, setIsDeleteChallengeDialogVisible] =
    useState<boolean>(false);
  const [isDeleteSuccess, setIsDeleteSuccess] = useState<boolean>(false);
  const [isDeleteError, setIsDeleteError] = useState<boolean>(false);

  const challengeId = route?.params?.challengeId;

  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();

  const currentUserInParticipant = challengeData?.participants?.find(
    (participant) => participant.id === currentUser?.id
  );

  const challengeOwner = Array.isArray(challengeData?.owner)
    ? challengeData?.owner[0]
    : challengeData?.owner;

  const challengeStatus =
    challengeOwner?.id === currentUser?.id
      ? challengeData?.status
      : currentUserInParticipant?.challengeStatus;

  const isCoachAssigned = !!challengeData?.coach;
  const isCertifiedChallenge = challengeData?.type === "certified";

  const isChallengeCompleted =
    challengeStatus === "done" || challengeStatus === "closed";

  const handleEditChallengeBtnPress = () => {
    setIsEditChallengeModalVisible(true);
  };
  const handleEditChallengeModalClose = () => {
    setIsEditChallengeModalVisible(false);
  };

  const handleEditChallengeModalConfirm = () => {
    setShouldScreenRefresh(true);
    setIsEditChallengeModalVisible(false);
  };

  const handleDeleteChallenge = () => {
    if (!challengeData) return;
    deleteChallenge(challengeData.id)
      .then((res) => {
        if (res.status === 200) {
          setIsDeleteChallengeDialogVisible(false);

          GlobalToastController.showModal({
            message:
              t("toast.delete_challenge_success") ||
              "Deleted Challenge successfully ! ",
          });
          navigation.navigate("CompanyChallengesScreen");
        }
      })
      .catch((err) => {
        setIsDeleteChallengeDialogVisible(false);
        setTimeout(() => {
          setIsDeleteError(true);
        }, 600);
      });
  };

  const onCheckChallengeCompleted = () => {
    if (!challengeData) return;
    if (isCertifiedChallenge) {
      // certified challenge required coach before complete
      if (isCoachAssigned) {
        if (isChallengeCompleted) {
          setIsChallengeAlreadyCompletedDialogVisible(true);
        } else {
          setIsCompletedChallengeDialogVisible(true);
        }
      } else {
        GlobalDialogController.showModal({
          title: t("dialog.challenge_is_not_assigned_to_coach.title"),
          message: t("dialog.challenge_is_not_assigned_to_coach.description"),
        });
        return;
      }
    }

    if (isChallengeCompleted) {
      setIsChallengeAlreadyCompletedDialogVisible(true);
    } else {
      setIsCompletedChallengeDialogVisible(true);
    }
  };

  const onCompleteChallenge = async () => {
    if (!challengeData) return;
    await completeChallenge(challengeData.id)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsCompletedChallengeDialogVisible(false);
          setIsCompletedChallengeSuccess(true);
          setShouldScreenRefresh(true);
          GlobalToastController.showModal({
            message:
              t("toast.completed_challenge_success") ||
              "Challenge has been completed successfully !",
          });
        }
      })
      .catch((err) => {
        setIsCompletedChallengeDialogVisible(false);
        setTimeout(() => {
          setIsCompletedChallengeSuccess(false);
        }, 600);
      });
  };

  const onCloseSuccessDialog = () => {
    setIsCompletedChallengeSuccess(null);
  };

  useLayoutEffect(() => {
    // Set header options, must set it manually to handle the onPress event inside the screen
    navigation.setOptions({
      headerRight: () => (
        <RightCompanyChallengeDetailOptions
          challengeData={challengeData}
          setShouldRefresh={setShouldScreenRefresh}
          onEditChallengeBtnPress={handleEditChallengeBtnPress}
          setIsDeleteChallengeDialogVisible={setIsDeleteChallengeDialogVisible}
        />
      ),
    });
  }, [challengeData]);

  useEffect(() => {
    if (!challengeId && !shouldScreenRefresh) return;
    if (isFirstLoad) setIsFirstLoad(false);
    try {
      httpInstance.get(`/challenge/one/${challengeId}`).then((res) => {
        setChallengeData(res.data);
      });
    } catch (error) {
      console.error(error);
    }
    setShouldScreenRefresh(false);
  }, [shouldScreenRefresh]);

  return (
    <SafeAreaView className="flex-1 bg-gray-veryLight">
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
      <ConfirmDialog
        isVisible={isDeleteChallengeDialogVisible}
        title={t("dialog.delete_challenge.title") || "Delete Challenge"}
        description={
          t("dialog.delete_challenge.description") ||
          "Are you sure you want to delete this challenge?"
        }
        confirmButtonLabel={t("dialog.delete") || "Delete"}
        closeButtonLabel={t("dialog.cancel") || "Cancel"}
        onConfirm={handleDeleteChallenge}
        onClosed={() => setIsDeleteChallengeDialogVisible(false)}
      />

      <ConfirmDialog
        isVisible={isDeleteSuccess}
        title={
          t("dialog.delete_challenge.delete_success_title") ||
          "Challenge Deleted"
        }
        description={
          t("dialog.delete_challenge.delete_success_description") ||
          "Challenge has been deleted successfully."
        }
        confirmButtonLabel={t("dialog.got_it") || "Got it"}
        onConfirm={() => {
          setIsDeleteSuccess(false);
          navigation.navigate("CompanyChallengesScreen");
        }}
      />
      <ConfirmDialog
        isVisible={isDeleteError}
        title={t("dialog.err_title") || "Error"}
        description={t("error_general_message") || "Something went wrong"}
        confirmButtonLabel={t("dialog.close") || "Close"}
        onConfirm={() => {
          setIsDeleteError(false);
        }}
      />

      {isCompletedChallengeSuccess !== null && (
        <ConfirmDialog
          isVisible={isCompletedChallengeSuccess !== null}
          title={
            isCompletedChallengeSuccess
              ? t("dialog.congratulation") || "Congratulation!"
              : t("error_general_message") || "Something went wrong"
          }
          description={
            isCompletedChallengeSuccess
              ? t("dialog.completed_challenge_success") ||
                "Challenge has been completed successfully."
              : t("error_general_message") || "Please try again later."
          }
          confirmButtonLabel={t("dialog.got_it") || "Got it"}
          onConfirm={onCloseSuccessDialog}
        />
      )}

      {(!!currentUserInParticipant ||
        challengeOwner?.id === currentUser?.id) && (
        <View className="absolute bottom-16 right-4 z-10">
          <TouchableOpacity
            onPress={onCheckChallengeCompleted}
            disabled={isChallengeCompleted}
            className={clsx(
              "flex flex-row items-center justify-center gap-x-2 rounded-full  px-6 py-3 ",
              isChallengeCompleted ? "bg-gray-medium" : "bg-primary-default"
            )}
          >
            <Text className="uppercase text-white">
              {isChallengeCompleted
                ? t("challenge_detail_screen.completed")
                : t("challenge_detail_screen.complete")}
            </Text>
            <TaskAltIcon />
          </TouchableOpacity>
        </View>
      )}
      {challengeData ? (
        <>
          <ChallengeCompanyDetailScreen
            route={route}
            challengeData={challengeData}
            shouldScreenRefresh={shouldScreenRefresh}
            setShouldScreenRefresh={setShouldScreenRefresh}
          />
          <EditChallengeModal
            visible={isEditChallengeModalVisible}
            onClose={handleEditChallengeModalClose}
            onConfirm={handleEditChallengeModalConfirm}
            challenge={challengeData}
          />
        </>
      ) : null}
    </SafeAreaView>
  );
};

export default CompanyChallengeDetailScreen;
