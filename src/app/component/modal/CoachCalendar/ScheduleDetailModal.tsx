import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Modal,
  SafeAreaView,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
import Header from "../../common/Header";
import CloseBtn from "../../asset/close.svg";
import dayjs from "../../../utils/date.util";
import PopUpMenu from "../../common/PopUpMenu";
import { MenuProvider } from "react-native-popup-menu";
import VideoCallScheduleModal, {
  VideoCallScheduleAction,
} from "./VideoCallScheduleModal";
import { set } from "react-native-reanimated";

interface IScheduleDetailModalProps {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ScheduleDetailModal: FC<IScheduleDetailModalProps> = ({
  isVisible,
  setIsVisible,
}) => {
  const { t } = useTranslation();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [scheduleModalData, setScheduleModalData] = useState<{
    action: VideoCallScheduleAction;
    uri: string;
  }>({
    action: VideoCallScheduleAction.BOOK,
    uri: "https://calendly.com/khangduong0902/test1?utm_source=testChallengeId&hide_event_type_details=1",
  });

  const onClose = () => {
    setIsVisible(false);
  };

  const onEdit = () => {
    setIsScheduleModalVisible(true);
    setScheduleModalData({
      action: VideoCallScheduleAction.RESCHEDULE,
      uri: "https://calendly.com/reschedulings/3bf95c3e-5bd3-4a78-ae96-7119db433f70",
    });
  };

  const onDelete = () => {
    setIsScheduleModalVisible(true);
    setScheduleModalData({
      action: VideoCallScheduleAction.CANCEL,
      uri: "https://calendly.com/cancellations/3bf95c3e-5bd3-4a78-ae96-7119db433f70",
    });
  };

  const options = [
    {
      text: t("challenge_detail_screen_tab.coach_calendar.edit") || "Edit",
      onPress: onEdit,
    },
    {
      text: t("challenge_detail_screen_tab.coach_calendar.delete") || "Delete",
      onPress: onDelete,
    },
  ];

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={isVisible}
      className="h-full"
    >
      <MenuProvider skipInstanceCheck>
        <SafeAreaView className="flex-1 ">
          <View
            className="px-4"
            onLayout={({ nativeEvent }) => {
              const { height } = nativeEvent.layout;
              setHeaderHeight(height);
            }}
          >
            <Header
              title={
                t(
                  "challenge_detail_screen_tab.coach_calendar.schedule_detail_modal_title"
                ) || ("Detail" as string)
              }
              leftBtn={<CloseBtn fill={"black"} />}
              onLeftBtnPress={onClose}
              rightBtn={
                <TouchableOpacity
                  onPress={() => {
                    console.log("onPress: ");
                  }}
                >
                  <PopUpMenu
                    options={options}
                    iconColor="#000000"
                    optionsContainerStyle={{
                      marginTop:
                        Platform.OS === "ios" ? -(headerHeight / 2) : 0,
                    }}
                  />
                </TouchableOpacity>
              }
              containerStyle={Platform.OS === "ios" ? "my-4" : "mt-0"}
            />
          </View>

          <View className="bg-red flex-1">
            <View className="rounded-[10px] bg-white">
              <View className="px-4">
                <View className="flex-row items-center justify-between border-b-[1px] border-b-gray-light py-4">
                  <Text className="text-base font-semibold uppercase text-gray-dark">
                    {t(
                      "challenge_detail_screen_tab.coach_calendar.request_video_call"
                    )}
                  </Text>
                  <View className="rounded-[36px] bg-success-10 px-5 py-0.5">
                    <Text className="text-base font-semibold text-success-default">
                      Approve
                    </Text>
                  </View>
                </View>
                <View className="my-4 flex-row items-start">
                  <View className="flex-col">
                    <Text className="text-base font-semibold text-primary-default">
                      {t("challenge_detail_screen_tab.coach_calendar.time")}
                    </Text>
                    <Text className="text-base font-semibold text-black-light">
                      {`${dayjs().format("HH:mm")} - ${dayjs().format(
                        "HH:mm"
                      )}`}
                    </Text>
                  </View>
                  <View className="ml-10 flex-1 flex-col">
                    <Text className="text-base font-semibold text-primary-default">
                      {t("challenge_detail_screen_tab.coach_calendar.date")}
                    </Text>
                    <Text className="text-base font-semibold text-black-light">
                      {`${dayjs().format("dddd")}, \n${dayjs().format(
                        "MMMM D, YYYY"
                      )}`}
                    </Text>
                  </View>
                </View>
                <View>
                  <View className="flex-col">
                    <Text className="text-base font-semibold text-primary-default">
                      {t("challenge_detail_screen_tab.coach_calendar.note")}
                    </Text>
                    <Text className="text-base font-normal text-black-light">
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Cum repellendus laborum cumque nulla delectus, praesentium
                      provident vitae beatae, fuga dicta distinctio, quas soluta
                      totam atque tenetur excepturi. Et, eveniet ad.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <VideoCallScheduleModal
            isVisible={isScheduleModalVisible}
            setIsVisible={setIsScheduleModalVisible}
            action={scheduleModalData.action}
            uri={scheduleModalData.uri}
          />
        </SafeAreaView>
      </MenuProvider>
    </Modal>
  );
};

export default ScheduleDetailModal;
