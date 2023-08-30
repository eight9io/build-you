import { NavigationProp, Route, useNavigation } from "@react-navigation/native";
import React, { FC, useLayoutEffect, useEffect, useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

interface IOtherUserProfileChallengeDetailsScreenProps {
  route: Route<
    "OtherUserProfileChallengeDetailsScreen",
    {
      challengeId: string;
      isCompanyAccount?: boolean | undefined;
    }
  >;
}

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
  const [participantList, setParticipantList] = useState<any>([]);
  const [isChallengePrivate, setIsChallengePrivate] = useState<boolean | null>(
    null
  );
  const [isEditChallengeModalVisible, setIsEditChallengeModalVisible] =
    useState<boolean>(false);
  const [isDeleteChallengeDialogVisible, setIsDeleteChallengeDialogVisible] =
    useState<boolean>(false);
  const [isJoined, setIsJoined] = useState<boolean | null>(null);
  const [isDeleteSuccess, setIsDeleteSuccess] = useState<boolean>(false);
  const [isDeleteError, setIsDeleteError] = useState<boolean>(false);

  const [isCurrentUserOwnerOfChallenge, setIsCurrentUserOwnerOfChallenge] =
    useState<boolean | null>(null);
  const [shouldRefesh, setShouldRefresh] = useState<boolean>(true);

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
    const id = await AsyncStorage.getItem("user_id");
    return id;
  };

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const isCurrentUserParticipant = challengeData?.participants?.find(
    (participant) => participant.id === currentUser?.id
  );

  const isCurrentUserInCompany =
    currentUser?.employeeOf?.id === challengeOwner?.id;

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
      const localId = await getLocalId();

      setChallengeData(response.data);
      setIsChallengePrivate(response.data?.public == false);

      const owner = Array.isArray(response.data?.owner)
        ? response.data?.owner[0]
        : response.data?.owner;

      setChallengeOwner(owner);
      setIsCurrentUserOwnerOfChallenge(
        owner?.id === currentUser?.id || owner?.id === localId
      );
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
              response.data.find((participant: any) => {
                if (currentUser?.id) {
                  return participant.id === currentUser?.id;
                } else {
                  return participant.id === localId;
                }
              })
            ) {
              setIsJoined(true);
            } else {
              setIsJoined(false);
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
        getChallengeParticipants();
      }
    } catch (err) {
      setIsError(true);
    }
  };

  useEffect(() => {
    if (!challengeId || !shouldRefesh) return;
    getChallengeData();
    setShouldRefresh(false);
  }, [shouldRefesh, challengeId]);

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
  }, [isJoined, isCurrentUserOwnerOfChallenge]);

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
        GlobalToastController.showModal({
          message: error?.response?.data?.message || t("dialog.err_max_join"),
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
      setIsJoined(false);
      getChallengeData();
    } catch (err) {
      GlobalToastController.showModal({
        message:
          (t("error_general_message") as string) || "Something went wrong",
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
    setShouldRefresh(true);
    setIsEditChallengeModalVisible(false);
  };

  if (
    isError ||
    (isChallengePrivate &&
      !isCurrentUserOwnerOfChallenge &&
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
            isChallengeCompleted={isChallengeCompleted}
          />
          <DescriptionTab
            challengeData={challengeData}
            maxPepleCanJoin={challengeData?.maximumPeople}
          />
          {(isCompanyAccount || challengeOwner?.companyAccount) && (
            <ParticipantsTab participant={participantList} />
          )}
        </TabView>
      </View>
    </SafeAreaView>
  );
};

export default OtherUserProfileChallengeDetailsScreen;
