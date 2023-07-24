import React, { FC, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TouchableHighlight } from "react-native";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";

import ThumbUp from "./asset/thumb_up.svg";
import FilledThumbUP from "./asset/filled_thumb_up.svg";
import { useAuthStore } from "../../store/auth-store";
import { useChallengeUpdateStore } from "../../store/challenge-update-store";

import {
  createProgressLike,
  deleteProgressLike,
  getProgressLikes,
} from "../../service/progress";
import { debounce } from "../../hooks/useDebounce";

import GlobalDialogController from "../common/Dialog/GlobalDialogController";
import { INumberOfLikeUpdate } from "../../types/challenge";

interface ILikeButtonProps {
  navigation?: any;
  progressId?: string;
  isFocused?: boolean;
  localProgressLikes?: INumberOfLikeUpdate;
  currentUserId: string | undefined;
}

const LikeButton: FC<ILikeButtonProps> = ({
  navigation,
  progressId,
  currentUserId,
  localProgressLikes,
}) => {
  const { getAccessToken } = useAuthStore();
  const { t } = useTranslation();

  const [numberOfLikes, setNumberOfLikes] = useState<number>(0);
  const [isLikedByCurrentUser, setIsLikedByCurrentUser] =
    useState<boolean>(false);

  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [tempLikes, setTempLikes] = useState(numberOfLikes);
  const [shouldOptimisticUpdate, setShouldOptimisticUpdate] =
    useState<boolean>(false);

  const isToken = getAccessToken();

  const { setChallengeUpdateLike } = useChallengeUpdateStore();

  const loadProgressLikes = async () => {
    if (!progressId || !currentUserId) return;
    try {
      const response = await getProgressLikes(progressId);
      setNumberOfLikes(response.data.length);
      const isLiked = response.data.some((like) => like.user === currentUserId);
      setIsLikedByCurrentUser(isLiked);
    } catch (error) {
      setNumberOfLikes(0);
      setIsLikedByCurrentUser(false);
    }
  };

  useEffect(() => {
    if (!progressId) return;
    loadProgressLikes();
  }, [progressId]);

  useEffect(() => {
    if (localProgressLikes?.id && localProgressLikes.id === progressId) {
      setNumberOfLikes(localProgressLikes.numberOfLikes || 0);
      setIsLikedByCurrentUser(localProgressLikes.isLikedByCurrentUser || false);
    }
  }, [localProgressLikes?.id, localProgressLikes?.numberOfLikes]);

  // TODO for optimistic like just update the state and consider using https://www.npmjs.com/package/@chris.troutner/retry-queue for api call
  useEffect(() => {
    setTempLikes(numberOfLikes);
  }, [numberOfLikes]);

  const handleLike = () => {
    if (!isToken) {
      // this is for unauthenticated user
      return navigation.navigate("LoginScreen");
    }
    if (isLikedByCurrentUser) {
      setShouldOptimisticUpdate(true);
      setIsLikedByCurrentUser && setIsLikedByCurrentUser(false);
      setIsLiked(false);
      setTempLikes((prev) => prev - 1);
      setChallengeUpdateLike({
        id: progressId,
        numberOfLikes: tempLikes - 1,
        isLikedByCurrentUser: false,
      });
      deleteProgressLike(progressId);
      return;
    }
    setShouldOptimisticUpdate(true);
    setIsLikedByCurrentUser && setIsLikedByCurrentUser(true);
    setIsLiked(true);
    setTempLikes((prev) => prev + 1);
    setChallengeUpdateLike({
      id: progressId,
      numberOfLikes: tempLikes + 1,
      isLikedByCurrentUser: true,
    });
    createProgressLike(progressId);
  };

  const debouncedHandleLike = debounce(handleLike, 300); // Change the debounce delay as needed (in milliseconds)

  return (
    <TouchableHighlight
      activeOpacity={0.8}
      underlayColor="#C5C8D2"
      onPress={debouncedHandleLike}
      className="h-8 rounded-md px-2"
    >
      <View
        className={clsx("flex-1 flex-row items-center justify-center gap-2")}
      >
        {!shouldOptimisticUpdate &&
          (isLikedByCurrentUser ? <FilledThumbUP /> : <ThumbUp />)}
        {shouldOptimisticUpdate && (isLiked ? <FilledThumbUP /> : <ThumbUp />)}
        <Text className={clsx("text-md font-normal text-gray-dark ")}>
          {shouldOptimisticUpdate
            ? `${tempLikes} ${tempLikes > 1 ? "likes" : "like"}`
            : `${numberOfLikes} ${numberOfLikes > 1 ? "likes" : "like"}`}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

export default LikeButton;
