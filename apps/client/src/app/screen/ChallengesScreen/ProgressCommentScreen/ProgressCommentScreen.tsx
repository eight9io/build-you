import { FC, useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NavigationProp, Route, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { IProgressComment } from '../../../types/progress';
import { IProgressChallenge } from '../../../types/challenge';
import { RootStackParamList } from '../../../navigation/navigation.type';

import {
  createProgressComment,
  getProgressComments,
  getProgressById,
} from '../../../service/progress';
import { sortArrayByCreatedAt } from '../../../utils/common';

import ChallengeProgressCardForComment from '../../../component/Post/ChallengeProgressCard';
import SingleComment from '../../../component/common/SingleComment';

import ErrorText from '../../../component/common/ErrorText';
import SendIcon from '../../../component/asset/send-icon.svg';
import PostAvatar from '../../../component/common/Avatar/PostAvatar';
import GlobalDialogController from '../../../component/common/Dialog/GlobalDialogController';
import SkeletonLoadingCommon from '../../../component/common/SkeletonLoadings/SkeletonLoadingCommon';
import TextInputWithMention from '../../../component/common/Inputs/TextInputWithMention';

interface IProgressCommentScreenProps {
  route: Route<
    'ProgressCommentScreen',
    {
      progressId: string;
      ownerId?: string;
      challengeName: string;
    }
  >;
}

interface ICommentInputProps {
  avatar?: string;
  handleOnSubmit: (comment: string) => void;
}

const CommentInput: FC<ICommentInputProps> = ({ avatar, handleOnSubmit }) => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      comment: '',
    },
  });

  const onSubmit = (data: { comment: string }) => {
    handleOnSubmit(data.comment);
    reset();
  };

  return (
    <View className="border-gray-medium flex flex-row border-t-[1px] bg-white px-4 py-4">
      <PostAvatar src={avatar || 'https://picsum.photos/200/300'} />
      <View className="ml-3 max-h-40 flex-1">
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputWithMention
              placeholder={
                t('progress_comment_screen.comment_input_placeholder') || ''
              }
              placeholderTextColor={'#C5C8D2'}
              rightIcon={value !== '' ? <SendIcon /> : null}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              onRightIconPress={handleSubmit(onSubmit)}
            />
          )}
          name={'comment'}
        />
        {errors.comment ? <ErrorText message={errors.comment.message} /> : null}
      </View>
    </View>
  );
};

const ProgressCommentScreen: FC<IProgressCommentScreenProps> = ({ route }) => {
  const { progressId, ownerId, challengeName } = route.params;
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [progressCommentScreenLoading, setProgressCommentScreenLoading] =
    useState<boolean>(true);
  const [comments, setComments] = useState<IProgressComment[]>([]);
  const [shouldRefreshComments, setShouldRefreshComments] =
    useState<boolean>(false);
  const [progressData, setProgressData] = useState<IProgressChallenge>(
    {} as IProgressChallenge
  );

  useEffect(() => {
    if (!progressId) return;
    const progressDataResponse = getProgressById(progressId);
    progressDataResponse
      .then((res) => {
        setProgressData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    (async () => {
      await loadProgressComments();
    })();
  }, []);

  const loadProgressComments = async () => {
    try {
      const response = await getProgressComments(progressId);
      if (response.status === 200) {
        const sortedComments = sortArrayByCreatedAt(
          response.data,
          'createdAt',
          'desc'
        );
        setComments(sortedComments);
      }
      setTimeout(() => {
        setProgressCommentScreenLoading(false);
      }, 600);
    } catch (error) {
      GlobalDialogController.showModal({
        title: 'Error',
        message:
          (t('error_general_message') as string) || 'Something went wrong',
        button: 'OK',
      });
      console.log(error);
    }
  };

  const handleRefreshComments = async () => {
    setShouldRefreshComments(true);
    await loadProgressComments();
    setShouldRefreshComments(false);
  };

  const handleSubmit = async (comment: string) => {
    try {
      const res = await createProgressComment({
        comment: comment,
        progress: progressId,
      });
      if (res.status === 201) {
        // Reload comments
        await handleRefreshComments();
      }
    } catch (error) {
      GlobalDialogController.showModal({
        title: 'Error',
        message:
          (t('error_general_message') as string) || 'Something went wrong',
        button: 'OK',
      });
      console.log(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {progressCommentScreenLoading && <SkeletonLoadingCommon />}
      {!progressCommentScreenLoading && (
        <KeyboardAvoidingView
          behavior={'padding'}
          className="flex-1"
          enabled={Platform.OS === 'ios'}
          keyboardVerticalOffset={94}
        >
          <View className="flex-1">
            <View className="mb-5 flex-1">
              <FlatList
                data={comments}
                renderItem={({ item, index }) => {
                  return (
                    <View key={index} className="px-3">
                      <SingleComment
                        comment={item}
                        onDeleteCommentSuccess={handleRefreshComments}
                      />
                    </View>
                  );
                }}
                ListHeaderComponent={
                  <View className="border-gray-medium mb-3 flex-1 flex-col border-b">
                    <View className="border-gray-light flex border-b bg-white px-5 py-5">
                      <Text className="text-h4 font-semibold">
                        {challengeName || 'Challenge created'}
                      </Text>
                    </View>
                    <ChallengeProgressCardForComment
                      progress={progressData}
                      ownerId={ownerId}
                      shouldRefreshComments={shouldRefreshComments}
                    />
                  </View>
                }
                ListHeaderComponentStyle={{
                  flex: 1,
                }}
              />
            </View>
            <View>
              <CommentInput handleOnSubmit={handleSubmit} />
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

export default ProgressCommentScreen;
