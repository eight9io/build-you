import { View, Text, TouchableOpacity } from "react-native";
import { useState, FC } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "../../../utils/date.util";
import ScheduleDetailModal from "../../modal/CoachCalendar/ScheduleDetailModal";
interface IVideoCallScheduleCardProps {
  request: any; // TODO: replace with proper type when API is ready
}

// TODO: Replace mock datetime with request's date and time when API is ready

const VideoCallScheduleCard: FC<IVideoCallScheduleCardProps> = ({
  request,
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
      <View className="px-4">
        <View className="flex-row items-center justify-between border-b-[1px] border-b-gray-light py-4">
          <Text className="text-base font-semibold uppercase text-gray-dark">
            {t("challenge_detail_screen_tab.coach_calendar.request_video_call")}
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
              {`${dayjs().format("HH:mm")} - ${dayjs().format("HH:mm")}`}
            </Text>
          </View>
          <View className="ml-10 flex-1 flex-col">
            <Text className="text-base font-semibold text-primary-default">
              {t("challenge_detail_screen_tab.coach_calendar.date")}
            </Text>
            <Text className="text-base font-semibold text-black-light">
              {`${dayjs().format("dddd")}, \n${dayjs().format("MMMM D, YYYY")}`}
            </Text>
          </View>
        </View>
      </View>
      <ScheduleDetailModal
        isVisible={isScheduleModalVisible}
        setIsVisible={setIsScheduleModalVisible}
      />
    </TouchableOpacity>
  );
};

export default VideoCallScheduleCard;
