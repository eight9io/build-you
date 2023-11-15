import { View, Text, TouchableOpacity } from "react-native";
import { useState, FC } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "../../../utils/date.util";

import { IScheduledTime } from "../../../types/schedule";

import ScheduleDetailModal from "../../modal/CoachCalendar/ScheduleDetailModal";
import { openUrlInApp } from "../../../utils/inAppBrowser";

import LinkIcon from "../../../component/asset/link.svg";

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
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);

  const onScheduleCardPress = () => {
    setIsScheduleModalVisible(true);
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
        <View className="flex-row justify-end items-center gap-2 py-2">
          <LinkIcon width={12} height={12} />
          <View className="whitespace-nowrap">
            <Text className="truncate text-ellipsis text-sm font-normal leading-tight text-zinc-500">
              Link
            </Text>
          </View>
        </View>
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
