import { FC } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

import { clsx } from 'clsx';
import PostAvatar from '../Avatar/PostAvatar/index';
import PopUpMenu from '../PopUpMenu';
import dayjs from '../../../utils/date.util';
import { IProgressComment } from '../../../types/progress';
import { useUserProfileStore } from '../../../store/user-data';
import { deleteProgressComment } from '../../../service/progress';
import GlobalDialogController from '../Dialog/GlobalDialogController';
import { useTranslation } from 'react-i18next';
interface ISingleCommentProps {
  comment: IProgressComment;
  onDeleteCommentSuccess: () => void;
}

const SingleComment: FC<ISingleCommentProps> = ({
  comment,
  onDeleteCommentSuccess,
}) => {
  const { userProfile } = useUserProfileStore();
  const { t } = useTranslation();

  const handleDeleteComment = async () => {
    try {
      const res = await deleteProgressComment(comment.id);
      if (res.status === 200) {
        // Reload comments
        GlobalDialogController.showModal(
          t('progress_comment_screen.delete_comment_success') ||
            'Delete comment success!'
        );
        onDeleteCommentSuccess();
      }
    } catch (error) {
      GlobalDialogController.showModal(
        t('errorMessage:500') || 'Something went wrong. Please try again later!'
      );
      console.log(error);
    }
  };
  return (
    <View
      className={clsx(
        'mt-2 flex w-full flex-col items-start justify-between rounded-xl bg-[#FAFBFF] p-4'
      )}
    >
      <View
        className={clsx(
          'bg-gray-veryLight mb-3 w-full flex-row justify-between'
        )}
      >
        <View className={clsx('flex-row')}>
          <PostAvatar src={'https://picsum.photos/200/300'} />
          <View className={clsx('ml-2')}>
            <Text
              className={clsx(
                'text-h6 font-bold',
                userProfile &&
                  userProfile.id === comment.user &&
                  'text-primary-light'
              )}
            >
              {comment.userName} {comment.surName}
            </Text>
            <Text className={clsx('text-gray-dark text-xs font-light ')}>
              {dayjs(comment.createdAt).fromNow()}
            </Text>
          </View>
        </View>
        {/* TODO: uncomment this when we have the isOwner property */}
        {userProfile && userProfile.id === comment.user && (
          <PopUpMenu
            iconColor="#FF7B1D"
            options={[
              {
                text: 'Delete',
                onPress: () => handleDeleteComment(),
              },
            ]}
          />
        )}
      </View>
      <View>
        <Text className={clsx('text-gray-dark text-sm')}>
          {comment.comment}
        </Text>
      </View>
    </View>
  );
};

export default SingleComment;
