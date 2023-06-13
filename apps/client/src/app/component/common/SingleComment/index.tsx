import { FC } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

import { clsx } from 'clsx';
import PostAvatar from '../Avatar/PostAvatar/index';
import PopUpMenu from '../PopUpMenu';

interface ISingleCommentProps {
  comment: {
    id: string;
    user: {
      name: string;
      avatar: string;
    };
    time: string;
    comment: string;
    isOwner?: boolean;
  };
}

const SingleComment: FC<ISingleCommentProps> = ({ comment }) => {
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
                comment.isOwner && 'text-primary-light'
              )}
            >
              {comment.user.name}
            </Text>
            <Text className={clsx('text-gray-dark text-xs font-light ')}>
              {comment.time}
            </Text>
          </View>
        </View>
        {comment?.isOwner && (
          <PopUpMenu
            iconColor="#FF7B1D"
            options={[
              {
                text: 'Delete',
                onPress: () => console.log('Delete'),
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
