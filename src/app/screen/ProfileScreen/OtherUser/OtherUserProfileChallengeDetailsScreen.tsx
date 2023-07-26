import {
  CommonActions,
  NavigationProp,
  Route,
  useNavigation,
} from "@react-navigation/native";
import React, { FC, useLayoutEffect, useEffect, useState } from "react";
import { View, Text, SafeAreaView } from "react-native";

import i18n from "../../../i18n/i18n";
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
import { debounce } from "../../../hooks/useDebounce";
import { onShareChallengeLink } from "../../../utils/shareLink.uitl";

interface IOtherUserProfileChallengeDetailsScreenProps {
  route: Route<
    "OtherUserProfileChallengeDetailsScreen",
    {
      challengeId: string;
      isCompanyAccount?: boolean | undefined;
    }
  >;
}

const CHALLENGE_TABS_TITLE_TRANSLATION = [
  i18n.t("challenge_detail_screen.progress"),
  i18n.t("challenge_detail_screen.description"),
];

const CHALLENGE_TABS_TITLE_TRANSLATION_COMPANY = [
  i18n.t("challenge_detail_screen.progress"),
  i18n.t("challenge_detail_screen.description"),
  i18n.t("challenge_detail_screen.participants"),
];

const OtherUserProfileChallengeDetailsScreen: FC<
  IOtherUserProfileChallengeDetailsScreenProps
