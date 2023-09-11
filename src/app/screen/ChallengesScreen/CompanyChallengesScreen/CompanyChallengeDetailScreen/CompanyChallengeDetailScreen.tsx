import React, { FC, useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView, TouchableOpacity, View } from "react-native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";

import httpInstance from "../../../../utils/http";
import {
  deleteChallenge,
  completeChallenge,
} from "../../../../service/challenge";

import { RootStackParamList } from "../../../../navigation/navigation.type";
import { IChallenge } from "../../../../types/challenge";

import PopUpMenu from "../../../../component/common/PopUpMenu";
import Button from "../../../../component/common/Buttons/Button";
import EditChallengeModal from "../../../../component/modal/EditChallengeModal";
import ConfirmDialog from "../../../../component/common/Dialog/ConfirmDialog";

import ShareIcon from "./assets/share.svg";
import TaskAltIcon from "./assets/task-alt.svg";
import TaskAltIconGray from "./assets/task-alt-gray.svg";
import ChallengeCompanyDetailScreen from "../ChallengeDetailScreen/ChallengeCompanyDetailScreen";
import { useUserProfileStore } from "../../../../store/user-store";
import GlobalToastController from "../../../../component/common/Toast/GlobalToastController";
import { useTranslation } from "react-i18next";
import { onShareChallengeLink } from "../../../../utils/shareLink.uitl";

type CompanyChallengeDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CompanyChallengeDetailScreen"
>;

interface IRightCompanyChallengeDetailOptionsProps {
  challengeData: IChallenge | undefined;
  onEditChallengeBtnPress: () => void;
  shouldRefresh: boolean;
  setShouldRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteChallengeDialogVisible: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export const RightCompanyChallengeDetailOptions: FC<
  IRightCompanyChallengeDetailOptionsProps
> = ({
  challengeData,
  shouldRefresh,
  setShouldRefresh,
  onEditChallengeBtnPress,
  setIsDeleteChallengeDialogVisible,
}) => {
  const { t } = useTranslation();
  const [
    isCompletedChallengeDialogVisible,
    setIsCompletedChallengeDialogVisible,
  ] = useState<boolean>(false);
  const [isCompletedChallengeSuccess, setIsCompletedChallengeSuccess] =
    useState<boolean | null>(null);
  const [
    isChallengeAlreadyCompletedDialogVisible,
    setIsChallengeAlreadyCompletedDialogVisible,
  ] = useState<boolean>(false);

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

  const onCheckChallengeCompleted = () => {
    if (!challengeData) return;
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
          setIsCompletedChallengeDialogVisible(false);
          setShouldRefresh(true);
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

  return (
    <View>
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
      {isCompletedChallengeSuccess !== null && (
        <ConfirmDialog
          isVisible={isCompletedChallengeSuccess !== null}
          title={
            isCompletedChallengeSuccess
              ? t("dialog.congratulation") || "Congratulation!"
              : t("dialog.error_general_message") || "Something went wrong"
          }
          description={
            isCompletedChallengeSuccess
              ? t("dialog.completed_challenge_success") ||
                "Challenge has been completed successfully."
              : t("dialog.error_general_message") || "Please try again later."
          }
          confirmButtonLabel={t("dialog.got_it") || "Got it"}
          onConfirm={onCloseSuccessDialog}
        />
      )}
      <View className="-mt-1 flex flex-row items-center">
        {(!!currentUserInParticipant ||
          challengeOwner?.id === currentUser?.id) && (
          <TouchableOpacity
            onPress={onCheckChallengeCompleted}
            disabled={isChallengeCompleted}
          >
            {isChallengeCompleted ? <TaskAltIconGray /> : <TaskAltIcon />}
          </TouchableOpacity>
        )}
        <View className="pl-4 pr-2">
          <Button Icon={<ShareIcon />} onPress={onShare} />
        </View>

        {isCurrentUserOwner && (
          <PopUpMenu
            iconColor="#FF7B1D"
            isDisabled={isChallengeCompleted}
            options={[
              {
                text: "Edit",
                onPress: onEditChallengeBtnPress,
              },
              {
                text: "Delete",
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

  const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  const [isDeleteChallengeDialogVisible, setIsDeleteChallengeDialogVisible] =
    useState<boolean>(false);
  const [isDeleteSuccess, setIsDeleteSuccess] = useState<boolean>(false);
  const [isDeleteError, setIsDeleteError] = useState<boolean>(false);
  const [isNewProgressAdded, setIsNewProgressAdded] = useState<boolean>(false);

  const challengeId = route?.params?.challengeId;

  useLayoutEffect(() => {
    // Set header options, must set it manually to handle the onPress event inside the screen
    navigation.setOptions({
      headerRight: () => (
        <RightCompanyChallengeDetailOptions
          shouldRefresh={shouldRefresh}
          challengeData={challengeData}
          setShouldRefresh={setShouldRefresh}
          onEditChallengeBtnPress={handleEditChallengeBtnPress}
          setIsDeleteChallengeDialogVisible={setIsDeleteChallengeDialogVisible}
        />
      ),
    });
  }, [challengeData]);

  useEffect(() => {
    if (!challengeId && !shouldRefresh) return;
    if (isFirstLoad) setIsFirstLoad(false);
    httpInstance.get(`/challenge/one/${challengeId}`).then((res) => {
      setChallengeData(res.data);
    });
  }, [isNewProgressAdded, shouldRefresh]);

  const handleEditChallengeBtnPress = () => {
    setIsEditChallengeModalVisible(true);
  };
  const handleEditChallengeModalClose = () => {
    setIsEditChallengeModalVisible(false);
  };

  const handleEditChallengeModalConfirm = () => {
    setShouldRefresh(true);
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
  return (
    <SafeAreaView className="bg-white pt-3">
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
      {challengeData && (
        <>
          <ChallengeCompanyDetailScreen
            challengeData={challengeData}
            shouldRefresh={shouldRefresh}
            setShouldRefresh={setShouldRefresh}
            setIsNewProgressAdded={setIsNewProgressAdded}
          />
          <EditChallengeModal
            visible={isEditChallengeModalVisible}
            onClose={handleEditChallengeModalClose}
            onConfirm={handleEditChallengeModalConfirm}
            challenge={challengeData}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default CompanyChallengeDetailScreen;
