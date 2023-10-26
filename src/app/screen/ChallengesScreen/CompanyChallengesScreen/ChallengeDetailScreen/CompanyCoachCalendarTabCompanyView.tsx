import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

import { openUrlInApp } from "../../../../utils/inAppBrowser";

import LinkSvg from "./assets/link.svg";
import EmptySvg from "./assets/emptyFollow.svg";
import Button from "../../../../component/common/Buttons/Button";
import { ICertifiedChallengeState } from "../../../../types/challenge";
import {
  createVoteScheduleVideoCall,
  getAllScheduleVideoCall,
} from "../../../../service/schedule";
import { getInprogressState } from "./CompanyCoachCalendarTabCoachView";

import {
  IProposedScheduleTime,
  IProposingScheduleTime,
} from "../../../../types/schedule";
import { useErrorModal } from "../../../../hooks/useErrorModal";
import ErrorDialog from "../../../../component/common/Dialog/ErrorDialog";
import GlobalToastController from "../../../../component/common/Toast/GlobalToastController";

interface IProposedTimeTag {
  translate: (key: string) => string;
  item: IProposedScheduleTime;
  index: number;
  isSelected: boolean;
  setSelectedOption: (item: IProposedScheduleTime) => void;
}

const EmptyVideoCall = ({ translate }) => {
  return (
    <View className="my-2 rounded-xl bg-white">
      <View className="flex flex-row items-center justify-center gap-4 p-4">
        <EmptySvg />
        <Text className="w-52 text-md font-normal leading-tight text-zinc-500 opacity-90">
          {translate("challenge_detail_screen.empty_confirmed_time")}
        </Text>
      </View>
    </View>
  );
};

