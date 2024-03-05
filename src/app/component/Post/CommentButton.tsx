import React, { FC, useEffect, useState } from "react";
import { View, Text, TouchableHighlight } from "react-native";
import { clsx } from "clsx";

import CommentSvg from "./asset/comment.svg";
import { getProgressComments } from "../../service/progress";
// import GlobalDialogController from "../common/Dialog/GlobalDialogController";
import debounce from "lodash.debounce";
import { INumberOfCommentUpdate } from "../../types/challenge";
import { useTranslation } from "react-i18next";

interface ICommentButtonProps {
  progressId: string;
  isViewOnly?: boolean;
  navigationToComment?: () => void;
  localCommentUpdate?: INumberOfCommentUpdate;
}

const CommentButton: FC<ICommentButtonProps> = ({
  progressId,
  isViewOnly = false,
  navigationToComment,
  localCommentUpdate,
}) => {
  const { t } = useTranslation();
  const [numberOfComments, setNumberOfComments] = useState(0);

  useEffect(() => {
    if (!progressId) return;
    loadProgressComments();
  }, [progressId]);

  const loadProgressComments = async () => {
    try {
      const response = await getProgressComments(progressId);
      if (response.status === 200) setNumberOfComments(response.data.length);
    } catch (_) {
      setNumberOfComments(0);
    }
  };
  const handleNavigationToComment = debounce(() => {
    !isViewOnly && navigationToComment && navigationToComment();
  }, 300);

  return (
    <TouchableHighlight
      activeOpacity={0.8}
      underlayColor="#C5C8D2"
      onPress={handleNavigationToComment}
      className="ml-2 h-8 rounded-md px-2"
    >
      <View
        className={clsx("flex-1 flex-row items-center justify-center gap-2")}
      >
        <CommentSvg />
        {!(localCommentUpdate?.id === progressId) ? (
          <Text className={clsx("text-md font-normal text-gray-dark ")}>
            {t("commentWithCount", { count: numberOfComments })}
          </Text>
        ) : (
          <Text className={clsx("text-md font-normal text-gray-dark ")}>
            {t("commentWithCount", {
              count: localCommentUpdate.numberOfComments,
            })}
          </Text>
        )}
      </View>
    </TouchableHighlight>
  );
};

export default CommentButton;