> = ({ route }) => {
  const { challengeId, isCompanyAccount: isCompany } = route.params;

  const [index, setIndex] = useState<number>(0);
  const [challengeData, setChallengeData] = useState<IChallenge>(
    {} as IChallenge
  );
  const [isError, setIsError] = useState<boolean>(false);
  const [challengeOwner, setChallengeOwner] = useState<any>(null);
  // const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);
  const [participantList, setParticipantList] = useState<any>([]);
  const [isEditChallengeModalVisible, setIsEditChallengeModalVisible] =
    useState<boolean>(false);

  const [isDeleteChallengeDialogVisible, setIsDeleteChallengeDialogVisible] =
    useState<boolean>(false);
  const [isJoined, setIsJoined] = useState<boolean | null>(null);
  const [isDeleteSuccess, setIsDeleteSuccess] = useState<boolean>(false);
  const [isDeleteError, setIsDeleteError] = useState<boolean>(false);

  const [isCurrentUserOwnerOfChallenge, setIsCurrentUserOwnerOfChallenge] =
    useState<boolean | null>(null);

  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  const isCurrentUserParticipant = challengeData?.participants?.find(
    (participant) => participant.id === currentUser?.id
  );

  const isCompanyAccount = isCompany || challengeOwner?.companyAccount;

  const challengeStatus =
    challengeOwner?.id === currentUser?.id
      ? challengeData?.status
      : isCurrentUserParticipant
      ? isCurrentUserParticipant?.challengeStatus
      : challengeData.status;

  const isChallengeCompleted = challengeOwner?.id
    ? challengeStatus === "done" || challengeStatus === "closed"
    : null;

  const statusColor = getChallengeStatusColor(
    challengeStatus,
    challengeData?.status
  );

  const getChallengeData = async () => {
    try {
      const response = await getChallengeById(challengeId);
      setChallengeData(response.data);

      const owner = Array.isArray(response.data?.owner)
        ? response.data?.owner[0]
        : response.data?.owner;
      setChallengeOwner(owner);
      setIsCurrentUserOwnerOfChallenge(owner?.id === currentUser?.id);
      if (isCompanyAccount || owner?.companyAccount) {
        const getChallengeParticipants = async () => {
          try {
            const response = await getChallengeParticipantsByChallengeId(
              challengeId
            );
            setParticipantList(response.data);
            if (owner?.id === currentUser?.id) {
              setIsJoined(true);
              return;
            }
            if (
              response.data.find(
                (participant: any) => participant.id === currentUser?.id
              )
            ) {
              setIsJoined(true);
            } else {
              setIsJoined(false);
            }
          } catch (err) {
            GlobalDialogController.showModal({
              title: "Error",
              message: "Something went wrong. Please try again later!",
            });
          }
        };
        getChallengeParticipants();
      }
    } catch (err) {
      setIsError(true);
      GlobalDialogController.showModal({
        title: "Error",
        message: "Something went wrong. Please try again later!",
      });
    }
  };

  useEffect(() => {
    if (!challengeId) return;

    getChallengeData();
  }, []);

  useLayoutEffect(() => {
    if (isJoined || isCurrentUserOwnerOfChallenge) {
      navigation.setOptions({
        headerRight: () => (
          <RightPersonalChallengeDetailOptions
            challengeData={challengeData}
            shouldRenderEditAndDeleteBtns={isCurrentUserOwnerOfChallenge}
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
                onPress={() => onShareChallengeLink(challengeData?.id)}
              />
            </View>
          );
        },
      });
    }
  }, [isJoined]);

  const handleJoinChallenge = async () => {
    if (!currentUser?.id || !challengeId) return;

    try {
      await serviceAddChallengeParticipant(challengeId);
      GlobalToastController.showModal({
        message: t("toast.joined_success") || "You have joined the challenge!",
      });
      setIsJoined(true);
      // setShouldRefresh(true);
      getChallengeData();
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
      getChallengeData();
    } catch (err) {
      GlobalDialogController.showModal({
        title: "Error",
        message: "Something went wrong. Please try again later!",
      });
    }
  };

  const handleJoinLeaveChallenge = debounce(async () => {
    if (isJoined) {
      await handleLeaveChallenge();
    } else {
      await handleJoinChallenge();
    }
  }, 500);

  const handleEditChallengeBtnPress = () => {
    setIsEditChallengeModalVisible(true);
  };

  const shouldRenderJoinButton =
    (currentUser?.id !== challengeOwner?.id &&
      isCompanyAccount &&
      (challengeData?.public ||
        isJoined != null ||
        (challengeOwner &&
          currentUser &&
          challengeOwner.id !== currentUser.id &&
          isJoined != null))) ||
    (!isCompanyAccount && isCurrentUserParticipant);

  const handleDeleteChallenge = () => {
    if (!challengeData) return;
    deleteChallenge(challengeData.id)
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
    setIsEditChallengeModalVisible(false);
  };

  if (isError) {
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
      <ConfirmDialog
        isVisible={isDeleteChallengeDialogVisible}
        title="Delete Challenge"
        description="Are you sure you want to delete this challenge?"
        confirmButtonLabel="Delete"
        closeButtonLabel="Cancel"
        onConfirm={handleDeleteChallenge}
        onClosed={() => setIsDeleteChallengeDialogVisible(false)}
      />
      <ConfirmDialog
        isVisible={isDeleteSuccess}
        title="Challenge Deleted"
        description="Challenge has been deleted successfully."
        confirmButtonLabel="Got it"
        onConfirm={() => {
          setIsDeleteSuccess(false);
          navigation.goBack();
        }}
      />
      <ConfirmDialog
        isVisible={isDeleteError}
        title="Something went wrong"
        description="Please try again later."
        confirmButtonLabel="Close"
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
                {challengeData?.goal}
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
                    isJoined
                      ? "border border-gray-dark flex items-center justify-center px-5"
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
          {isChallengeCompleted != null &&
            isChallengeCompleted &&
            shouldRenderJoinButton && (
              <View className="ml-2 h-9">
                <Button
                  containerClassName="border border-gray-dark flex items-center justify-center px-5"
                  textClassName={`text-center text-md font-semibold text-gray-dark `}
                  title={i18n.t("challenge_detail_screen.completed")}
                />
              </View>
            )}
        </View>
        {challengeData?.id && (
          <EditChallengeModal
            visible={isEditChallengeModalVisible}
            onClose={handleEditChallengeModalClose}
            onConfirm={handleEditChallengeModalConfirm}
            challenge={challengeData}
          />
        )}

        <TabView
          titles={
            isCompanyAccount || challengeOwner?.companyAccount
              ? CHALLENGE_TABS_TITLE_TRANSLATION_COMPANY
              : CHALLENGE_TABS_TITLE_TRANSLATION
          }
          activeTabIndex={index}
          setActiveTabIndex={setIndex}
        >
          <ProgressTab
            isJoined={isJoined}
            isOtherUserProfile
            challengeData={challengeData}
            refresh={getChallengeData}
            isChallengeCompleted={isChallengeCompleted}
          />
          <DescriptionTab challengeData={challengeData} />
          {(isCompanyAccount || challengeOwner?.companyAccount) && (
            <ParticipantsTab participant={participantList} />
          )}
        </TabView>
      </View>
    </SafeAreaView>
  );
};

export default OtherUserProfileChallengeDetailsScreen;
