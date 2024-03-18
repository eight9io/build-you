import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { View, Text, TouchableOpacity } from "react-native";

import { IUserData } from "../../types/user";
import { IChallenge } from "../../types/challenge";
import { IScheduledTime } from "../../types/schedule";
import { COACH_CALENDAR_TABS_KEY } from "../../common/enum";

import { useTabIndex } from "../../hooks/useTabIndex";
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
import EditScheduleLinkModal from "../modal/CoachCalendar/EditScheduleLinkModal";
import { serviceUpdateCalendlyLink } from "../../service/profile";
import GlobalToastController from "../common/Toast/GlobalToastController";
import { openUrl } from "../../utils/linking.util";
import GlobalDialogController from "../common/Dialog/GlobalDialog/GlobalDialogController";

interface IIndividualCoachCalendarTabProps {
  coachData: IUserData;
  challengeData: IChallenge;
  isChallengeInProgress: boolean;
}

interface IBookVideoCallBtnProps {
  translate: (key: string) => string;
  isChallengeInProgress?: boolean;
  coachCalendyLink?: string;
  setCoachCalendyLink?: React.Dispatch<React.SetStateAction<string>>;
}

interface IScheduleLinkProps {
  link: string;
  coachId: string;
  translate: (key: string) => string;
  setCoachCalendyLink: React.Dispatch<React.SetStateAction<string>>;
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
  setCoachCalendyLink,
}) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
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
          setCoachCalendyLink={setCoachCalendyLink}
        />
      </View>
    </View>
  );
};

const ScheduleLink: FC<IScheduleLinkProps> = ({
  translate,
  coachId,
  link,
  setCoachCalendyLink,
}) => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const onEditScheduleLink = () => {
    setIsModalVisible(true);
  };
  const onDeleteScheduleLink = async () => {
    try {
      await serviceUpdateCalendlyLink({
        userId: coachId,
        calendlyLink: "",
      });
      setCoachCalendyLink("");
      GlobalToastController.showModal({
        message: "Delete schedule link successfully",
      });
    } catch (error) {
      GlobalToastController.showModal({
        message: translate("error_general_message"),
      });
      console.error(error);
    }
  };

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
    <View className="m-4 flex flex-col items-start justify-start rounded-lg bg-white p-4 shadow">
      <View className="flex w-full flex-row items-center justify-between">
        <Text className=" text-md font-semibold leading-tight text-neutral-700">
          {translate("create_schedule_modal.schedule_link")}
        </Text>
        <PopUpMenu
          iconColor="#6C6E76"
          options={[
            {
              text: translate("pop_up_menu.edit") as string,
              onPress: onEditScheduleLink,
            },
            {
              text: translate("pop_up_menu.delete") as string,
              onPress: onDeleteScheduleLink,
            },
          ]}
        />
      </View>

      <View className="my-3 h-px self-stretch border border-slate-200"></View>
      <TouchableOpacity
        className="flex flex-row items-center gap-2"
        onPress={() => handleOpenLink(link)}
      >
        <LinkIcon width={12} height={12} />
        <View className="whitespace-nowrap">
          <Text className="truncate text-ellipsis text-sm font-normal leading-tight text-zinc-500">
            {link?.slice(0, 40)}...
          </Text>
        </View>
      </TouchableOpacity>
      <EditScheduleLinkModal
        link={link}
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        setCoachCalendyLink={setCoachCalendyLink}
      />
    </View>
  );
};

export const IndividualCoachCalendarTab: FC<
  IIndividualCoachCalendarTabProps
> = ({ coachData, challengeData, isChallengeInProgress }) => {
  const [upcomingSchedules, setUpcomingSchedules] = useState<IScheduledTime[]>(
    []
  );
  const [pastSchedules, setPastSchedules] = useState<IScheduledTime[]>([]);
  const [
    isCoachCreateScheduleModalVisible,
    setIsCoachCreateScheduleModalVisible,
  ] = useState<boolean>(false);
  const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);
  const [coachCalendyLink, setCoachCalendyLink] = useState<string>("");

  const { t } = useTranslation();
  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();
  const isCurrentUserCoachOfChallenge = coachData.id === currentUser?.id;

  const challengeId = challengeData.id;
  const isChallengeCompleted =
    challengeData.status === "done" || challengeData.status === "closed";

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
      const upcompingSchedule: IScheduledTime[] = [];
      const pastSchedule: IScheduledTime[] = [];

      response.data.forEach((schedule: any) => {
        const scheduleDate = new Date(schedule.schedule);
        if (scheduleDate > now) {
          upcompingSchedule.push(schedule);
        } else if (scheduleDate < now) {
          pastSchedule.push(schedule);
        }
      });
      const sortedUpcomingSchedule = upcompingSchedule.sort(
        (a: IScheduledTime, b: IScheduledTime) => {
          return (
            new Date(a.schedule).getTime() - new Date(b.schedule).getTime()
          );
        }
      );
      const sortedPastSchedule = pastSchedule.sort(
        (a: IScheduledTime, b: IScheduledTime) => {
          return (
            new Date(b.schedule).getTime() - new Date(a.schedule).getTime()
          );
        }
      );
      setUpcomingSchedules(sortedUpcomingSchedule);
      setPastSchedules(sortedPastSchedule);
    } catch (error) {
      console.error("Failed to get schedule of challenge", error);
    }
  };

  useEffect(() => {
    getAllScheduleOfChallenge();
  }, []);

  useEffect(() => {
    setCoachCalendyLink(coachData?.calendly);
  }, [coachData?.calendly]);

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
            <ScheduleTab
              schedules={upcomingSchedules}
              shouldParentRefresh={shouldRefresh}
              setShouldParentRefresh={setShouldRefresh}
              isCurrentUserCoachOfChallenge={isCurrentUserCoachOfChallenge}
            />
          </View>
        );
      case COACH_CALENDAR_TABS_KEY.PAST:
        return (
          <View className="flex-1">
            <ScheduleTab
              isPastEvents={true}
              schedules={pastSchedules}
              shouldParentRefresh={shouldRefresh}
              setShouldParentRefresh={setShouldRefresh}
              isCurrentUserCoachOfChallenge={isCurrentUserCoachOfChallenge}
            />
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
      {!isCurrentUserCoachOfChallenge &&
        coachCalendyLink &&
        upcomingSchedules?.length == 0 && (
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
              setCoachCalendyLink={setCoachCalendyLink}
              isChallengeInProgress={isChallengeInProgress}
            />
          </View>
        ) : (
          <ScheduleLink
            translate={t}
            coachId={coachData?.id}
            link={coachCalendyLink}
            setCoachCalendyLink={setCoachCalendyLink}
          />
        ))}
      <View className="flex-1 p-4">
        <TagBasedTabView
          routes={tabRoutes}
          renderScene={renderScene}
          index={index}
          setIndex={setTabIndex}
        />
      </View>
      {isCurrentUserCoachOfChallenge &&
        !isChallengeCompleted &&
        coachCalendyLink &&
        isChallengeInProgress && (
          <View className={clsx("absolute bottom-4 h-12 w-full bg-white px-6")}>
            <Button
              title={t("create_schedule_modal.title")}
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
