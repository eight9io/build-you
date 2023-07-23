import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import clsx from "clsx";

import Button from "../Button";
import AddEmojiIcon from "../asset/add-emoji.svg";
import WarningSvg from "../../../asset/warning.svg";

interface IAddEmojiButtonProps {
  selectedEmoji: string | null;
  triggerFunction: () => void;
  selectEmojiError?: boolean;
}

const renderEmojiButton = (
  triggerFunction: () => void,
  selectedEmoji: string | null,
  selectEmojiError?: boolean
) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={clsx(
        "mr-1 w-12 flex-1 rounded-lg border border-gray-medium bg-gray-veryLight"
      )}
      onPress={triggerFunction}
    >
      {!selectedEmoji && (
        <View className="flex-1 flex-row items-center justify-center">
          <AddEmojiIcon />
        </View>
      )}
      {selectedEmoji && (
        <View className="h-12 w-12 rounded-lg border border-gray-medium">
          <Text className="pt-1 text-center text-3xl">{selectedEmoji}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const AddEmojiButton: React.FC<IAddEmojiButtonProps> = ({
  selectedEmoji,
  triggerFunction,
  selectEmojiError,
}) => {
  return (
    <View className={clsx("flex h-12 w-full flex-row items-center")}>
      <Text className={clsx("text-md font-semibold text-primary-default")}>
        Emoji
      </Text>
      <View className="relativeflex flex-1 flex-col items-start pl-4">
        <View>
          {renderEmojiButton(triggerFunction, selectedEmoji, selectEmojiError)}
        </View>
        {selectEmojiError && (
          <View className="absolute bottom-[-20px] left-4 flex flex-row items-center justify-center">
            <WarningSvg />
            <Text className="pl-1 text-sm text-red-500">
              Please select an emoji
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default AddEmojiButton;