const ConfirmedRequestedCall = ({
  translate,
  confirmedOption,
}: {
  translate: (key: string) => string;
  confirmedOption: IProposedScheduleTime;
}) => {
  const url = "https://meet.google.com/abc-defg-hij";

  const handleOpenLink = async () => {
    openUrlInApp(url);
  };

  const dateTimeObject = new Date(confirmedOption.proposal);

  return (
    <View className="my-4 flex-col items-start justify-start rounded-lg bg-white p-4 shadow-sm">
      <View className="inline-flex items-start justify-between self-stretch">
        <Text className="text-md font-semibold leading-tight text-green-500">
          {translate("challenge_detail_screen.confirmed")}
        </Text>
      </View>
      <View className="my-2 h-px self-stretch border border-slate-100"></View>
      <View className="flex flex-row items-end justify-between self-stretch">
        <View className="inline-flex flex-col items-start justify-start gap-1">
          <Text className="text-md font-semibold leading-snug text-zinc-800">
            {dateTimeObject.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        <View className="inline-flex flex-col items-start justify-start gap-1">
          <Text className=" w-52 text-right text-md font-semibold leading-tight text-zinc-500">
            {dateTimeObject.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>
      </View>
      <View className="flex flex-row items-end justify-between self-stretch pt-3">
        <View className="inline-flex flex-col items-start justify-start gap-1">
          <Text className="text-md font-semibold leading-snug text-zinc-500">
            {translate("challenge_detail_screen.open_meeting")}
          </Text>
        </View>
        <TouchableOpacity
          className="flex flex-row items-center justify-end gap-1 p-1"
          onPress={handleOpenLink}
        >
          <LinkSvg />
          <Text className="text-right text-md font-normal leading-tight text-blue-600">
            {translate("challenge_detail_screen.link")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const EmptyProposingTime = ({
  translate,
}: {
  translate: (key: string) => string;
}) => {
  return (
    <View className="my-2 pt-16">
      <View className="flex flex-col items-center justify-center gap-4 p-4">
        <EmptySvg />
        <Text className="w-56 text-center text-md font-normal leading-tight text-zinc-500 opacity-90">
          {translate("challenge_detail_screen.empty_proposing_time")}
        </Text>
      </View>
    </View>
  );
};

const ProposedTimeTag: FC<IProposedTimeTag> = ({
  translate,
  item,
  index,
  isSelected,
  setSelectedOption,
}) => {
  const dateTimeObject = new Date(item?.proposal);

  const time = dateTimeObject.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const date = dateTimeObject.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <TouchableOpacity
      className={clsx(
        "my-2 flex-col items-start justify-start rounded-lg border border-transparent bg-white p-4 shadow-sm",
        isSelected && "border border-orange-500"
      )}
      onPress={() => setSelectedOption(item)}
    >
      <View className="flex w-full flex-row items-center justify-between">
        <Text className="text-md font-normal leading-tight text-orange-500">
          {translate("challenge_detail_screen.option")} {index}
        </Text>
        <Text className="text-md font-semibold leading-snug text-zinc-500">
          {translate("challenge_detail_screen.number_of_vote")}:{item?.votes}
        </Text>
      </View>

      <View className="my-2 h-px self-stretch border border-slate-100"></View>
      <View className="my-2 inline-flex flex-row items-end justify-between self-stretch">
        <Text className="text-md font-semibold leading-snug text-zinc-500">
          {time}
        </Text>
        <Text className="w-52 text-right text-md font-semibold leading-tight text-zinc-500">
          {date}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

interface ICompanyCoachCalendarTabCompanyViewProps {
  challengeId: string;
  challengeState: ICertifiedChallengeState;
}

const CompanyCoachCalendarTabCompanyView: FC<
  ICompanyCoachCalendarTabCompanyViewProps
> = ({ challengeId, challengeState }) => {
  const [proposingOptions, setProposingOptions] = useState<
    IProposedScheduleTime[]
  >([] as IProposedScheduleTime[]);
  const [selectedOption, setSelectedOption] =
    useState<IProposedScheduleTime>(null);
  const [confirmedOption, setConfirmedOption] =
    useState<IProposedScheduleTime>(null);

  const [isCoachProposed, setIsCoachProposed] = useState<boolean>(false);

  const { t } = useTranslation();

  const currentChallengeState = getInprogressState(challengeState);

  const {
    isErrorModalOpen,
    erroModalTitle,
    errorModalDescription,
    openErrorModal,
    closeErrorModal,
  } = useErrorModal();

  const getScheduledVideocall = async () => {
    if (!challengeId || !currentChallengeState) return;
    try {
      const res = await getAllScheduleVideoCall(challengeId);
      if (res?.data && res?.data.length > 0) {
        const scheduledOptions = res?.data.find((item) => {
          return (
            item.schedule?.phase === currentChallengeState &&
            (currentChallengeState === "check"
              ? item.schedule?.check === challengeState.checkpoint
              : true)
          );
        });
        const confirmedOption = scheduledOptions?.proposals.find(
          (item) => item?.isConfirmed > 0
        );
        if (confirmedOption) setConfirmedOption(confirmedOption);
        if (scheduledOptions?.proposals?.length > 0) {
          setProposingOptions(scheduledOptions?.proposals);
          setIsCoachProposed(true);
        }
      }
    } catch (error) {
      openErrorModal({
        title: t("dialog.proposing_time.error_title"),
        description: t("dialog.proposing_time.error_description"),
      });
    }
  };

  const handleVote = async () => {
    try {
      const res = await createVoteScheduleVideoCall(selectedOption.id);

      if (res.status === 201) {
        getScheduledVideocall();
        GlobalToastController.showModal({
          message: t("toast.vote_proposing_time_success") as string,
        });
      }
    } catch (error) {
      if (error.response?.data.statusCode == 403) {
        openErrorModal({
          title: t("dialog.proposing_time.error_title"),
          description: t("dialog.proposing_time.error_description"),
        });
      } else {
        openErrorModal({
          title: t("error"),
          description: t("error_general_message"),
        });
      }
    }
  };

  useEffect(() => {
    getScheduledVideocall();
  }, [challengeId, currentChallengeState]);

  return (
    <ScrollView className="relative flex h-full flex-1 flex-col p-4">
      <ErrorDialog
        title={erroModalTitle}
        description={errorModalDescription}
        isVisible={isErrorModalOpen}
        confirmButtonLabel="Okay"
        onConfirm={closeErrorModal}
        onClosed={closeErrorModal}
      />

      <View className="flex flex-col rounded-lg py-2">
        <Text className="text-md font-semibold leading-tight text-zinc-500">
          {t("challenge_detail_screen.request_video_call")}
        </Text>
        {confirmedOption ? (
          <ConfirmedRequestedCall
            translate={t}
            confirmedOption={confirmedOption}
          />
        ) : (
          <EmptyVideoCall translate={t} />
        )}
      </View>
      {!confirmedOption && (
        <View className="flex flex-1">
          <View className="flex flex-row justify-between pb-2">
            <Text className="text-md font-semibold leading-tight text-zinc-500">
              {t("challenge_detail_screen.coach_proposing_time")}
            </Text>
          </View>
          {proposingOptions.length > 0 ? (
            proposingOptions.map((item, index) => (
              <View key={item?.id}>
                <ProposedTimeTag
                  translate={t}
                  key={index}
                  index={index + 1}
                  item={item}
                  isSelected={selectedOption?.id === item.id}
                  setSelectedOption={setSelectedOption}
                />
              </View>
            ))
          ) : (
            <EmptyProposingTime translate={t} />
          )}
          {proposingOptions.length > 0 && (
            <Button
              title={t("challenge_detail_screen.vote")}
              containerClassName="flex-1 bg-primary-default my-5 "
              textClassName="text-white text-md leading-6"
              onPress={handleVote}
            />
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default CompanyCoachCalendarTabCompanyView;
