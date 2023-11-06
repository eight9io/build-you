import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View, Text } from "react-native";

import { IScheduledTime } from "../../types/schedule";

import VideoCallScheduleCard from "../Card/VideoCallScheduleCard/VideoCallScheduleCard";

import EmptySchedule from "../asset/empty-schedule.svg";

interface IScheduleTabProps {
  schedules: IScheduledTime[];
  isPastEvents?: boolean;
  isCurrentUserCoachOfChallenge: boolean;
}

export const EmptyScheduleView = () => {
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

const ScheduleTab: FC<IScheduleTabProps> = ({
  schedules,
  isPastEvents = false,
  isCurrentUserCoachOfChallenge,
}) => {
  const [localSchedules, setLocalSchedules] =
    useState<IScheduledTime[]>(schedules);

  useEffect(() => {
    setLocalSchedules(schedules);
  }, [schedules]);

  return (
    <View className="flex-1">
      <>
        {localSchedules?.length > 0 ? (
          <FlatList
            data={localSchedules}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <VideoCallScheduleCard
                schedule={item}
                isPastEvents={isPastEvents}
                setLocalSchedules={setLocalSchedules}
                isCurrentUserCoachOfChallenge={isCurrentUserCoachOfChallenge}
              />
            )}
            contentContainerStyle={{ gap: 8 }}
            className="mt-2 flex-1 "
            ListFooterComponent={<View className="h-20" />}
          />
        ) : (
          <EmptyScheduleView />
        )}
      </>
    </View>
  );
};

export default ScheduleTab;
