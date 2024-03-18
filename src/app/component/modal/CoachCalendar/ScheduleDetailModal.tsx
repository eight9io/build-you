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

import { deleteScheduleForIndividualCertifiedChallenge } from "../../../service/schedule";

import { IScheduledTime } from "../../../types/schedule";

import Header from "../../common/Header";
import PopUpMenu from "../../common/PopUpMenu";

import CloseBtn from "../../asset/close.svg";
import LinkIcon from "../../asset/link.svg";
import EditScheduleModal from "./EditScheduleModal";
import GlobalToastController from "../../common/Toast/GlobalToastController";
import ToastInModal from "../../common/Toast/ToastInModal";
import ConfirmDialog from "../../common/Dialog/ConfirmDialog/ConfirmDialog";
import Toast from "../../common/Toast/Toast";
import { openUrl } from "../../../utils/linking.util";
import GlobalDialogController from "../../common/Dialog/GlobalDialog/GlobalDialogController";

interface IScheduleDetailModalProps {
  isVisible: boolean;
  schedule: IScheduledTime;
  isPastEvents?: boolean;
  isCurrentUserCoachOfChallenge: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setLocalSchedules: React.Dispatch<React.SetStateAction<IScheduledTime[]>>;
}

const ScheduleDetailModal: FC<IScheduleDetailModalProps> = ({
  schedule,
  isVisible,
  setIsVisible,
  isPastEvents = false,
  setLocalSchedules,
  isCurrentUserCoachOfChallenge,
}) => {
  const { t } = useTranslation();
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [localSchedule, setLocalSchedule] = useState<IScheduledTime>(schedule);
  const [isEditScheduleModalOpen, setIsEditScheduleModalOpen] =
    useState<boolean>(false);
  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  const [isEditActionSuccess, setIsEditActionSuccess] = useState<
    boolean | null
  >(null);
  const [isAckModalVisible, setIsAckModalVisible] = useState<boolean>(false);

  const onClose = () => {
    setIsVisible(false);
    setIsAckModalVisible(false);
  };

  const onEdit = () => {
    setIsEditScheduleModalOpen(true);
  };

  const onDelete = async () => {
    try {
      await deleteScheduleForIndividualCertifiedChallenge(schedule.id).then(
        () => {
          onClose();
          GlobalToastController.showModal({
            message: t("toast.delete_schedule_success"),
          });
          setLocalSchedules((prev: IScheduledTime[]) => {
            return prev.filter((item) => item.id !== schedule.id);
          });
        }
      );
    } catch (error) {
      GlobalToastController.showModal({
        message: t("error_general_message"),
      });
      console.error("Error deleting schedule", error);
    }
  };

  const options = [
    {
      text: t("challenge_detail_screen_tab.coach_calendar.edit") || "Edit",
      onPress: onEdit,
    },
    {
      text: t("challenge_detail_screen_tab.coach_calendar.delete") || "Delete",
      onPress: () => setIsAckModalVisible(true),
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

  useEffect(() => {
    if (isEditActionSuccess !== null) {
      setIsToastVisible(true);
    }
  }, [isEditActionSuccess]);

  useEffect(() => {
    if (isToastVisible) {
      setTimeout(() => {
        setIsToastVisible(false);
        setIsEditActionSuccess(null);
      }, 2000);
    }
  }, [isToastVisible]);

  const handleOpenLink = async (url: string) => {
    if (!url) {
      GlobalDialogController.showModal({
        title: t("error"),
        message: t("error_general_message"),
      });
      return;
    }
    try {
      await openUrl(url);
    } catch (error) {
      GlobalDialogController.showModal({
        title: t("error"),
        message: t("error_general_message"),
      });
    }
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={isVisible}
      className="h-full"
    >
      <SafeAreaView className="flex-1 ">
        <ToastInModal
          isVisible={isToastVisible}
          setIsVisible={setIsToastVisible}
          message={
            isEditActionSuccess
              ? t("toast.edit_schedule_success")
              : t("error_general_message")
          }
        />
        <ConfirmDialog
          title={t(
            "challenge_detail_screen_tab.coach_calendar.delete_schedule_confirm"
          )}
          description={t(
            "challenge_detail_screen_tab.coach_calendar.delete_schedule_des"
          )}
          isVisible={isAckModalVisible}
          onConfirm={onDelete}
          confirmButtonLabel={t("dialog.delete")}
          confirmButtonColor="red"
          onClosed={() => setIsAckModalVisible(false)}
          closeButtonLabel={t("close")}
        />
        <MenuProvider skipInstanceCheck>
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
                isCurrentUserCoachOfChallenge &&
                !isPastEvents && (
                  <PopUpMenu
                    options={options}
                    iconColor="#000000"
                    optionsContainerStyle={{
                      marginTop:
                        Platform.OS === "ios" ? -(headerHeight - 10) : 0,
                    }}
                  />
                )
              }
            />
          </View>

          <View className="mt-6 flex-1 rounded-[10px] bg-white px-4">
            <View className="flex-row items-start">
              <View className="flex-col">
                <Text className="text-base font-semibold text-primary-default">
                  {t("challenge_detail_screen_tab.coach_calendar.time")}
                </Text>
                <Text className="text-base font-semibold text-black-light">
                  {`${dayjs(localSchedule.schedule).format("hh:mm A")}`}
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
            <View className="flex-col py-2">
              <Text className="text-base font-semibold text-primary-default">
                {t(
                  "challenge_detail_screen_tab.coach_calendar.link_video_call"
                )}
              </Text>
              <TouchableOpacity
                className="flex flex-row items-center gap-2"
                onPress={() => handleOpenLink(localSchedule?.meetingUrl)}
              >
                <LinkIcon width={12} height={12} />
                <View className="whitespace-nowrap">
                  <Text className="truncate text-ellipsis text-base font-normal leading-tight text-blue-500">
                    {localSchedule?.meetingUrl?.length > 35
                      ? `${localSchedule?.meetingUrl?.slice(0, 35)}...`
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
            setIsEditActionSuccess={setIsEditActionSuccess}
          />
        </MenuProvider>
      </SafeAreaView>
    </Modal>
  );
};

export default ScheduleDetailModal;
