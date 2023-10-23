import { FC } from "react";
import { FlatList, Text, View } from "react-native";
import VideoCallScheduleCard from "../Card/VideoCallScheduleCard/VideoCallScheduleCard";
import EmptySchedule from "../asset/empty-schedule.svg";
import { useTranslation } from "react-i18next";

interface IVideoCallRequestProps {
  requests: any[]; // TODO: replace with proper type when API is ready
}

const EmptyScheduleView = () => {
  const { t } = useTranslation();
  return (
    <View className="flex-1 items-center justify-center">
      <EmptySchedule />
      <Text className="mt-2 text-center font-regular text-base text-gray-dark">
        {t("challenge_detail_screen_tab.coach_calendar.empty_schedule")}
      </Text>
    </View>
  );
};

const VideoCallRequestList: FC<IVideoCallRequestProps> = ({ requests }) => {
  return (
    <>
      {requests.length > 0 ? (
        <FlatList
          data={requests}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <VideoCallScheduleCard request={item} />}
          contentContainerStyle={{ gap: 8 }}
          className="mt-2 flex-1 "
        />
      ) : (
        <EmptyScheduleView />
      )}
    </>
  );
};

export default VideoCallRequestList;
