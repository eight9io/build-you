import clsx from "clsx";
import React, { FC, useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView, TouchableOpacity, View, Text } from "react-native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import {
  deleteChallenge,
  completeChallenge,
  getChallengeById,
} from "../../../../service/challenge";

import { RootStackParamList } from "../../../../navigation/navigation.type";
import { IChallenge } from "../../../../types/challenge";

import ChallengeDetailScreen from "../ChallengeDetailScreen/ChallengeDetailScreen";

import PopUpMenu from "../../../../component/common/PopUpMenu";
import Button from "../../../../component/common/Buttons/Button";
import EditChallengeModal from "../../../../component/modal/EditChallengeModal";
import ConfirmDialog from "../../../../component/common/Dialog/ConfirmDialog/ConfirmDialog";

import ShareIcon from "./assets/share.svg";
import TaskAltIcon from "./assets/task-alt.svg";
import { useUserProfileStore } from "../../../../store/user-store";
import GlobalToastController from "../../../../component/common/Toast/GlobalToastController";
import { onShareChallengeLink } from "../../../../utils/shareLink.util";
import { useNewCreateOrDeleteChallengeStore } from "../../../../store/new-challenge-create-store";
import CustomActivityIndicator from "../../../../component/common/CustomActivityIndicator";
import GlobalDialogController from "../../../../component/common/Dialog/GlobalDialog/GlobalDialogController";

type PersonalChallengeDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PersonalChallengeDetailScreen"
>;

