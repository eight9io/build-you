import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { FC } from "react";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import { Image } from "expo-image";

import { IFeedPostProps } from "../../types/common";
import { RootStackParamList } from "../../navigation/navigation.type";

import { useAuthStore } from "../../store/auth-store";
import { getTimeDiffToNow } from "../../utils/time";

import PostAvatar from "../common/Avatar/PostAvatar";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import GlobalDialogController from "../common/Dialog/GlobalDialogController";

import BackSvg from "../asset/back.svg";
import { NavigationProp, useNavigation } from "@react-navigation/native";
<<<<<<< HEAD
import { Video } from "expo-av";
=======
import { ResizeMode, Video } from "expo-av";
>>>>>>> main
import LikeButtonUnregister from "./LikeButtonUnregister";
import CommentButtonUnregister from "./CommentButtonUnregister";
import { useChallengeUpdateStore } from "../../store/challenge-update-store";
import {
  INumberOfCommentUpdate,
  INumberOfLikeUpdate,
} from "../../types/challenge";

interface IChallengeImageProps {
  name: string;
  image: string | null;
  onPress?: () => void;
}

interface IChallengeVideoProps {
  name: string;
  video: string | null;
  onPress?: () => void;
}

interface IFeedPostCardProps {
  itemFeedPostCard: IFeedPostProps;
  userId?: string;
  isFocused?: boolean;
  navigation?: any;
  challgeneUpdateLike?: INumberOfLikeUpdate;
  challengeUpdateComment?: INumberOfCommentUpdate;
}

