import { View, Text, Modal } from "react-native";
import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import EmojiSelector, { Categories } from "react-native-emoji-selector";

import Header from "../../common/Header";

import Close from "../../../component/asset/close.svg";
import AddReactionEmoji from "../asset/add-reaction.svg";

interface IAddEmojiModallProps {
  isVisible: boolean;
  onClose: () => void;
  setExternalSelectedEmoji: (emoji: string | null) => void;
  setSelectEmojiError: (error: boolean) => void;
}

export const AddEmojiModal: FC<IAddEmojiModallProps> = ({
  isVisible,
  onClose,
  setExternalSelectedEmoji,
  setSelectEmojiError,
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const { t } = useTranslation();

  const handleSelectEmoji = () => {
    setExternalSelectedEmoji(selectedEmoji);
    setSelectEmojiError(false);
    onClose();
  };

  const hanldleClose = () => {
    setSelectedEmoji(null);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={isVisible}
      style={{ justifyContent: "flex-end", margin: 0 }}
    >
      <View className="mt-auto flex h-1/2 flex-1 flex-col rounded-t-xl px-6 ">
        <Header
          title={t("add_emoji.select_emoji") || "Select emoji"}
          leftBtn={<Close fill={"black"} />}
          onLeftBtnPress={hanldleClose}
          rightBtn={t("select") || "Select"}
          onRightBtnPress={handleSelectEmoji}
        />
        <View className="flex h-20 flex-row items-center justify-center ">
          {!selectedEmoji && <AddReactionEmoji />}
          {selectedEmoji && (
            <Text className="pt-1 text-center text-5xl">{selectedEmoji}</Text>
          )}
        </View>
        <View className="h-full">
          <EmojiSelector
            onEmojiSelected={(emoji) => setSelectedEmoji(emoji)}
            category={Categories.all}
          />
        </View>
      </View>
    </Modal>
  );
};
export default AddEmojiModal;
