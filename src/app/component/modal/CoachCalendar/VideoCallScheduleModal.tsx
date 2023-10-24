import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { View, Modal, SafeAreaView, Platform } from "react-native";
import WebView from "react-native-webview";
import Header from "../../common/Header";
import CloseBtn from "../../asset/close.svg";
export enum VideoCallScheduleAction {
  BOOK = "book",
  RESCHEDULE = "reschedule",
  CANCEL = "cancel",
}

interface IVideoCallScheduleModalProps {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  action: VideoCallScheduleAction;
  uri: string;
}

const VideoCallScheduleModal: FC<IVideoCallScheduleModalProps> = ({
  isVisible,
  setIsVisible,
  action,
  uri,
}) => {
  const { t } = useTranslation();

  const onClose = () => {
    setIsVisible(false);
  };

  const headerTitle = () => {
    switch (action) {
      case VideoCallScheduleAction.BOOK:
        return (
          t("challenge_detail_screen_tab.coach_calendar.book_video_call") ||
          ("Book video call" as string)
        );
      case VideoCallScheduleAction.RESCHEDULE:
        return (
          t(
            "challenge_detail_screen_tab.coach_calendar.reschedule_video_call"
          ) || ("Reschedule video call" as string)
        );
      case VideoCallScheduleAction.CANCEL:
        return (
          t("challenge_detail_screen_tab.coach_calendar.cancel_video_call") ||
          ("Cancel video call" as string)
        );
    }
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={isVisible}
      className="h-full"
    >
      <SafeAreaView className="flex-1 bg-white">
        <View className="px-4">
          <Header
            title={headerTitle()}
            leftBtn={<CloseBtn fill={"black"} />}
            onLeftBtnPress={onClose}
            containerStyle={Platform.OS === "ios" ? "my-4" : "mt-0"}
          />
        </View>
        <View className="bg-red flex-1">
          <WebView
            source={{
              uri,
            }}
            startInLoadingState={true}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default VideoCallScheduleModal;