interface IRightPersonalChallengeDetailOptionsProps {
  challengeData: IChallenge | undefined;
  onEditChallengeBtnPress?: () => void;
  challengeStatus?: string;
  shouldRenderEditAndDeleteBtns?: boolean | null;
  setIsDeleteChallengeDialogVisible?: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export const RightPersonalChallengeDetailOptions: FC<
  IRightPersonalChallengeDetailOptionsProps
> = ({
  challengeData,
  challengeStatus,
  onEditChallengeBtnPress,
  shouldRenderEditAndDeleteBtns = true,
  setIsDeleteChallengeDialogVisible,
}) => {
  const { t } = useTranslation();
  const [isCompletedChallengeSuccess, setIsCompletedChallengeSuccess] =
    useState<boolean | null>(null);
  const [isChallengeCompleted, setIsChallengeCompleted] = useState<
    boolean | null
  >(null);

  const onShare = () => {
    onShareChallengeLink(challengeData?.id);
  };

  const onCloseSuccessDialog = () => {
    setIsCompletedChallengeSuccess(null);
  };

  useEffect(() => {
    if (!challengeData) return;
    setIsChallengeCompleted(
      challengeStatus === "done" || challengeStatus === "closed"
    );
  }, [challengeData]);

  return (
    <View>
      {isCompletedChallengeSuccess !== null && (
        <ConfirmDialog
          isVisible={isCompletedChallengeSuccess !== null}
          title={
            isCompletedChallengeSuccess
              ? t("dialog.congratulation") || "Congratulation!"
              : t("error")
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
      <View className="-mt-1 flex flex-row items-center">
        <View className="pl-4 pr-2">
          <Button Icon={<ShareIcon />} onPress={onShare} />
        </View>

        {shouldRenderEditAndDeleteBtns &&
          !!onEditChallengeBtnPress &&
          !!setIsDeleteChallengeDialogVisible && (
            <PopUpMenu
              iconColor="#FF7B1D"
              isDisabled={!!isChallengeCompleted}
              options={[
                {
                  text: t("pop_up_menu.edit") || "Edit",
                  onPress: onEditChallengeBtnPress,
                },
                {
                  text: t("pop_up_menu.delete") || "Delete",
                  onPress: () => setIsDeleteChallengeDialogVisible(true),
                },
              ]}
            />
          )}
      </View>
    </View>
  );
};

const PersonalChallengeDetailScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: PersonalChallengeDetailScreenNavigationProp;
}) => {
  const { t } = useTranslation();
  const [isScreenLoading, setIsScreenLoading] = useState<boolean>(true);
  const [isEditChallengeModalVisible, setIsEditChallengeModalVisible] =
    useState<boolean>(false);
  const [challengeData, setChallengeData] = useState<IChallenge | undefined>(
    undefined
  );
  const [isChallengeCompleted, setIsChallengeCompleted] = useState<
    boolean | null
  >(null);
  const [isCompletedChallengeSuccess, setIsCompletedChallengeSuccess] =
    useState<boolean | null>(null);

  const [
    isCompletedChallengeDialogVisible,
    setIsCompletedChallengeDialogVisible,
  ] = useState<boolean>(false);
  const [
    isChallengeAlreadyCompletedDialogVisible,
    setIsChallengeAlreadyCompletedDialogVisible,
  ] = useState<boolean>(false);
  const [isDeleteChallengeDialogVisible, setIsDeleteChallengeDialogVisible] =
    useState<boolean>(false);
  const [isDeleteError, setIsDeleteError] = useState<boolean>(false);
  const [isJoinedLocal, setIsJoinedLocal] = useState<boolean>(true);

  // use for refresh screen when add new progress, refetch participant list,  edit challenge
  const [shouldScreenRefresh, setShouldScreenRefresh] =
    useState<boolean>(false);

  const challengeId = route?.params?.challengeId;

  const { getUserProfile } = useUserProfileStore();
  const { setDeletedChallengeId } = useNewCreateOrDeleteChallengeStore();

  const currentUser = getUserProfile();

  const challengeOwner = Array.isArray(challengeData?.owner)
    ? challengeData?.owner[0]
    : challengeData?.owner;

  const isCurrentUserChallengeOnwer = challengeOwner?.id === currentUser?.id;

  const onCheckChallengeCompleted = () => {
    if (!challengeData) return;
    if (challengeData.type == "certified") {
      // certified challenge required coach before complete
      if (challengeData.coach) {
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

  const isCurrentUserParticipant = challengeData?.participants?.find(
    (participant) => participant.id === currentUser?.id
  );

  const challengeStatus =
    challengeOwner?.id === currentUser?.id
      ? challengeData?.status
      : isCurrentUserParticipant?.challengeStatus;

  useLayoutEffect(() => {
    // Set header options, must set it manually to handle the onPress event inside the screen
    navigation.setOptions({
      headerRight: () => (
        <RightPersonalChallengeDetailOptions
          challengeData={challengeData}
          challengeStatus={challengeStatus}
          shouldRenderEditAndDeleteBtns={isCurrentUserChallengeOnwer}
          onEditChallengeBtnPress={handleEditChallengeBtnPress}
          setIsDeleteChallengeDialogVisible={setIsDeleteChallengeDialogVisible}
        />
      ),
    });
  }, [challengeData, isJoinedLocal]);

  const getChallengeData = async () => {
    setIsScreenLoading(true);
    try {
      await getChallengeById(challengeId).then((res) => {
        setChallengeData(res.data);
      });
    } catch (error) {
      console.error("CoachChallengeDetailScreen - Error fetching data:", error);
    }
    setTimeout(() => {
      setIsScreenLoading(false);
    }, 500);
  };

  useEffect(() => {
    if (shouldScreenRefresh) {
      getChallengeData();
      setShouldScreenRefresh(false);
    }
  }, [shouldScreenRefresh]);

  useEffect(() => {
    getChallengeData();
  }, []);

  useEffect(() => {
    if (!challengeData) return;
    setIsChallengeCompleted(
      challengeStatus === "done" || challengeStatus === "closed"
    );
  }, [challengeData]);

  const handleEditChallengeBtnPress = () => {
    setIsEditChallengeModalVisible(true);
  };
  const handleEditChallengeModalClose = () => {
    setIsEditChallengeModalVisible(false);
  };

  const handleEditChallengeModalConfirm = () => {
    getChallengeData();
    setIsEditChallengeModalVisible(false);
  };

  const handleDeleteChallenge = () => {
    if (!challengeData) return;
    deleteChallenge(challengeData.id)
      .then((res) => {
        if (res.status === 200) {
          setDeletedChallengeId(challengeData.id);
          setIsDeleteChallengeDialogVisible(false);
          GlobalToastController.showModal({
            message:
              t("toast.delete_challenge_success") ||
              "Deleted Challenge successfully !",
          });
          setTimeout(() => {
            navigation.navigate("PersonalChallengesScreen");
          }, 600);
        }
      })
      .catch((err) => {
        setIsDeleteChallengeDialogVisible(false);
        setTimeout(() => {
          setIsDeleteError(true);
        }, 600);
      });
  };

  const onCompleteChallenge = () => {
    if (!challengeData) return;
    completeChallenge(challengeData.id)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsChallengeCompleted(true);
          setIsCompletedChallengeDialogVisible(false);
          getChallengeData();
          GlobalToastController.showModal({
            message:
              t("toast.completed_challenge_success") ||
              "Challenge has been completed successfully !",
            isScreenHasBottomNav: false,
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
    <SafeAreaView className="relative flex-1 bg-[#FAFBFF]">
      <CustomActivityIndicator isVisible={isScreenLoading} />

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
        isVisible={isDeleteError}
        title={t("dialog.err_title") || "Error"}
        description={t("error_general_message") || "Something went wrong"}
        confirmButtonLabel={t("dialog.close") || "Close"}
        onConfirm={() => {
          setIsDeleteError(false);
        }}
      />

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
              : t("error")
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

      {isJoinedLocal && (
        <View className="absolute bottom-16 right-4 z-10">
          <TouchableOpacity
            onPress={onCheckChallengeCompleted}
            disabled={!!isChallengeCompleted}
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

      {challengeData?.id && (
        <>
          <ChallengeDetailScreen
            challengeData={challengeData}
            setIsJoinedLocal={setIsJoinedLocal}
            route={route}
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
      )}
    </SafeAreaView>
  );
};

export default PersonalChallengeDetailScreen;
