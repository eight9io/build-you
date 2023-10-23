import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useIsFocused } from "@react-navigation/native";

import Spinner from "react-native-loading-spinner-overlay";
import Button from "../common/Buttons/Button";
import TagBasedTabView from "../common/Tab/TagBasedTabView";
import { useTabIndex } from "../../hooks/useTabIndex";
import { COACH_CALENDAR_TABS_KEY } from "../../common/enum";
import VideoCallScheduleModal, {
  VideoCallScheduleAction,
} from "../modal/CoachCalendar/VideoCallScheduleModal";
import UpcomingRequestTab from "./UpcomingRequestTab";
import PastRequestTab from "./PastRequestTab";
interface IIndividualCoachCalendarTabProps {
  isCoach: boolean;
}

export const IndividualCoachCalendarTab: FC<
  IIndividualCoachCalendarTabProps
> = ({ isCoach }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const isFocused = useIsFocused();
  const tabRoutes = [
    {
      key: COACH_CALENDAR_TABS_KEY.UPCOMING,
      title: t("challenge_detail_screen_tab.coach_calendar.upcoming"),
    },
    {
      key: COACH_CALENDAR_TABS_KEY.PAST,
      title: t("challenge_detail_screen_tab.coach_calendar.past"),
    },
  ];
  const { index, setTabIndex } = useTabIndex({ tabRoutes });

  const BookVideoCallBtn = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    return (
      <View className="pt-4">
        <View className="mx-4 ">
          <Button
            containerClassName="bg-primary-default flex-none px-1"
            textClassName="line-[30px] text-center text-md font-medium text-white ml-2"
            disabledContainerClassName="bg-gray-light flex-none px-1"
            disabledTextClassName="line-[30px] text-center text-md font-medium text-gray-medium ml-2"
            title={
              t(
                "challenge_detail_screen_tab.coach_calendar.book_video_call_btn"
              ) as string
            }
            onPress={() => setIsModalVisible(true)}
          />
          <VideoCallScheduleModal
            isVisible={isModalVisible}
            setIsVisible={setIsModalVisible}
            action={VideoCallScheduleAction.BOOK}
            uri={
              "https://calendly.com/khangduong0902/test1?utm_source=testChallengeId&hide_event_type_details=1"
            }
          />
        </View>
      </View>
    );
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case COACH_CALENDAR_TABS_KEY.UPCOMING:
        return (
          <View className="flex-1">
            <UpcomingRequestTab requests={[1, 2, 3, 4, 5]} />
          </View>
        );
      case COACH_CALENDAR_TABS_KEY.PAST:
        return (
          <View className="flex-1">
            <PastRequestTab requests={[1, 2]} />
          </View>
        );
    }
  };

  return (
    <View className="h-full flex-1">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {!isCoach ? (
            <View>
              <BookVideoCallBtn />
            </View>
          ) : null}
          <View className="m-4 flex-1">
            <TagBasedTabView
              routes={tabRoutes}
              renderScene={renderScene}
              index={index}
              setIndex={setTabIndex}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default React.memo(IndividualCoachCalendarTab);
