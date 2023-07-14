import { View, Text, TouchableOpacity } from 'react-native';
import { useState, FC, useEffect } from 'react';
import {
  NavigationProp,
  useNavigation,
  StackActions,
} from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { IUserData } from '../../../types/user';
import { IProgressChallenge } from '../../../types/challenge';
import { RootStackParamList } from '../../../navigation/navigation.type';

import PopUpMenu from '../../common/PopUpMenu';
import ImageSwiper from '../../common/ImageSwiper';
import VideoPlayer from '../../common/VideoPlayer';
import ProgressCardAvatar from '../../common/Avatar/PostAvatar';

import EditChallengeProgressModal from '../../modal/EditChallengeProgressModal';
import ConfirmDialog from '../../common/Dialog/ConfirmDialog';
import LikeButton from '../../Post/LikeButton';
import CommentButton from '../../Post/CommentButton';

import useModal from '../../../hooks/useModal';
import { deleteProgress } from '../../../service/progress';
import { getTimeDiffToNow } from '../../../utils/time';
import { getSeperateImageUrls } from '../../../utils/image';
import GlobalDialogController from '../../common/Dialog/GlobalDialogController';

import IconDot from './asset/dot.svg';
import { useUserProfileStore } from '../../../store/user-data';

interface IProgressCardProps {
  challengeOwner: {
    avatar: string;
    id: string;
    name: string;
    surname: string;
  };
  challengeName: string;
  isJoined?: boolean | null;
  userData: IUserData | null;
  isOtherUserProfile?: boolean;
  setProgressIndexToUpdate?: any;
  isChallengeCompleted?: boolean;
  itemProgressCard: IProgressChallenge;
  setShouldRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProgressCard: FC<IProgressCardProps> = ({
  userData,
  isJoined = false,
  challengeName,
  challengeOwner,
  setShouldRefresh,
  itemProgressCard,
  setIsShowEditModal,
  setProgressIndexToUpdate,
  isOtherUserProfile = false,
  isChallengeCompleted = false,
}) => {
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const timeDiff = getTimeDiffToNow(itemProgressCard.createdAt);
  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();
  const currentUserId = currentUser?.id;

  const {
    isVisible: isAckModalVisible,
    openModal: openAckModal,
    closeModal: closeAckModal,
  } = useModal();

  const progressOptions = [
    {
      text: 'Edit',
      onPress: () => {
        setIsShowEditModal(true), setProgressIndexToUpdate();
      },
    },
    {
      text: 'Delete',
      onPress: () => setIsShowDeleteModal(true),
    },
  ];

  const handleNavigationToComment = () => {
    if (!itemProgressCard?.id || !challengeOwner?.id) {
      GlobalDialogController.showModal({
        title: 'Error',
        message: t('errorMessage:500') as string,
      });
      return;
    }

    const pushAction = StackActions.push('ProgressCommentScreen', {
      progressId: itemProgressCard.id,
      ownerId: userData && userData.id,
      challengeName: challengeName || '',
    });

    navigation.dispatch(pushAction);
  };

  const extractedImageUrls = getSeperateImageUrls(itemProgressCard?.image);

  const handleConfirmDeleteChallengeProgress = async () => {
    setIsShowDeleteModal(false); // Close the delete confirm modal
    setErrorMessage('');
    try {
      const res = await deleteProgress(itemProgressCard.id);
      if (res.status === 200) {
        openAckModal();
      } else {
        setErrorMessage(t('errorMessage:500') || '');
      }
    } catch (error) {
      setErrorMessage(t('errorMessage:500') || '');
    }
  };

  const handleDeleteProgressSuccess = () => {
    setShouldRefresh(true);
  };

  const handleCloseAckModal = () => {
    closeAckModal();
    handleDeleteProgressSuccess(); // Navigate to the challenge progresses screen => delete it and refresh the list
  };

  const isProgressOwner = userData && userData?.id === currentUserId;

  return (
    <View className="mb-1 bg-gray-50 p-5 ">
      <View className="mb-3 flex flex-row items-center justify-between ">
        <TouchableOpacity
          className="flex flex-row"
          onPress={() => {
            if (!userData?.id) return;
            // navigation.push('OtherUserProfileScreen', {
            //   userId: userData?.id,
            // });
            const pushAction = StackActions.push('OtherUserProfileScreen', {
              userId: userData?.id,
            });
            navigation.dispatch(pushAction);
          }}
        >
          <ProgressCardAvatar src={userData?.avatar} />
          <View className="ml-2">
            <Text
              className={`text-h6 font-bold ${
                isProgressOwner ? 'text-primary-default' : 'text-black'
              }`}
            >
              {userData?.name} {userData?.surname}
            </Text>
            <View className="flex flex-row items-center">
              <Text className="text-gray-dark text-xs font-light ">
                {timeDiff}{' '}
              </Text>

              {itemProgressCard?.location && (
                <Text className="text-gray-dark text-xs font-light ">
                  <IconDot fill={'#7D7E80'} /> {itemProgressCard?.location}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
        {!isOtherUserProfile && isProgressOwner && isJoined && (
          <PopUpMenu
            options={progressOptions}
            isDisabled={isChallengeCompleted || itemProgressCard?.first}
          />
        )}
      </View>
      {itemProgressCard?.caption && (
        <Text className=" text-md mb-1 font-normal leading-5">
          {itemProgressCard?.caption}
        </Text>
      )}
      {extractedImageUrls && (
        <View className="mt-2 aspect-square w-full">
          <ImageSwiper imageSrc={extractedImageUrls} />
        </View>
      )}
      {itemProgressCard?.video && <VideoPlayer src={itemProgressCard.video} />}

      <View className="mt-3 flex-row">
        <LikeButton
          progressId={itemProgressCard.id}
          currentUserId={currentUser?.id}
        />
        <CommentButton
          navigationToComment={handleNavigationToComment}
          progressId={itemProgressCard.id}
        />
      </View>

      <ConfirmDialog
        title={(!errorMessage ? t('success') : t('error')) || ''}
        description={
          (!errorMessage
            ? t('delete_progress.delete_success')
            : t('errorMessage:500')) || ''
        }
        isVisible={isAckModalVisible}
        onClosed={handleCloseAckModal}
        closeButtonLabel={t('close') || ''}
      />
      <ConfirmDialog
        isVisible={isShowDeleteModal}
        onConfirm={handleConfirmDeleteChallengeProgress}
        onClosed={() => setIsShowDeleteModal(false)}
        title={t('dialog.delete_progress.title') as string}
        confirmButtonLabel="Delete"
        closeButtonLabel="Cancel"
        description={t('dialog.delete_progress.description') as string}
      />
    </View>
  );
};

export default ProgressCard;
