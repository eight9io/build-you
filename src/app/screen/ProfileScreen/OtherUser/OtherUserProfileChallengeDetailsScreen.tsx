import { NavigationProp, Route, useNavigation } from "@react-navigation/native";
import React, { FC, useLayoutEffect, useEffect, useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import jwt_decode from "jwt-decode";

import { IChallenge } from "../../../types/challenge";
import { RootStackParamList } from "../../../navigation/navigation.type";
import { useUserProfileStore } from "../../../store/user-store";

import {
  deleteChallenge,
  getChallengeById,
  getChallengeParticipantsByChallengeId,
  serviceAddChallengeParticipant,
  serviceRemoveChallengeParticipant,
} from "../../../service/challenge";

import Button from "../../../component/common/Buttons/Button";
import { TabView } from "../../../component/common/Tab/TabView";
import GlobalDialogController from "../../../component/common/Dialog/GlobalDialogController";
import ProgressTab from "../../ChallengesScreen/PersonalChallengesScreen/ChallengeDetailScreen/ProgressTab";
import DescriptionTab from "../../ChallengesScreen/PersonalChallengesScreen/ChallengeDetailScreen/DescriptionTab";
import ParticipantsTab from "../../ChallengesScreen/CompanyChallengesScreen/ChallengeDetailScreen/ParticipantsTab";
import { RightPersonalChallengeDetailOptions } from "../../ChallengesScreen/PersonalChallengesScreen/PersonalChallengeDetailScreen/PersonalChallengeDetailScreen";

import ShareIcon from "../../../../../assets/svg/share.svg";
import GlobalToastController from "../../../component/common/Toast/GlobalToastController";
import { useTranslation } from "react-i18next";
import CheckCircle from "../../../../../assets/svg/check_circle.svg";
import ConfirmDialog from "../../../component/common/Dialog/ConfirmDialog";
import EditChallengeModal from "../../../component/modal/EditChallengeModal";
import { getChallengeStatusColor } from "../../../utils/common";
import { AxiosError } from "axios";
import debounce from "lodash.debounce";
import { onShareChallengeLink } from "../../../utils/shareLink.uitl";
import { useAuthStore } from "../../../store/auth-store";
import { IToken } from "../../../types/auth";
import Spinner from "react-native-loading-spinner-overlay";

interface IOtherUserProfileChallengeDetailsScreenProps {
  route: Route<
    "OtherUserProfileChallengeDetailsScreen",
    {
      challengeId: string;
      isCompanyAccount?: boolean | undefined;
    }
  >;
}

type ModalState = {
  challengeData: IChallenge;
  challengeOwner: any;
  isChallengePrivate: boolean;
  isJoined?: boolean;
  isCurrentUserOwnerOfChallenge: boolean;
  participantList?: any;
};

const OtherUserProfileChallengeDetailsScreen: FC<
  IOtherUserProfileChallengeDetailsScreenProps
> = ({ route }) => {
  const { challengeId, isCompanyAccount: isCompany } = route.params;

  const [index, setIndex] = useState<number>(0);
  // const [challengeData, setChallengeData] = useState<IChallenge>(
  //   {} as IChallenge
  // );
  const [isError, setIsError] = useState<boolean>(false);
  const [shouldRefresh, setShouldRefresh] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditChallengeModalVisible, setIsEditChallengeModalVisible] =
    useState<boolean>(false);
  const [isDeleteChallengeDialogVisible, setIsDeleteChallengeDialogVisible] =
    useState<boolean>(false);
  const [isDeleteSuccess, setIsDeleteSuccess] = useState<boolean>(false);
  const [isDeleteError, setIsDeleteError] = useState<boolean>(false);

  const [challengeState, setChallengeState] = useState<ModalState>({
    challengeData: {} as IChallenge,
    challengeOwner: false,
    isChallengePrivate: false,
    isJoined: false,
    isCurrentUserOwnerOfChallenge: false,
    participantList: [],
  });

  const updateModalState = (
    newState: Partial<ModalState>,
    key: keyof ModalState
  ) => {
    setChallengeState((prevState) => ({
      ...prevState,
      [key]: newState[key],
    }));
  };

  const { getAccessToken } = useAuthStore();

  const { t } = useTranslation();

  const CHALLENGE_TABS_TITLE_TRANSLATION = [
    t("challenge_detail_screen.progress"),
    t("challenge_detail_screen.description"),
  ];

  const CHALLENGE_TABS_TITLE_TRANSLATION_COMPANY = [
    t("challenge_detail_screen.progress"),
    t("challenge_detail_screen.description"),
    t("challenge_detail_screen.participants"),
  ];

  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();

  const getLocalId = async () => {
    // use this as deep linking require userId on initial load
    const accessToken = getAccessToken();
    const userId = jwt_decode<IToken>(accessToken);
    return userId;
  };

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const isCurrentUserParticipant =
    challengeState?.challengeData?.participants?.find(
      (participant) => participant.id === currentUser?.id
    );

  const isCurrentUserInCompany =
    currentUser?.employeeOf?.id === challengeState.challengeOwner?.id;

  const isCompanyAccount =
    isCompany || challengeState.challengeOwner?.companyAccount;

  const challengeStatus =
    challengeState.challengeOwner?.id === currentUser?.id
      ? challengeState.challengeData?.status
      : isCurrentUserParticipant
      ? isCurrentUserParticipant?.challengeStatus
      : challengeState.challengeData.status;

  const isChallengeCompleted = challengeState.challengeOwner?.id
    ? challengeStatus === "done" || challengeStatus === "closed"
    : null;

  const statusColor = getChallengeStatusColor(
    challengeStatus,
    challengeState.challengeData?.status
  );
  console.log("render");

  const getChallengeData = async () => {
    try {
      const response = await getChallengeById(challengeId);
      const localId = await getLocalId();

      const owner = Array.isArray(response.data?.owner)
        ? response.data?.owner[0]
        : response.data?.owner;

      let stateToUpdate: ModalState = {
        challengeData: response.data,
        challengeOwner: owner,
        isChallengePrivate: response.data?.public == false,
        isCurrentUserOwnerOfChallenge:
          owner?.id === currentUser?.id || owner?.id === localId,
        isJoined: null,
        participantList: [],
      };

      if (isCompanyAccount || owner?.companyAccount) {
        const getChallengeParticipants = async () => {
          try {
            const response = await getChallengeParticipantsByChallengeId(
              challengeId
            );
            stateToUpdate = {
              ...stateToUpdate,
              participantList: response.data,
            };

            if (owner?.id === currentUser?.id) {
              stateToUpdate = {
                ...stateToUpdate,
                isJoined: true,
              };
              return;
            }
            if (
              response.data.find((participant: any) => {
                if (currentUser?.id) {
                  return participant.id === currentUser?.id;
                } else {
                  return participant.id === localId;
                }
              })
            ) {
              stateToUpdate = {
                ...stateToUpdate,
                isJoined: true,
              };
            } else {
              stateToUpdate = {
                ...stateToUpdate,
                isJoined: false,
              };
            }
          } catch (err) {
            GlobalDialogController.showModal({
              title: t("dialog.err_title"),
              message:
                (t("error_general_message") as string) ||
                "Something went wrong",
            });
          }
        };
        await getChallengeParticipants();
      }
      setChallengeState(stateToUpdate);
    } catch (err) {
      setIsError(true);
    }
  };

  useEffect(() => {
    if (!challengeId || !shouldRefresh) return;
    getChallengeData();
    setShouldRefresh(false);
  }, [shouldRefresh, challengeId]);

  useLayoutEffect(() => {
    if (
      challengeState.isJoined ||
      challengeState.isCurrentUserOwnerOfChallenge
    ) {
      navigation.setOptions({
        headerRight: () => (
          <RightPersonalChallengeDetailOptions
            challengeData={challengeState.challengeData}
            shouldRenderEditAndDeleteBtns={
              challengeState.isCurrentUserOwnerOfChallenge
            }
            refresh={getChallengeData}
            onEditChallengeBtnPress={handleEditChallengeBtnPress}
            setIsDeleteChallengeDialogVisible={
              setIsDeleteChallengeDialogVisible
            }
          />
        ),
      });
    } else {
      navigation.setOptions({
        headerRight: () => {
          return (
            <View>
              <Button
                Icon={<ShareIcon />}
                onPress={() =>
                  onShareChallengeLink(challengeState.challengeData?.id)
                }
              />
            </View>
          );
        },
      });
    }
  }, [challengeState.isJoined, challengeState.isCurrentUserOwnerOfChallenge]);

  const handleJoinChallenge = async () => {
    if (!currentUser?.id || !challengeId) return;

    try {
      await serviceAddChallengeParticipant(challengeId);
      GlobalToastController.showModal({
        message: t("toast.joined_success") || "You have joined the challenge!",
      });
      // setIsJoined(true);
      updateModalState({ isJoined: true }, "isJoined");
      getChallengeData();
    } catch (error: AxiosError | any) {
      if (error?.response.status == 400) {
        GlobalToastController.showModal({
          message:
            t("dialog.err_max_join") ||
            "Sorry! You can not join this challenge, it has reached the maximum number of participants.",
        });
        return;
      }
      GlobalToastController.showModal({
        message:
          (t("error_general_message") as string) || "Something went wrong",
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
      // setIsJoined(false);
      updateModalState({ isJoined: false }, "isJoined");

      getChallengeData();
    } catch (err) {
      GlobalToastController.showModal({
        message:
          (t("error_general_message") as string) || "Something went wrong",
      });
    }
  };

  const handleJoinLeaveChallenge = debounce(async () => {
    setIsLoading(true);
    if (challengeState.isJoined) {
      await handleLeaveChallenge();
    } else {
      await handleJoinChallenge();
    }
    setIsLoading(false);
  }, 500);

  const handleEditChallengeBtnPress = () => {
    setIsEditChallengeModalVisible(true);
  };

  const shouldRenderJoinButton =
    (currentUser?.id !== challengeState.challengeOwner?.id &&
      isCompanyAccount &&
      (challengeState.challengeData?.public ||
        challengeState.isJoined != null ||
        (challengeState.challengeOwner &&
          currentUser &&
          challengeState.challengeOwner.id !== currentUser.id &&
          challengeState.isJoined != null))) ||
    (!isCompanyAccount && isCurrentUserParticipant);

  const handleDeleteChallenge = () => {
    if (!challengeState.challengeData) return;
    deleteChallenge(challengeState.challengeData.id)
      .then((res) => {
        if (res.status === 200) {
          setIsDeleteChallengeDialogVisible(false);
          setTimeout(() => {
            setIsDeleteSuccess(true);
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

  const handleEditChallengeModalClose = () => {
    setIsEditChallengeModalVisible(false);
  };

  const handleEditChallengeModalConfirm = () => {
    setShouldRefresh(true);
    setIsEditChallengeModalVisible(false);
  };

  if (
    isError ||
    (challengeState.isChallengePrivate &&
      !challengeState.isCurrentUserOwnerOfChallenge &&
      !isCurrentUserInCompany &&
      !isCurrentUserParticipant)
  ) {
    return (
      <SafeAreaView>
        <View className="flex h-full items-center justify-start px-10 pt-56">
          <Text className="text-base font-medium text-black-default">
            {t("challenge_detail_screen.not_found") ||
              "Challenge is not found!"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      {isLoading && <Spinner visible={isLoading} />}
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
          navigation.goBack();
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

      <View className="flex h-full flex-col bg-white pt-4">
        <View className="flex flex-row items-center justify-between px-4 pb-3">
          <View className="flex-1 flex-row items-center gap-2 pb-2 pt-2">
            <CheckCircle fill={statusColor} />
            <View className="flex-1">
              <Text className="text-2xl font-semibold">
                {challengeState.challengeData?.goal}
              </Text>
            </View>
          </View>
          {isChallengeCompleted != null &&
            !isChallengeCompleted &&
            shouldRenderJoinButton && (
              <View className="ml-2 h-9">
                <Button
                  isDisabled={false}
                  containerClassName={
                    challengeState.isJoined
                      ? "border border-gray-dark flex items-center justify-center px-5"
                      : "bg-primary-default flex items-center justify-center px-5"
                  }
                  textClassName={`text-center text-md font-semibold ${
                    challengeState.isJoined ? "text-gray-dark" : "text-white"
                  } `}
                  title={
                    challengeState.isJoined
                      ? t("challenge_detail_screen.leave")
                      : t("challenge_detail_screen.join")
                  }
                  onPress={handleJoinLeaveChallenge}
                />
              </View>
            )}
          {isChallengeCompleted != null &&
            isChallengeCompleted &&
            shouldRenderJoinButton && (
              <View className="ml-2 h-9">
                <Button
                  containerClassName="border border-gray-dark flex items-center justify-center px-5"
                  textClassName={`text-center text-md font-semibold text-gray-dark `}
                  title={t("challenge_detail_screen.completed")}
                />
              </View>
            )}
        </View>
        {challengeState.challengeData?.id && (
          <EditChallengeModal
            visible={isEditChallengeModalVisible}
            onClose={handleEditChallengeModalClose}
            onConfirm={handleEditChallengeModalConfirm}
            challenge={challengeState.challengeData}
          />
        )}

        <TabView
          titles={
            isCompanyAccount || challengeState.challengeOwner?.companyAccount
              ? CHALLENGE_TABS_TITLE_TRANSLATION_COMPANY
              : CHALLENGE_TABS_TITLE_TRANSLATION
          }
          activeTabIndex={index}
          setActiveTabIndex={setIndex}
        >
          <ProgressTab
            isJoined={challengeState.isJoined}
            isOtherUserProfile
            challengeData={challengeState.challengeData}
            isChallengeCompleted={isChallengeCompleted}
          />
          <DescriptionTab
            challengeData={challengeState.challengeData}
            maxPepleCanJoin={challengeState.challengeData?.maximumPeople}
          />
          {(isCompanyAccount ||
            challengeState.challengeOwner?.companyAccount) && (
            <ParticipantsTab participant={challengeState.participantList} />
          )}
        </TabView>
      </View>
    </SafeAreaView>
  );
};

export default OtherUserProfileChallengeDetailsScreen;
