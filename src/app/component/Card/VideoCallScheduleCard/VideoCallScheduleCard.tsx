import { View, Text, TouchableOpacity } from "react-native";
import { useState, FC } from "react";
import { EvilIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import dayjs from "../../../utils/date.util";

import { IScheduledTime } from "../../../types/schedule";

import { onCopyLink } from "../../../utils/shareLink.util";

import ScheduleDetailModal from "../../modal/CoachCalendar/ScheduleDetailModal";

import LinkSvg from "../../../component/asset/link.svg";
import GlobalDialogController from "../../common/Dialog/GlobalDialog/GlobalDialogController";
import { openUrlInApp } from "../../../utils/inAppBrowser";

interface IVideoCallScheduleCardProps {
  schedule: IScheduledTime;
  isPastEvents: boolean;
  isCurrentUserCoachOfChallenge: boolean;
  setLocalSchedules: (schedules: IScheduledTime[]) => void;
}

const VideoCallScheduleCard: FC<IVideoCallScheduleCardProps> = ({
  schedule,
  isPastEvents,
  setLocalSchedules,
  isCurrentUserCoachOfChallenge,
}) => {
  const { t } = useTranslation();
  const { meetingUrl } = schedule;
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);

  const onScheduleCardPress = () => {
    setIsScheduleModalVisible(true);
  };

  const handleOpenLink = async () => {
    if (!meetingUrl) {
      GlobalDialogController.showModal({
        title: t("error"),
        message: t("error_general_message"),
      });
      return;
    }
    openUrlInApp(meetingUrl);
  };

  return (
    <TouchableOpacity
      className="rounded-[10px] bg-white"
      onPress={onScheduleCardPress}
    >
      <View className="px-4 py-2">
        <View className="flex-row items-center justify-between border-b-[1px] border-b-gray-light py-2">
          <Text className="text-md font-medium text-primary-default">
            {t("challenge_detail_screen_tab.coach_calendar.schedule")}
          </Text>
        </View>
        <View className=" flex-row items-center justify-between py-2">
          <Text className="text-md font-semibold text-black-light">{`${dayjs(
            schedule?.schedule
          ).format("hh:mm A")}`}</Text>
          <Text className="text-md font-semibold text-gray-dark">
            {`${dayjs(schedule?.schedule).format("dddd")}, ${dayjs(
              schedule?.schedule
            ).format("MMMM D, YYYY")}`}
          </Text>
        </View>
        <View className="flex flex-row items-center justify-between self-stretch pt-3">
          <View className="inline-flex flex-col items-start justify-start gap-1">
            <Text className="text-md font-semibold leading-snug text-zinc-500">
              {t("challenge_detail_screen.open_meeting")}
            </Text>
          </View>
          <TouchableOpacity
            className="flex flex-row items-center justify-end gap-1 p-1"
            onPress={() => onCopyLink(meetingUrl)}
          >
            <LinkSvg />
            <Text className="text-right text-md font-normal leading-tight text-blue-600">
              {t("challenge_detail_screen.copy")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex flex-row items-center justify-end gap-1 p-1"
            onPress={handleOpenLink}
          >
            <EvilIcons name="external-link" size={20} color="#2563eb" />
            <Text className="text-right text-md font-normal leading-tight text-blue-600">
              {t("challenge_detail_screen.open_link")}
            </Text>
          </TouchableOpacity>
        </View>
        {schedule?.note && (
          <View className="flex flex-row items-center justify-between self-stretch pt-3 ">
            <View className="inline-flex flex-col items-start justify-start gap-1">
              <Text className="text-md font-semibold leading-snug text-zinc-500">
                {t("challenge_detail_screen.note")}
              </Text>
            </View>
            <View className="w-48">
              <Text className="text-left text-md font-normal leading-tight text-black-light ">
                {schedule?.note}
              </Text>
            </View>
          </View>
        )}
      </View>
      <ScheduleDetailModal
        schedule={schedule}
        isPastEvents={isPastEvents}
        isVisible={isScheduleModalVisible}
        setLocalSchedules={setLocalSchedules}
        setIsVisible={setIsScheduleModalVisible}
        isCurrentUserCoachOfChallenge={isCurrentUserCoachOfChallenge}
      />
    </TouchableOpacity>
  );
};

export default VideoCallScheduleCard;