const ChallengeImage: FC<IChallengeImageProps> = ({ name, image, onPress }) => {
  const [isImageLoading, setIsImageLoading] = React.useState<boolean>(true);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={clsx("w-full rounded-xl border border-gray-80 bg-white")}
    >
      <View className={clsx("relative w-full")}>
        {image && (
          <Image
            className={clsx("aspect-square w-full rounded-t-xl")}
            source={{ uri: image }}
            onLoadEnd={() => setIsImageLoading(false)}
          />
        )}
        {isImageLoading && (
          <View
            className={clsx(
              "absolute left-0 top-0 h-full w-full flex-row items-center justify-center"
            )}
          >
            <ActivityIndicator size="large" />
          </View>
        )}
        <View
          className={clsx(
            "relative flex  flex-row items-center justify-between px-4 py-3"
          )}
        >
          <View className={clsx("flex w-11/12 flex-1 flex-row items-center")}>
            <Text className={clsx("flex-1 text-h6 font-semibold leading-6")}>
              {name}
            </Text>
          </View>
          <View className="">
            <BackSvg />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ChallengeVideo: FC<IChallengeVideoProps> = ({ name, video, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={clsx("w-full rounded-xl border border-gray-80 bg-white")}
    >
      <View className={clsx("relative w-full")}>
        {video && (
          <Video
            className={clsx("aspect-square w-full rounded-t-xl")}
<<<<<<< HEAD
            source={{ uri: video }}
            useNativeControls
=======
            source={{
              uri: video,
            }}
            useNativeControls
            resizeMode={ResizeMode.COVER}
>>>>>>> main
          />
        )}
        <View
          className={clsx(
            "relative flex  flex-row items-center justify-between px-4 py-3"
          )}
        >
          <View className={clsx("flex w-11/12 flex-1 flex-row items-center")}>
            <Text className={clsx("flex-1 text-h6 font-semibold leading-6")}>
              {name}
            </Text>
          </View>
          <View className="">
            <BackSvg />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const FeedPostCardUnregister: React.FC<IFeedPostCardProps> = ({
  itemFeedPostCard: { id, caption, user, image, video, updatedAt, challenge },
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { getAccessToken } = useAuthStore();

  const isToken = getAccessToken();
  const { t } = useTranslation();
  const isCompanyAccount = user.companyAccount;

  const navigateToUserProfile = () => {
    navigation.goBack();
    navigation.navigate("LoginScreen");
  };

  const navigateToChallengeDetail = () => {
    navigation.goBack();
    navigation.navigate("LoginScreen");
  };

  return (
    <View className="relative w-full">
      <View className="relative mb-1">
        <View className="bg-gray-50 p-5">
          <TouchableOpacity
            className="mb-3 flex-row justify-between"
            onPress={navigateToUserProfile}
          >
            <View className="flex-row">
              <PostAvatar src={user?.avatar} onPress={navigateToUserProfile} />
              <View className="ml-2">
                <Text className="text-h6 font-bold">
                  {user?.name} {user?.surname}
                </Text>
                <Text className="text-xs font-light text-gray-dark ">
                  {getTimeDiffToNow(updatedAt)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <Text className=" mb-3 text-md font-normal leading-5">{caption}</Text>
          {image && (
            <ChallengeImage
              name={challenge?.goal}
              image={image as string}
              onPress={navigateToChallengeDetail}
            />
          )}
          {video && (
            <ChallengeVideo
              name={challenge?.goal}
              video={video as string}
              onPress={navigateToChallengeDetail}
            />
          )}

          <View className="mt-4 flex-row">
            <LikeButtonUnregister />
            <CommentButtonUnregister />
          </View>
        </View>
        <View className="h-2 w-full bg-gray-light" />
      </View>
      {!isToken && (
        <TouchableOpacity
          className=" absolute left-0 top-0 z-10 h-full w-full "
          onPress={() => navigation.navigate("LoginScreen")}
        ></TouchableOpacity>
      )}
    </View>
  );
};

const FeedPostCard: React.FC<IFeedPostCardProps> = ({
  itemFeedPostCard: { id, caption, user, image, video, updatedAt, challenge },
  userId,
  isFocused,
  navigation,
  challgeneUpdateLike,
  challengeUpdateComment,
}) => {
  const { t } = useTranslation();
  const navigateToUserProfile = () => {
    if (!user?.id) {
      GlobalDialogController.showModal({
        title: t("dialog.err_title") || "Error",
        message:
          t("error_general_message") ||
          "Something went wrong. Please try again later!",
      });
      return;
    }
    navigation.navigate("OtherUserProfileScreen", { userId: user?.id });
  };

  const navigateToProgressComment = () => {
    if (!user?.id || !id) {
      GlobalDialogController.showModal({
        title: t("dialog.err_title") || "Error",
        message:
          t("error_general_message") ||
          "Something went wrong. Please try again later!",
      });
      return;
    }

    navigation.navigate("ProgressCommentScreen", {
      progressId: id,
      ownerId: user?.id,
      challengeId: challenge?.id,
    });
  };

  const navigateToChallengeDetail = () => {
    if (!challenge?.id) {
      GlobalDialogController.showModal({
        title: t("dialog.err_title") || "Error",
        message:
          t("error_general_message") ||
          "Something went wrong. Please try again later!",
      });
      return;
    }
    if (user?.companyAccount) {
      navigation.navigate("OtherUserProfileChallengeDetailsScreen", {
        challengeId: challenge?.id,
        isCompanyAccount: true,
      });
      return;
    }
    navigation.navigate("OtherUserProfileChallengeDetailsScreen", {
      challengeId: challenge?.id,
    });
  };

  return (
    <View className="relative w-full">
      <View className="relative mb-1">
        <View className="bg-gray-50 p-5">
          <TouchableOpacity
            className="mb-4 flex-row justify-between "
            onPress={navigateToUserProfile}
          >
            <View className="flex-1 flex-row">
              <PostAvatar src={user?.avatar} onPress={navigateToUserProfile} />
              <View className="ml-2 flex-1">
                <Text className="text-h6 font-bold">
                  {user?.name} {user?.surname}
                </Text>
                <Text className="text-xs font-light text-gray-dark ">
                  {getTimeDiffToNow(updatedAt)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          {caption && (
            <Text className=" mb-3 text-md font-normal leading-5">
              {caption}
            </Text>
          )}
          {image && (
            <ChallengeImage
              name={challenge?.goal}
              image={image as string}
              onPress={navigateToChallengeDetail}
            />
          )}
          {video && (
            <ChallengeVideo
              name={challenge?.goal}
              video={video as string}
              onPress={navigateToChallengeDetail}
            />
          )}

          <View className="mt-2 flex flex-row ">
            <LikeButton
              progressId={id}
              currentUserId={userId}
              isFocused={isFocused}
              localProgressLikes={challgeneUpdateLike}
            />
            <CommentButton
              navigationToComment={navigateToProgressComment}
              progressId={id}
              localCommentUpdate={challengeUpdateComment}
            />
          </View>
        </View>
        <View className="h-2 w-full bg-gray-light" />
      </View>
    </View>
  );
};

export default FeedPostCard;
