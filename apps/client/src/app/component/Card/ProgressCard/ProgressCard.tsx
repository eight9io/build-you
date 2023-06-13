import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useState, FC, useEffect } from 'react';

import clsx from 'clsx';

import Card from '../../common/Card';
import IconLike from './asset/like.svg';
import IconComment from './asset/comment.svg';
import IconDot from './asset/dot.svg';
import ProgressCardAvatar from '../../common/Avatar/PostAvatar';
import PopUpMenu from '../../common/PopUpMenu';
import ImageSwiper from '../../common/ImageSwiper';

import EditChallengeProgressModal from '../../modal/EditChallengeProgressModal';
import ConfirmDialog from '../../common/Dialog/ConfirmDialog';
import LikeButton from '../../Post/LikeButton';
import CommentButton from '../../Post/CommentButton';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/navigation.type';
import { useTranslation } from 'react-i18next';

import { IProgressChallenge } from '../../../types/challenge';
import { IUserData } from '../../../types/user';
import {
  createProgressLike,
  getProgressComments,
  getProgressLikes,
} from '../../../service/progress';
import Loading from '../../common/Loading';
import {
  ICreateProgressComment,
  ICreateProgressLike,
} from '../../../types/progress';
import VideoPlayer from '../../common/VideoPlayer';

interface IProgressCardProps {
  itemProgressCard: IProgressChallenge;
  userData: IUserData | null;
  onEditProgress?: () => void;
}

const ProgressCard: FC<IProgressCardProps> = ({
  itemProgressCard,
  userData,
  onEditProgress
}) => {
  const [isShowEditModal, setIsShowEditModal] = useState(false);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(0);
  const [numberOfComments, setNumberOfComments] = useState(0);
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const time = '1 hour ago';
  const mockImage = 'https://picsum.photos/200/300';

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

  useEffect(() => {
    (async () => {
      await loadProgressLikes();
      await loadProgressComments();
    })();
  }, []);

  const loadProgressLikes = async () => {
    try {
      const response = await getProgressLikes(itemProgressCard.id);
      if (response.status === 200) setNumberOfLikes(response.data.length);
    } catch (error) {
      console.log(error);
    }
  };

  const loadProgressComments = async () => {
    try {
      const response = await getProgressComments(itemProgressCard.id);
      if (response.status === 200) setNumberOfComments(response.data.length);
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmEditChallengeProgress = async () => {
    setIsShowEditModal(false); // Close the edit modal
    onEditProgress && onEditProgress(); // Navigate to the challenge progresses screen to refresh the list
  }

  return (
    <View className="mb-1 flex-1 bg-gray-50 p-5 ">
      <EditChallengeProgressModal
        progress={itemProgressCard}
        isVisible={isShowEditModal}
        onClose={() => setIsShowEditModal(false)}
        onConfirm={handleConfirmEditChallengeProgress}
      />

      <ConfirmDialog
        isVisible={isShowDeleteModal}
        onClosed={() => setIsShowDeleteModal(false)}
        title={t('dialog.delete_progress.title') as string}
        description={t('dialog.delete_progress.description') as string}
      />
      <View className="mb-3 flex flex-row items-center justify-between ">
        <View className="flex flex-row">
          <ProgressCardAvatar src="https://picsum.photos/200/300" />
          <View className="ml-2">
            <Text className="text-h6 font-bold">
              {userData?.name} {userData?.surname}{' '}
            </Text>
            <View className="flex flex-row items-center">
              <Text className="text-gray-dark text-xs font-light ">{time}</Text>

              <Text className="text-gray-dark text-xs font-light ">
                <IconDot fill={'#7D7E80'} /> 123 Amanda Street
              </Text>
            </View>
          </View>
        </View>
        <PopUpMenu options={progressOptions} />
      </View>
      <Text className=" text-md mb-3 font-normal leading-5">
        {itemProgressCard.caption}
      </Text>
      {itemProgressCard.image && (
        <View className="aspect-square w-full">
          <ImageSwiper imageSrc={itemProgressCard.image} />
        </View>
      )}
      {itemProgressCard.video && <VideoPlayer src={itemProgressCard.video} />}

      <View className="mt-4 flex-row">
        <LikeButton likes={numberOfLikes || 0} />
        <CommentButton
          navigationToComment={() =>
            navigation.navigate('ChallengeDetailComment', {
              challengeId: '1',
            })
          }
          numberOfComments={numberOfComments}
        />
      </View>
    </View>
  );
};

export default ProgressCard;
