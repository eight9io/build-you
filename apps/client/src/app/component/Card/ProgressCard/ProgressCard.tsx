import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';

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

interface IProgressCardProps {
  itemProgressCard: IProgressChallenge;
  userData: IUserData | null;
}

const ProgressCard: React.FC<IProgressCardProps> = ({
  itemProgressCard: { id, challenge, caption, image, video, location, like },
  userData,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isShowEditModal, setIsShowEditModal] = React.useState(false);
  const [isShowDeleteModal, setIsShowDeleteModal] = React.useState(false);
  const { t } = useTranslation();

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

  return (
    <View className="mb-1 flex-1 bg-gray-50 p-5 ">
      <EditChallengeProgressModal
        imageSrc={image ?? mockImage}
        isVisible={isShowEditModal}
        onClose={() => setIsShowEditModal(false)}
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
      <Text className=" text-md mb-3 font-normal leading-5">{caption}</Text>
      {image && (
        <View className="aspect-square w-full">
          <ImageSwiper imageSrc={image} />
        </View>
      )}
      {video && (
        <View>
          <Text>Render video</Text>
        </View>
      )}

      <View className="mt-4 flex-row">
        <LikeButton likes={like || 0} />
        <CommentButton
          navigationToComment={() =>
            navigation.navigate('ChallengeDetailComment', {
              challengeId: '1',
            })
          }
        />
      </View>
    </View>
  );
};

export default ProgressCard;
