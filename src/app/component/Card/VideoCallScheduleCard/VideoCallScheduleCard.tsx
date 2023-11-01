import { View, Text, TouchableOpacity } from "react-native";
import { useState, FC } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "../../../utils/date.util";

import { IScheduledTime } from "../../../types/schedule";

import ScheduleDetailModal from "../../modal/CoachCalendar/ScheduleDetailModal";

interface IVideoCallScheduleCardProps {
  schedule: IScheduledTime;
  setLocalSchedules: (schedules: IScheduledTime[]) => void;
}

const VideoCallScheduleCard: FC<IVideoCallScheduleCardProps> = ({
  schedule,
  setLocalSchedules,
}) => {
  const { t } = useTranslation();
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);

  const onScheduleCardPress = () => {
    setIsScheduleModalVisible(true);
  };

  const dateTime = new Date(schedule.schedule);
  const time = `${dateTime.getHours()}:${dateTime.getMinutes()}`;

  return (
    <TouchableOpacity
      className="rounded-[10px] bg-white"
      onPress={onScheduleCardPress}
    >
      <View className="px-4">
        <View className="flex-row items-center justify-between border-b-[1px] border-b-gray-light py-4">
          <Text className="text-base font-semibold uppercase text-gray-dark">
            {t("challenge_detail_screen_tab.coach_calendar.request_video_call")}
          </Text>
        </View>
        <View className="my-4 flex-row items-start">
          <View className="flex-col">
            <Text className="text-base font-semibold text-primary-default">
              {t("challenge_detail_screen_tab.coach_calendar.time")}
            </Text>
            <Text className="text-base font-semibold text-black-light">
              {time}
            </Text>
          </View>
          <View className="ml-10 flex-1 flex-col">
            <Text className="text-base font-semibold text-primary-default">
              {t("challenge_detail_screen_tab.coach_calendar.date")}
            </Text>
            <Text className="text-base font-semibold text-black-light">
              {`${dayjs(schedule.schedule).format("dddd")}, ${dayjs(
                schedule.schedule
              ).format("MMMM D, YYYY")}`}
            </Text>
          </View>
        </View>
      </View>
      <ScheduleDetailModal
        schedule={schedule}
        isVisible={isScheduleModalVisible}
        setLocalSchedules={setLocalSchedules}
        setIsVisible={setIsScheduleModalVisible}
      />
    </TouchableOpacity>
  );
};

export default VideoCallScheduleCard;
