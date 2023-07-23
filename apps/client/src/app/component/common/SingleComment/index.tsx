import { FC, useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import {
  Part,
  PartType,
  parseValue,
  MentionInput,
  replaceMentionValues,
  isMentionPartType,
} from 'react-native-controlled-mentions';

import { IProgressComment } from '../../../types/progress';

import { useUserProfileStore } from '../../../store/user-data';

import dayjs from '../../../utils/date.util';
import { deleteProgressComment } from '../../../service/progress';
import GlobalDialogController from '../Dialog/GlobalDialogController';

import PopUpMenu from '../PopUpMenu';
import PostAvatar from '../Avatar/PostAvatar/index';
import {
  NavigationProp,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/navigation.type';
import GlobalToastController from '../Toast/GlobalToastController';
interface ISingleCommentProps {
  comment: IProgressComment;
  onDeleteCommentSuccess: () => void;
  returnBottomTabBar?: () => void;
}
const renderPart = (part: Part, index: number, navigataion: any) => {
  // Mention type part
  const [isDisabled, setDisabled] = useState<boolean>(false);
  if (part?.partType && isMentionPartType(part.partType)) {
    const { t } = useTranslation();

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const navigateToUserProfile = (userId: string | undefined) => {
      if (!userId) {
        GlobalDialogController.showModal({
          title: 'Error',
          message:
            t('error_general_message') ||
            'Something went wrong. Please try again later!',
        });
        return;
      }
      // prevent double click
      if (isDisabled) {
        return;
      }
      setDisabled(true);
      setTimeout(() => {
        setDisabled(false);
      }, 300);
      const pushAction = StackActions.push('OtherUserProfileScreen', {
        userId,
      });
      navigation.dispatch(pushAction);
    };
    return (
      <Text
        key={`${index}-${part.data?.trigger}`}
        style={part.partType.textStyle}
        onPress={() => navigateToUserProfile(part.data?.id)}
      >
        {part.text}
      </Text>
    );
  }
  // Just plain text
  if (!part.partType) {
    return <Text key={index}>{part.text}</Text>;
  }

  return (
    <Text key={`${index}-pattern`} style={part.partType.textStyle}>
      {part.text}
    </Text>
  );
};

const renderValue = (value: string, partTypes: PartType[]) => {
  const { parts } = parseValue(value, partTypes);
  return (
    <View className="flex w-full flex-col flex-wrap items-start">
      <Text>{parts.map(renderPart)}</Text>
    </View>
  );
};

const SingleComment: FC<ISingleCommentProps> = ({
  comment,
  onDeleteCommentSuccess,
}) => {
  const [isDisabled, setDisabled] = useState<boolean>(false);
  const { userProfile } = useUserProfileStore();
  const { t } = useTranslation();

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleDeleteComment = async () => {
    try {
      const res = await deleteProgressComment(comment.id);
      if (res.status === 200) {
        // Reload comments
        GlobalToastController.showModal({
          message: t('toast.delete_success') || 'Delete comment success!',
        });
        onDeleteCommentSuccess();
      }
    } catch (error) {
      GlobalDialogController.showModal({
        title: 'Error',
        message:
          t('errorMessage:500') ||
          'Something went wrong. Please try again later!',
        button: 'OK',
      });
      console.error(error);
    }
  };

  return (
    <View
      className={clsx(
        'mt-2 flex flex-col items-start justify-between rounded-xl bg-[#FAFBFF] p-4'
      )}
    >
      <View
        className={clsx(
          'bg-gray-veryLight mb-3 flex flex-row items-center justify-between'
        )}
      >
        <TouchableOpacity
          className={clsx('flex flex-1 flex-row')}
          onPress={() => {
            // prevent double click
            if (isDisabled) {
              return;
            }
            setDisabled(true);
            setTimeout(() => {
              setDisabled(false);
            }, 300);
            const pushAction = StackActions.push('OtherUserProfileScreen', {
              userId: comment.user,
            });
            navigation.dispatch(pushAction);
          }}
        >
          <PostAvatar
            src={
              userProfile && userProfile.id === comment.user
                ? userProfile?.avatar?.trim()
                : comment.avatar?.trim()
            }
          />
          <View className={clsx('ml-2 flex-1')}>
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
        </TouchableOpacity>

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

      {renderValue(comment.comment, [
        {
          trigger: '@',
          textStyle: {
            color: '#24252B',
            fontSize: 14,
            fontWeight: '600',
            lineHeight: 20,
          },
        },
      ])}
    </View>
  );
};

export default SingleComment;
