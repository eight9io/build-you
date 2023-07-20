import { FC, useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Controller, set, useForm } from 'react-hook-form';
import { NavigationProp, Route, useNavigation } from '@react-navigation/native';

import { IProgressComment } from '../../../types/progress';
import { IProgressChallenge } from '../../../types/challenge';
import { IEmployeeDataProps } from '../../../types/common';

import {
  createProgressComment,
  getProgressComments,
  getProgressById,
} from '../../../service/progress';
import { sortArrayByCreatedAt } from '../../../utils/common';
import { useEmployeeListStore } from '../../../store/company-data';

import ChallengeProgressCardForComment from '../../../component/Post/ChallengeProgressCard';
import SingleComment from '../../../component/common/SingleComment';

import ErrorText from '../../../component/common/ErrorText';
import SendIcon from '../../../component/asset/send-icon.svg';
import PostAvatar from '../../../component/common/Avatar/PostAvatar';
import GlobalDialogController from '../../../component/common/Dialog/GlobalDialogController';
import SkeletonLoadingCommon from '../../../component/common/SkeletonLoadings/SkeletonLoadingCommon';
import TextInputWithMention from '../../../component/common/Inputs/TextInputWithMention';
import { useUserProfileStore } from '../../../store/user-data';
import { getChallengeById } from '../../../service/challenge';
import { serviceGetEmployeeList } from '../../../service/company';

interface IProgressCommentScreenProps {
  route: Route<
    'ProgressCommentScreen',
    {
      progressId: string;
      ownerId?: string;
      challengeName?: string;
      challengeId: string;
    }
  >;
}

interface ICommentInputProps {
  handleOnSubmit: (comment: string) => void;
  companyEmployees?: IEmployeeDataProps[];
}

const CommentInput: FC<ICommentInputProps> = ({
  handleOnSubmit,
  companyEmployees,
}) => {
  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();

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
    reValidateMode: 'onSubmit',
  });

  const onSubmit = (data: { comment: string }) => {
    handleOnSubmit(data.comment);
    reset({
      comment: '',
    });

    Keyboard.dismiss();
  };

  return (
    <View className="border-gray-medium flex flex-row border-t-[1px] bg-white px-4 py-4">
      <PostAvatar src={currentUser?.avatar} />
      <View className="ml-3 max-h-40 flex-1">
        <Controller
          name={'comment'}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => {
            return (
              <TextInputWithMention
                placeholder={
                  t('progress_comment_screen.comment_input_placeholder') || ''
                }
                companyEmployees={companyEmployees}
                placeholderTextColor={'#C5C8D2'}
                rightIcon={value !== '' && <SendIcon />}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                onRightIconPress={handleSubmit(onSubmit)}
              />
            );
          }}
        />
        {errors.comment ? <ErrorText message={errors.comment.message} /> : null}
      </View>
    </View>
  );
};

const ProgressCommentScreen: FC<IProgressCommentScreenProps> = ({ route }) => {
  const { progressId, ownerId, challengeId } = route.params;
  const { t } = useTranslation();
  const [progressCommentScreenLoading, setProgressCommentScreenLoading] =
    useState<boolean>(true);
  const [comments, setComments] = useState<IProgressComment[]>([]);
  const [shouldRefreshComments, setShouldRefreshComments] =
    useState<boolean>(false);
  const [progressData, setProgressData] = useState<IProgressChallenge>(
    {} as IProgressChallenge
  );
  const [companyEmployees, setCompanyEmployees] = useState<any[]>([]);
  const [isChallengePublic, setIsChallengePublic] = useState<boolean>(false);

  useEffect(() => {
    if (!progressId) return;
    const loadProgressData = async () => {
      try {
        const response = await getProgressById(progressId);
        const challengeResponse = await getChallengeById(challengeId);
        const owner = Array.isArray(challengeResponse.data.owner)
          ? challengeResponse.data.owner[0]
          : challengeResponse.data.owner;

        const isChallengePublic = challengeResponse.data?.public;
        setIsChallengePublic(isChallengePublic);
        const shouldRetrictEmployeeList =
          owner?.companyAccount && !isChallengePublic;

        if (shouldRetrictEmployeeList) {
          const companyEmployeesResponse = await serviceGetEmployeeList(
            owner?.id
          );
          setCompanyEmployees(companyEmployeesResponse.data);
        }

        setProgressData(response.data);
      } catch (error) {
        GlobalDialogController.showModal({
          title: 'Error',
          message:
            (t('error_general_message') as string) || 'Something went wrong',
          button: 'OK',
        });
      }
    };
    loadProgressData();
  }, [progressId]);

  useEffect(() => {
    (async () => {
      await loadProgressComments();
    })();
  }, []);

  const loadProgressComments = async () => {
    try {
      const response = await getProgressComments(progressId);
      const sortedComments = sortArrayByCreatedAt(
        response.data,
        'createdAt',
        'desc'
      );
      setComments(sortedComments);
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
    }
  };

  return (
    <SafeAreaView className=" flex-1 bg-white">
      {progressCommentScreenLoading && <SkeletonLoadingCommon />}
      {!progressCommentScreenLoading && (
        <KeyboardAvoidingView
          keyboardVerticalOffset={Platform.OS === 'ios' ? 115 : 0}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="relative flex-1"
        >
          <View className="flex-1">
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
                      {progressData.challenge?.goal || 'Challenge created'}
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
              ListFooterComponent={
                <View className="h-20" style={{ flex: 1 }} />
              }
            />
          </View>
          <View className={` bottom-0 w-full`}>
            <CommentInput
              handleOnSubmit={handleSubmit}
              companyEmployees={isChallengePublic ? [] : companyEmployees}
            />
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

export default ProgressCommentScreen;
