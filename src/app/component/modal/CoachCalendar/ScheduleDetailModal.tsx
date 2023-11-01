import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Modal,
  SafeAreaView,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
import { MenuProvider } from "react-native-popup-menu";

import dayjs from "../../../utils/date.util";

import { IScheduledTime } from "../../../types/schedule";

import Header from "../../common/Header";
import PopUpMenu from "../../common/PopUpMenu";
import VideoCallScheduleModal from "./VideoCallScheduleModal";

import CloseBtn from "../../asset/close.svg";
import LinkIcon from "../../asset/link.svg";
import { openUrlInApp } from "../../../utils/inAppBrowser";
import EditScheduleModal from "./EditScheduleModal";

interface IScheduleDetailModalProps {
  isVisible: boolean;
  schedule: IScheduledTime;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setLocalSchedules: React.Dispatch<React.SetStateAction<IScheduledTime[]>>;
}

const ScheduleDetailModal: FC<IScheduleDetailModalProps> = ({
  schedule,
  isVisible,
  setIsVisible,
  setLocalSchedules,
}) => {
  const { t } = useTranslation();
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [localSchedule, setLocalSchedule] = useState<IScheduledTime>(schedule);
  const [isEditScheduleModalOpen, setIsEditScheduleModalOpen] =
    useState<boolean>(false);

  const dateTime = new Date(localSchedule.schedule);
  const time = `${dateTime.getHours()}:${dateTime.getMinutes()}`;

  const onClose = () => {
    setIsVisible(false);
  };

  const onEdit = () => {
    setIsEditScheduleModalOpen(true);
  };

  const onDelete = () => {
    setIsEditScheduleModalOpen(true);
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

  useEffect(() => {
    setLocalSchedules((prev: IScheduledTime[]) => {
      return prev.map((item) => {
        if (item.id === localSchedule.id) {
          return localSchedule;
        }
        return item;
      });
    });
  }, [localSchedule]);

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
                <PopUpMenu
                  options={options}
                  iconColor="#000000"
                  optionsContainerStyle={{
                    marginTop: Platform.OS === "ios" ? -(headerHeight - 10) : 0,
                  }}
                />
              }
              containerStyle={Platform.OS === "ios" ? "my-4" : "mt-0"}
            />
          </View>

          <View className="flex-1 gap-2 rounded-[10px] bg-white px-4">
            <View className="flex-row items-center justify-between border-b-[1px] border-b-gray-light py-4">
              <Text className="text-base font-semibold uppercase text-gray-dark">
                {t(
                  "challenge_detail_screen_tab.coach_calendar.request_video_call"
                )}
              </Text>
            </View>
            <View className="flex-row items-start">
              <View className="flex-col">
                <Text className="text-base font-semibold text-primary-default">
                  {t("challenge_detail_screen_tab.coach_calendar.time")}
                </Text>
                <Text className="text-base font-semibold text-black-light">
                  {time}
                </Text>
              </View>
              <View className="ml-16 flex-1 flex-col">
                <Text className="text-base font-semibold text-primary-default">
                  {t("challenge_detail_screen_tab.coach_calendar.date")}
                </Text>
                <Text className="text-base font-semibold text-black-light">
                  {`${dayjs(localSchedule.schedule).format("dddd")}, ${dayjs(
                    localSchedule.schedule
                  ).format("MMMM D, YYYY")}`}
                </Text>
              </View>
            </View>
            <View className="flex-col">
              <Text className="text-base font-semibold text-primary-default">
                {t(
                  "challenge_detail_screen_tab.coach_calendar.link_video_call"
                )}
              </Text>
              <TouchableOpacity
                className="flex flex-row items-center gap-2"
                onPress={() => {
                  openUrlInApp(localSchedule?.meetingUrl);
                }}
              >
                <LinkIcon width={12} height={12} />
                <View className="whitespace-nowrap">
                  <Text className="truncate text-ellipsis text-base font-normal leading-tight text-zinc-500">
                    {localSchedule?.meetingUrl?.length > 50
                      ? `${localSchedule?.meetingUrl?.slice(0, 50)}...`
                      : localSchedule?.meetingUrl}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View className="flex-col">
              <Text className="text-base font-semibold text-primary-default">
                {t("challenge_detail_screen_tab.coach_calendar.note")}
              </Text>
              <Text className="text-base font-normal text-black-light">
                {localSchedule?.note}
              </Text>
            </View>
          </View>
          <EditScheduleModal
            schedule={localSchedule}
            setLocalSchedule={setLocalSchedule}
            isVisible={isEditScheduleModalOpen}
            setIsVisible={setIsEditScheduleModalOpen}
          />
        </SafeAreaView>
      </MenuProvider>
    </Modal>
  );
};

export default ScheduleDetailModal;
