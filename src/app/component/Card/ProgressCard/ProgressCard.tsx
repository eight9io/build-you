import { View, Text, TouchableOpacity } from "react-native";
import { useState, FC } from "react";
import {
  NavigationProp,
  useNavigation,
  StackActions,
} from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { IUserData } from "../../../types/user";
import { IProgressChallenge } from "../../../types/challenge";
import { RootStackParamList } from "../../../navigation/navigation.type";

import PopUpMenu from "../../common/PopUpMenu";
import ImageSwiper from "../../common/ImageSwiper";
import VideoPlayer from "../../common/VideoPlayer";
import ProgressCardAvatar from "../../common/Avatar/PostAvatar";

import ConfirmDialog from "../../common/Dialog/ConfirmDialog";
import LikeButton from "../../Post/LikeButton";
import CommentButton from "../../Post/CommentButton";

import useModal from "../../../hooks/useModal";
import { deleteProgress } from "../../../service/progress";
import { getTimeDiffToNow } from "../../../utils/time";
import { getSeperateImageUrls } from "../../../utils/image";
import GlobalDialogController from "../../common/Dialog/GlobalDialogController";

import IconDot from "./asset/dot.svg";
import { useUserProfileStore } from "../../../store/user-store";
import GlobalToastController from "../../common/Toast/GlobalToastController";
import debounce from "lodash.debounce";
import { useChallengeUpdateStore } from "../../../store/challenge-update-store";

interface IProgressCardProps {
  challengeOwner: {
    avatar: string;
    id: string;
    name: string;
    surname: string;
    companyAccount?: boolean;
  };
  challengeName: string;
  challengeId: string;
  isJoined?: boolean | null;
  userData: IUserData | null;
  isOtherUserProfile?: boolean;
  setProgressIndexToUpdate?: any;
  isChallengeCompleted?: boolean;
  itemProgressCard: IProgressChallenge;
  refetch: () => void;
  setIsShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProgressCard: FC<IProgressCardProps> = ({
  userData,
  isJoined = false,
  challengeId,
  challengeName,
  challengeOwner,
  refetch,
  itemProgressCard,
  setIsShowEditModal,
  setProgressIndexToUpdate,
  isChallengeCompleted = false,
}) => {
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const timeDiff = getTimeDiffToNow(itemProgressCard.createdAt);
  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();
  const currentUserId = currentUser?.id;

  const { getChallengeUpdateLike, getChallengeUpdateComment } =
    useChallengeUpdateStore();
  const challengeUpdateComment = getChallengeUpdateComment();
  const challengeUpdateLike = getChallengeUpdateLike();

  const isChallengeOwnerCompanyAccount = challengeOwner?.companyAccount;

  const {
    isVisible: isAckModalVisible,
    openModal: openAckModal,
    closeModal: closeAckModal,
  } = useModal();

  const progressOptions = [
    {
      text: "Edit",
      onPress: () => {
        setIsShowEditModal(true), setProgressIndexToUpdate();
      },
    },
    {
      text: "Delete",
      onPress: () => setIsShowDeleteModal(true),
    },
  ];

  const handleNavigationToComment = () => {
    if (!itemProgressCard?.id || !challengeOwner?.id) {
      GlobalDialogController.showModal({
        title: t("dialog.err_title"),
        message: t("errorMessage:500") as string,
      });
      return;
    }

    const pushAction = StackActions.push("ProgressCommentScreen", {
      progressId: itemProgressCard.id,
      ownerId: userData && userData.id,
      challengeName: challengeName || "",
      challengeId: challengeId,
    });

    navigation.dispatch(pushAction);
  };

  const extractedImageUrls = getSeperateImageUrls(itemProgressCard?.image);

  const handleConfirmDeleteChallengeProgress = async () => {
    setIsShowDeleteModal(false); // Close the delete confirm modal
    setErrorMessage("");
    try {
      const res = await deleteProgress(itemProgressCard.id);
      if (res.status === 200) {
        // openAckModal();

        GlobalToastController.showModal({
          message: t("delete_progress.delete_success") as string,
        });
        handleCloseAckModal();
        // clo
      } else {
        setErrorMessage(t("errorMessage:500") || "");
      }
    } catch (error) {
      setErrorMessage(t("errorMessage:500") || "");
    }
  };

  const handleDeleteProgressSuccess = () => {
    refetch();
  };

  const handleCloseAckModal = () => {
    closeAckModal();
    handleDeleteProgressSuccess(); // Navigate to the challenge progresses screen => delete it and refresh the list
  };

  const isProgressOwner = userData && userData?.id === currentUserId;

  const navigateToOtherUserProfile = () => {
    if (!userData?.id) return;
    const pushAction = StackActions.push("OtherUserProfileScreen", {
      userId: userData?.id,
    });

    navigation.dispatch(pushAction);
  };

  return (
    <View className="mb-1 bg-gray-50 p-5 ">
      <View className="mb-3 flex flex-row items-center justify-between ">
        <TouchableOpacity
          className="flex flex-1 flex-row"
          onPress={() => debounce(navigateToOtherUserProfile, 400)()}
        >
          <ProgressCardAvatar src={userData?.avatar} />
          <View className="ml-2 flex-1">
            <Text
              className={`text-h6 font-bold ${
                isProgressOwner ? "text-primary-default" : "text-black"
              }`}
            >
              {userData?.name} {userData?.surname}
            </Text>
            <View className="flex flex-row items-center">
              <Text className="text-xs font-light text-gray-dark ">
                {timeDiff}{" "}
              </Text>

              {itemProgressCard?.location && (
                <Text className="text-xs font-light text-gray-dark ">
                  <IconDot fill={"#7D7E80"} /> {itemProgressCard?.location}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
        {((isJoined && isProgressOwner) ||
          (!isChallengeOwnerCompanyAccount && isProgressOwner)) && (
          <PopUpMenu
            options={progressOptions}
            isDisabled={isChallengeCompleted || itemProgressCard?.first}
          />
        )}
      </View>
      {itemProgressCard?.caption && (
        <Text className=" mb-1 text-md font-normal leading-5">
          {itemProgressCard?.caption}
        </Text>
      )}
      {extractedImageUrls && (
        <View className="mt-2 aspect-square w-full rounded-xl">
          <ImageSwiper imageSrc={extractedImageUrls} />
        </View>
      )}
      {itemProgressCard?.video && <VideoPlayer src={itemProgressCard.video} />}

      <View className="mt-3 flex-row">
        <LikeButton
          progressId={itemProgressCard.id}
          currentUserId={currentUser?.id}
          localProgressLikes={challengeUpdateLike}
        />
        <CommentButton
          navigationToComment={handleNavigationToComment}
          progressId={itemProgressCard.id}
          localCommentUpdate={challengeUpdateComment}
        />
      </View>

      <ConfirmDialog
        title={(!errorMessage ? t("success") : t("error")) || ""}
        description={
          (!errorMessage
            ? t("delete_progress.delete_success")
            : t("errorMessage:500")) || ""
        }
        isVisible={isAckModalVisible}
        onClosed={handleCloseAckModal}
        closeButtonLabel={t("close") || ""}
      />
      <ConfirmDialog
        isVisible={isShowDeleteModal}
        onConfirm={handleConfirmDeleteChallengeProgress}
        onClosed={() => setIsShowDeleteModal(false)}
        title={t("dialog.delete_progress.title") as string}
        confirmButtonLabel={t("dialog.delete") || "Delete"}
        closeButtonLabel={t("dialog.cancel") || "Cancel"}
        description={t("dialog.delete_progress.description") as string}
      />
    </View>
  );
};

export default ProgressCard;
