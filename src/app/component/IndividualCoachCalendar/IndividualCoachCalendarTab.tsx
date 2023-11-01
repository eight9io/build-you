import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { View, Text, TouchableOpacity } from "react-native";

import { IUserData } from "../../types/user";
import { IScheduledTime } from "../../types/schedule";
import { COACH_CALENDAR_TABS_KEY } from "../../common/enum";

import { useTabIndex } from "../../hooks/useTabIndex";
import { openUrlInApp } from "../../utils/inAppBrowser";
import { useUserProfileStore } from "../../store/user-store";

import { getAllScheduleByChallengeId } from "../../service/schedule";

import ScheduleTab from "./ScheduleTab";
import PopUpMenu from "../common/PopUpMenu";
import Button from "../common/Buttons/Button";
import TagBasedTabView from "../common/Tab/TagBasedTabView";
import VideoCallScheduleModal, {
  VideoCallScheduleAction,
} from "../modal/CoachCalendar/VideoCallScheduleModal";
import AddScheduleLinkModal from "../modal/CoachCalendar/AddScheduleLinkModal";
import CoachCreateScheduleModal from "../modal/CoachCalendar/CoachCreateScheduleModal";

import LinkIcon from "../../component/asset/link.svg";

interface IIndividualCoachCalendarTabProps {
  coachData: IUserData;
  challengeId: string;
  isChallengeInProgress: boolean;
}

interface IBookVideoCallBtnProps {
  translate: (key: string) => string;
  isChallengeInProgress?: boolean;
  coachCalendyLink?: string;
}

interface IScheduleLinkProps {
  link: string;
}

const BookVideoCallBtn: FC<IBookVideoCallBtnProps> = ({
  translate,
  isChallengeInProgress,
  coachCalendyLink,
}) => {
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
            translate(
              "challenge_detail_screen_tab.coach_calendar.book_video_call_btn"
            ) as string
          }
          onPress={() => setIsModalVisible(true)}
          isDisabled={!isChallengeInProgress}
        />
        <VideoCallScheduleModal
          isVisible={isModalVisible}
          setIsVisible={setIsModalVisible}
          action={VideoCallScheduleAction.BOOK}
          uri={coachCalendyLink}
        />
      </View>
    </View>
  );
};

const AddScheduleLinkBtn: FC<IBookVideoCallBtnProps> = ({
  translate,
  isChallengeInProgress,
}) => {
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
            translate(
              "challenge_detail_screen_tab.coach_calendar.add_schedule_link_btn"
            ) as string
          }
          onPress={() => setIsModalVisible(true)}
          isDisabled={!isChallengeInProgress}
        />
        <AddScheduleLinkModal
          isVisible={isModalVisible}
          setIsVisible={setIsModalVisible}
        />
      </View>
    </View>
  );
};

const ScheduleLink: FC<IScheduleLinkProps> = ({ link }) => {
  const onEditScheduleLink = () => {};

  const onDeleteScheduleLink = () => {};

  return (
    <View className="m-4 flex flex-col items-start justify-start rounded-lg bg-white p-4 shadow">
      <View className="flex w-full flex-row items-center justify-between">
        <Text className=" text-md font-semibold leading-tight text-neutral-700">
          Schedule link
        </Text>
        <PopUpMenu
          iconColor="#6C6E76"
          options={[
            {
              text: "Edit",
              onPress: onEditScheduleLink,
            },
            {
              text: "Delete",
              onPress: onDeleteScheduleLink,
            },
          ]}
        />
      </View>

      <View className="my-3 h-px self-stretch border border-slate-200"></View>
      <TouchableOpacity
        className="flex flex-row items-center gap-2"
        onPress={() => openUrlInApp(link)}
      >
        <LinkIcon width={12} height={12} />
        <View className="whitespace-nowrap">
          <Text className="truncate text-ellipsis text-sm font-normal leading-tight text-zinc-500">
            {link?.slice(0, 40)}...
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export const IndividualCoachCalendarTab: FC<
  IIndividualCoachCalendarTabProps
> = ({ coachData, challengeId, isChallengeInProgress }) => {
  const [upcomingSchedules, setUpcomingSchedules] = useState<IScheduledTime[]>(
    []
  );
  const [pastSchedules, setPastSchedules] = useState<IScheduledTime[]>([]);
  const [
    isCoachCreateScheduleModalVisible,
    setIsCoachCreateScheduleModalVisible,
  ] = useState<boolean>(false);
  const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);

  const { t } = useTranslation();
  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();
  const isCurrentUserCoachOfChallenge = coachData.id === currentUser?.id;
  const coachCalendyLink = coachData?.calendly;

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
  const getAllScheduleOfChallenge = async () => {
    try {
      const response = await getAllScheduleByChallengeId(challengeId);
      const now = new Date();
      const upcompingSchedule = [];
      const pastSchedule = [];

      response.data.forEach((schedule: any) => {
        const scheduleDate = new Date(schedule.schedule);
        if (scheduleDate > now) {
          upcompingSchedule.push(schedule);
        } else if (scheduleDate < now) {
          pastSchedule.push(schedule);
        }
      });

      setUpcomingSchedules(upcompingSchedule);
      setPastSchedules(pastSchedule);
    } catch (error) {
      console.error("Failed to get schedule of challenge", error);
    }
  };

  useEffect(() => {
    getAllScheduleOfChallenge();
  }, []);

  useEffect(() => {
    if (shouldRefresh) {
      getAllScheduleOfChallenge();
      setShouldRefresh(false);
    }
  }, [shouldRefresh]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case COACH_CALENDAR_TABS_KEY.UPCOMING:
        return (
          <View className="flex-1">
            <ScheduleTab schedules={upcomingSchedules} />
          </View>
        );
      case COACH_CALENDAR_TABS_KEY.PAST:
        return (
          <View className="flex-1">
            <ScheduleTab schedules={pastSchedules} />
          </View>
        );
    }
  };

  return (
    <View className="h-full flex-1">
      <CoachCreateScheduleModal
        challengeId={challengeId}
        setShouldParentRefresh={setShouldRefresh}
        isVisible={isCoachCreateScheduleModalVisible}
        setIsVisible={setIsCoachCreateScheduleModalVisible}
      />
      {!isCurrentUserCoachOfChallenge && coachCalendyLink && (
        <View>
          <BookVideoCallBtn
            translate={t}
            isChallengeInProgress={isChallengeInProgress}
            coachCalendyLink={coachCalendyLink}
          />
        </View>
      )}
      {isCurrentUserCoachOfChallenge &&
        (!coachCalendyLink ? (
          <View>
            <AddScheduleLinkBtn
              translate={t}
              isChallengeInProgress={isChallengeInProgress}
            />
          </View>
        ) : (
          <ScheduleLink link={coachCalendyLink} />
        ))}
      <View className="m-4 flex-1">
        <TagBasedTabView
          routes={tabRoutes}
          renderScene={renderScene}
          index={index}
          setIndex={setTabIndex}
        />
      </View>
      {isCurrentUserCoachOfChallenge && (
        <View className={clsx("absolute bottom-4 h-12 w-full bg-white px-6")}>
          <Button
            title={"Create schedule"}
            onPress={() => setIsCoachCreateScheduleModalVisible(true)}
            containerClassName="bg-primary-default flex-1"
            textClassName="text-white"
          />
        </View>
      )}
    </View>
  );
};

export default React.memo(IndividualCoachCalendarTab);
