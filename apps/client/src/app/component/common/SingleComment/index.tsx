import { FC } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

import { clsx } from 'clsx';
import PostAvatar from '../Avatar/PostAvatar/index';

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
    <View className={clsx('flex flex-col items-start justify-between p-4 w-full')}>
      <View className={clsx('bg-gray-veryLight mb-3 flex-row justify-between w-full')}>
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
          <TouchableOpacity onPress={() => console.log('press')}>
            <Text className={clsx('text-h6 font-medium')}>...</Text>
          </TouchableOpacity>
        )}
      </View>
      <View>
        <Text className={clsx('text-gray-dark text-sm')}>{comment.comment}</Text>
      </View>
    </View>
  );
};

export default SingleComment;
