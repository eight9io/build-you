import { View, Text, TouchableOpacity, Image } from 'react-native';
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

interface IProgressCardProps {
  challengeOwner: {
    avatar: string;
    id: string;
    name: string;
    surname: string;
  };
  challengeName: string;
  userData: IUserData | null;
  onEditProgress?: () => void;
  isChallengeCompleted?: boolean;
  itemProgressCard: IProgressChallenge;
  onDeleteProgressSuccess?: () => void;
}

const ProgressCard: FC<IProgressCardProps> = ({
  userData,
  challengeName,
  onEditProgress,
  challengeOwner,
  itemProgressCard,
  onDeleteProgressSuccess,
  isChallengeCompleted = false,
}) => {
  const [isShowEditModal, setIsShowEditModal] = useState(false);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);

  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const timeDiff = getTimeDiffToNow(itemProgressCard.createdAt);

  const [errorMessage, setErrorMessage] = useState('');
  const {
    isVisible: isAckModalVisible,
    openModal: openAckModal,
    closeModal: closeAckModal,
  } = useModal();

  const progressOptions = [
    {
      text: 'Edit',
      onPress: () => setIsShowEditModal(true),
    },
    {
      text: 'Delete',
      onPress: () => setIsShowDeleteModal(true),
    },
  ];

  const handleConfirmEditChallengeProgress = async () => {
    setIsShowEditModal(false); // Close the edit modal
    onEditProgress && onEditProgress(); // Navigate to the challenge progresses screen to refresh the list
  };

  const handleCloseAckModal = () => {
    closeAckModal();
    onDeleteProgressSuccess && onDeleteProgressSuccess(); // Navigate to the challenge progresses screen => delete it and refresh the list
  };

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
      ownerId: challengeOwner.id,
      challengeName: challengeName || '',
    });

    navigation.dispatch(pushAction);
  };

  const extractedImageUrls = getSeperateImageUrls(itemProgressCard?.image);

  return (
    <View className="mb-1 flex-1 bg-gray-50 p-5 ">
      <EditChallengeProgressModal
        progress={itemProgressCard}
        isVisible={isShowEditModal}
        onClose={() => setIsShowEditModal(false)}
        onConfirm={handleConfirmEditChallengeProgress}
      />
      <View className="mb-3 flex flex-row items-center justify-between ">
        <View className="flex flex-row">
          <ProgressCardAvatar src="https://picsum.photos/200/300" />
          <View className="ml-2">
            <Text className="text-h6 font-bold">
              {userData?.name} {userData?.surname}{' '}
            </Text>
            <View className="flex flex-row items-center">
              <Text className="text-gray-dark text-xs font-light ">
                {timeDiff}{' '}
              </Text>

              <Text className="text-gray-dark text-xs font-light ">
                <IconDot fill={'#7D7E80'} /> 123 Amanda Street
              </Text>
            </View>
          </View>
        </View>
        <PopUpMenu
          options={progressOptions}
          isDisabled={isChallengeCompleted || itemProgressCard?.first}
        />
      </View>
      <Text className=" text-md mb-3 font-normal leading-5">
        {itemProgressCard.caption}
      </Text>
      {extractedImageUrls && (
        <View className="aspect-square w-full">
          <ImageSwiper imageSrc={extractedImageUrls} />
        </View>
      )}
      {itemProgressCard.video && <VideoPlayer src={itemProgressCard.video} />}

      <View className="mt-4 flex-row">
        <LikeButton progressId={itemProgressCard.id} />
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
