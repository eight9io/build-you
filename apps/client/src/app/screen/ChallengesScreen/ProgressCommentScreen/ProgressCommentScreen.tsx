import React, { FC, useEffect, useState } from 'react';
import { SafeAreaView, View, Text, ScrollView } from 'react-native';
import { NavigationProp, Route, useNavigation } from '@react-navigation/native';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { ChallengeProgressCardForComment } from '../../../component/Post/ChallengeProgressCard';
import Header from '../../../component/common/Header';
import { RootStackParamList } from '../../../navigation/navigation.type';
import NavButton from '../../../component/common/Buttons/NavButton';
import SingleComment from '../../../component/common/SingleComment';
import {
  createProgressComment,
  getProgressComments,
} from '../../../service/progress';
import PostAvatar from '../../../component/common/Avatar/PostAvatar';
import TextInput from '../../../component/common/Inputs/TextInput';
import { Controller, useForm } from 'react-hook-form';
import ErrorText from '../../../component/common/ErrorText';
import SendIcon from '../../../component/asset/send-icon.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
interface IProgressCommentScreenProps {
  route: Route<
    'ProgressCommentScreen',
    {
      progressId: string;
    }
  >;
}

interface ICommentInputProps {
  avatar?: string;
  handleOnSubmit: (comment: string) => void;
}

const item = {
  id: '1',
  avatar: 'avata',
  name: 'Marco Rossi',
  time: '1 hour ago',
  stt: "I finally bought the equipment for my challenge. Mont Blanc I'm coming!!! 🧗🏻‍♂️",
  card: {
    image: 'https://picsum.photos/200/300',
    title: 'Lose 10kg',
    builder: 'Marco Rossi',
  },
  like: 5,
  comment: 0,
  location: '123 Amanda Street',
};

const COMMENTS = [
  {
    id: '1',
    user: {
      name: 'Marco Rossi',
      avatar: 'https://picsum.photos/200/300',
    },
    time: '1 hour ago',

    comment:
      "I finally bought the equipment for my challenge. Mont Blanc I'm coming!!! 🧗🏻‍♂️",
    isOwner: true,
  },
  {
    id: '2',
    user: {
      name: 'Marco Rossi',
      avatar: 'https://picsum.photos/200/300',
    },
    time: '1 hour ago',
    comment:
      "I finally bought the equipment for my challenge. Mont Blanc I'm coming!!! 🧗🏻‍♂️",
    isOwner: true,
  },
  {
    id: '3',
    user: {
      name: 'Marco Rossi',
      avatar: 'https://picsum.photos/200/300',
    },
    time: '1 hour ago',
    comment:
      "I finally bought the equipment for my challenge. Mont Blanc I'm coming!!! 🧗🏻‍♂️",
    isOwner: false,
  },
];

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
            <TextInput
              placeholder={
                t('progress_comment_screen.comment_input_placeholder') || ''
              }
              placeholderTextColor={'#C5C8D2'}
              rightIcon={
                value !== '' ? (
                  <TouchableOpacity onPress={handleSubmit(onSubmit)}>
                    <SendIcon />
                  </TouchableOpacity>
                ) : null
              }
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              className="w-full rounded-xl bg-white px-4 py-5"
              multiline
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
  const { progressId } = route.params;
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  // const [numberOfComments, setNumberOfComments] = useState(0);

  // useEffect(() => {
  //   (async () => {
  //     await loadProgressComments();
  //   })();
  // }, []);

  // const loadProgressComments = async () => {
  //   try {
  //     const response = await getProgressComments(progressId);
  //     if (response.status === 200) setNumberOfComments(response.data.length);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleSubmit = async (comment: string) => {
    // try {
    //   const res = await createProgressComment({
    //     comment: comment,
    //     progress: progressId,
    //   });
    //   if (res.status === 200) {
    //     // Reload comments
    //     await loadProgressComments();
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  };
  return (
    <SafeAreaView className={clsx('flex-1 bg-white')}>
      <View className="relative">
        <ScrollView className={clsx('bg-gray-50')} style={{ width: '100%' }}>
          {/* <Header
          leftBtn={
            <NavButton
              text="Back"
              withBackIcon={true}
              onPress={() => navigation.goBack()}
            />
          }
        /> */}
          <View className={clsx(' flex flex-1 flex-col ')}>
            <View
              className={clsx(
                'border-gray-light flex border-b bg-white px-5 py-3 '
              )}
            >
              <Text className={clsx('text-h4 font-semibold')}>
                {item.card.title}
              </Text>
            </View>
            <ChallengeProgressCardForComment item={item} />
          </View>
          <View className=" flex flex-1 flex-col justify-start bg-white px-5 py-3">
            {COMMENTS.map((item, id) => (
              <View key={id}>
                <SingleComment comment={item} />
              </View>
            ))}
          </View>
        </ScrollView>
        <View className="absolute bottom-0 w-full">
          <CommentInput handleOnSubmit={handleSubmit} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProgressCommentScreen;
