import { View, Text } from "react-native";
import { FC, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import EmojiSelector, { Categories } from "react-native-emoji-selector";

import Header from "../../common/Header";

import Close from "../../../component/asset/close.svg";
import AddReactionEmoji from "../asset/add-reaction.svg";
import { useModalize } from "react-native-modalize";
import BottomSheet from "../../common/BottomSheet/BottomSheet";

interface IAddEmojiModallProps {
  isVisible: boolean;
  onClose: () => void;
  setExternalSelectedEmoji: (emoji: string | null) => void;
  setSelectEmojiError: (error: boolean) => void;
  shouldOffsetDrawerWidth?: boolean;
}

export const AddEmojiModal: FC<IAddEmojiModallProps> = ({
  isVisible,
  onClose,
  setExternalSelectedEmoji,
  setSelectEmojiError,
  shouldOffsetDrawerWidth = true,
}) => {
  const bottomSheetRef = useRef(null);
  const { ref, open, close } = useModalize();
  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        open();
      },
      close: () => {
        close();
      },
    }),
    []
  );
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.open({
        shouldOffsetDrawerWidth,
      });
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  const handleSelectEmoji = () => {
    setExternalSelectedEmoji(selectedEmoji);
    setSelectEmojiError(false);
    onClose();
  };

  const hanldleClose = () => {
    setSelectedEmoji(null);
    setSelectEmojiError(false);
    onClose();
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      onClose={onClose}
      HeaderComponent={
        <>
          <Header
            title={t("add_emoji.select_emoji") || "Select emoji"}
            leftBtn={<Close fill={"black"} />}
            onLeftBtnPress={hanldleClose}
            rightBtn={t("save") || "Save"}
            onRightBtnPress={handleSelectEmoji}
          />
          <View className="flex h-20 flex-row items-center justify-center ">
            {!selectedEmoji && <AddReactionEmoji />}
            {selectedEmoji && (
              <Text className="pt-1 text-center text-5xl">{selectedEmoji}</Text>
            )}
          </View>
        </>
      }
      modalHeight={500}
      FooterComponent={<View className="h-8"></View>}
    >
      <EmojiSelector
        onEmojiSelected={(emoji) => setSelectedEmoji(emoji)}
        category={Categories.emotion}
        columns={12}
      />
    </BottomSheet>
  );
};
export default AddEmojiModal;
