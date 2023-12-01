import React, { FC, useEffect, useState } from "react";
import clsx from "clsx";
import { EvilIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

import {
  IProposalTime,
  IProposingScheduleTime,
} from "../../../../types/schedule";
import { IUserData } from "../../../../types/user";
import { ICertifiedChallengeState } from "../../../../types/challenge";

import {
  creatProposalScheduleVideoCall,
  getAllScheduleVideoCall,
  resetScheduledVideoCall,
} from "../../../../service/schedule";
import { onCopyLink } from "../../../../utils/shareLink.uitl";
import { openUrlInApp } from "../../../../utils/inAppBrowser";
import { useErrorModal } from "../../../../hooks/useErrorModal";

import LinkSvg from "./assets/link.svg";
import EmptySvg from "./assets/emptyFollow.svg";
import DeleteSvg from "./assets/delete.svg";

import PopUpMenu from "../../../../component/common/PopUpMenu";
import Button from "../../../../component/common/Buttons/Button";
import ErrorDialog from "../../../../component/common/Dialog/ErrorDialog";
import ConfirmDialog from "../../../../component/common/Dialog/ConfirmDialog";
import ConfirmVideoCoachModal from "../../../../component/modal/ConfirmVideoCoachModal";
import GlobalToastController from "../../../../component/common/Toast/GlobalToastController";
import CoachDateTimePicker from "../../../../component/common/BottomSheet/CoachDateTimePicker/CoachDateTimePicker";
import GlobalDialogController from "../../../../component/common/Dialog/GlobalDialogController";

export interface IProposingScheduleTimeTag {
  translate?: (key: string) => string;
  index: number;
  dateTime: Date | string;
  onDelete: (index: number) => void;
}

export interface IProposedTimeTag {
  translate: (key: string) => string;
  item: IProposalTime;
  index: number;
  isSelected: boolean;
  setSelectedOption: (item: IProposingScheduleTime) => void;
}

interface ICompanyCoachCalendarTabCoachViewProps {
  challengeId: string;
  challengeState: ICertifiedChallengeState;
  shouldScreenRefresh: boolean;
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
  handleEditScheduledVideoCallLink,
  handleDeleteConfirmedScheduledVideoCall,
}: {
  translate: (key: string) => string;
  confirmedOption: IProposingScheduleTime;
  handleEditScheduledVideoCallLink: () => void;
  handleDeleteConfirmedScheduledVideoCall: () => void;
}) => {
  const { metingUrl } = confirmedOption;

  const handleOpenLink = async () => {
    if (!metingUrl) {
      GlobalDialogController.showModal({
        title: translate("error"),
        message: translate("error_general_message"),
      });
      return;
    }
    openUrlInApp(confirmedOption.metingUrl);
  };
  const dateTimeObject = new Date(confirmedOption.proposal);

  return (
    <View className="my-4 flex-1 flex-col items-start justify-start rounded-lg bg-white p-4 shadow-sm">
      <View className="flex w-full flex-row items-center justify-between">
        <Text className="text-md font-semibold leading-tight text-green-500">
          {translate("challenge_detail_screen.confirmed")}
        </Text>
        <View>
          <PopUpMenu
            iconColor="#6C6E76"
            options={[
              {
                text: translate("pop_up_menu.edit"),
                onPress: handleEditScheduledVideoCallLink,
              },
              {
                text: translate("pop_up_menu.delete"),
                onPress: handleDeleteConfirmedScheduledVideoCall,
              },
            ]}
          />
        </View>
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
      <View className="flex flex-row items-center justify-between self-stretch pt-3">
        <View className="inline-flex flex-col items-start justify-start gap-1">
          <Text className="text-md font-semibold leading-snug text-zinc-500">
            {translate("challenge_detail_screen.open_meeting")}
          </Text>
        </View>
        <TouchableOpacity
          className="flex flex-row items-center justify-end gap-1 p-1"
          onPress={() => onCopyLink(metingUrl)}
        >
          <LinkSvg />
          <Text className="text-right text-md font-normal leading-tight text-blue-600">
            {translate("challenge_detail_screen.copy")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex flex-row items-center justify-end gap-1 p-1"
          onPress={handleOpenLink}
        >
          <EvilIcons name="external-link" size={20} color="#2563eb" />
          <Text className="text-right text-md font-normal leading-tight text-blue-600">
            {translate("challenge_detail_screen.open_link")}
          </Text>
        </TouchableOpacity>
      </View>
      {confirmedOption?.note && (
        <View className="flex flex-row items-center justify-between self-stretch pt-3">
          <View className="inline-flex flex-col items-start justify-start gap-1">
            <Text className="text-md font-semibold leading-snug text-zinc-500">
              {translate("challenge_detail_screen.note")}
            </Text>
          </View>
          <View className="flex w-48">
            <Text className="text-md font-normal leading-tight text-zinc-500">
              {confirmedOption?.note}
            </Text>
          </View>
        </View>
      )}
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

const ProposingTimeTag: FC<IProposingScheduleTimeTag> = ({
  translate,
  index,
  dateTime,
  onDelete,
}) => {
  const dateTimeObject = new Date(dateTime);
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
    <View className="my-2 flex-col items-start justify-start rounded-lg bg-white p-4 shadow-sm">
      <View className="flex w-full flex-row items-center justify-between">
        <Text className="text-md font-normal leading-tight text-orange-500">
          {translate("challenge_detail_screen.option")} {index}
        </Text>
        <TouchableOpacity
          className="flex flex-row items-center"
          onPress={() => onDelete(index)}
        >
          <DeleteSvg />
        </TouchableOpacity>
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
  if (!item) return;

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
        <Text>
          {translate("challenge_detail_screen.number_of_vote")} : {item?.votes}
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

export const getInprogressState = (
  challengeState: ICertifiedChallengeState
) => {
  if (!challengeState) return;
  if (challengeState?.checkStatus === "in-progress") return "check";
  if (challengeState?.intakeStatus === "in-progress") return "intake";
  if (challengeState?.closingStatus === "in-progress") return "closing";
};

const CompanyCoachCalendarTabCoachView: FC<
  ICompanyCoachCalendarTabCoachViewProps
> = ({ challengeId, challengeState, shouldScreenRefresh }) => {
  const [proposingOptions, setProposingOptions] = useState<
    IProposingScheduleTime[]
  >([] as IProposingScheduleTime[]);
  const [confirmedOption, setConfirmedOption] =
    useState<IProposingScheduleTime>(null);
  const [proposedOptions, setProposedOptions] = useState<IProposalTime[]>(
    [] as IProposalTime[]
  );

  const [isCoachProposed, setIsCoachProposed] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] =
    useState<IProposingScheduleTime>(null);

  const [isShowDateTimePicker, setIsShowDateTimePicker] =
    useState<boolean>(false);
  const [isShowConfirmDialog, setIsShowConfirmDialog] =
    useState<boolean>(false);
  const [isShowConfirmTimeModal, setIsShowConfirmTimeModal] =
    useState<boolean>(false);

  const {
    isErrorModalOpen,
    erroModalTitle,
    errorModalDescription,
    openErrorModal,
    closeErrorModal,
  } = useErrorModal();

  const { t } = useTranslation();

  const isChallengeInProgress =
    challengeState?.checkStatus === "in-progress" ||
    challengeState?.closingStatus === "in-progress" ||
    challengeState?.intakeStatus === "in-progress";

  const currentChallengeState = getInprogressState(challengeState);

  const handleAddTime = () => {
    setIsShowDateTimePicker(true);
  };

  const handleAddProposingOptions = (newSelectedDate: Date) => {
    const newProposingOption = {
      index: proposingOptions.length + 1,
      proposal: newSelectedDate,
    };

    setProposingOptions((prev) => [...prev, newProposingOption]);
    setIsShowDateTimePicker(false);
  };

  const handleDeleteProposingOptions = (index: number) => {
    // remove the index then sort the array, then update the index so that it's always in order and increasing by 1
    const newProposingOptions = proposingOptions
      .filter((item) => item.index !== index)
      .map((item, index) => ({ ...item, index: index + 1 }));
    setProposingOptions(newProposingOptions);
  };

  const handleSubmitProposeTime = () => {
    setIsShowConfirmDialog(true);
  };

  const handleSubmitProposingTime = async () => {
    try {
      const options = proposingOptions.map((item) =>
        typeof item.proposal === "string"
          ? item.proposal
          : (item.proposal as Date)?.toISOString()
      );
      const res = await creatProposalScheduleVideoCall({
        challengeId,
        check:
          currentChallengeState === "check" ? challengeState.checkpoint : null,
        proposal: options,
        phase: currentChallengeState,
      });

      setProposedOptions(res?.data?.proposals);
      setIsCoachProposed(true);
      GlobalToastController.showModal({
        message: t("toast.proposing_time_success") as string,
        isScreenHasBottomNav: false,
      });
    } catch (error) {
      openErrorModal({
        title: t("error"),
        description: t("dialog.proposing_time.error_description"),
      });
    }
    setIsShowConfirmDialog(false);
  };

  const getScheduledVideocall = async () => {
    if (!challengeId || !currentChallengeState) return;
    try {
      const res = await getAllScheduleVideoCall(challengeId);
      if (res?.data && res?.data.length > 0) {
        const scheduledOptions = res?.data.find(
          (item) =>
            item.schedule.phase === currentChallengeState &&
            (currentChallengeState === "check"
              ? item.schedule.check === challengeState.checkpoint
              : true) &&
            item?.proposals?.length > 0
        );
        const confirmedOption = scheduledOptions?.proposals.find(
          (item) => item?.isConfirmed > 0
        );
        if (confirmedOption) {
          setConfirmedOption(confirmedOption);
          return;
        }
        const filteredScheduledOptions = scheduledOptions?.proposals.filter(
          (item) => item?.proposal
        );
        if (filteredScheduledOptions?.length > 0) {
          setProposedOptions(filteredScheduledOptions);
          setIsCoachProposed(true);
        }
      }
    } catch (error) {
      openErrorModal({
        title: t("error"),
        description: t("dialog.proposing_time.error_description"),
      });
    }
  };

  const handleDeleteConfirmedScheduledVideoCall = async () => {
    try {
      await resetScheduledVideoCall(confirmedOption?.schedule);
      setConfirmedOption(null);
      setProposedOptions([]);
      setProposingOptions([]);
      setIsCoachProposed(false);
      GlobalToastController.showModal({
        message: t(
          "toast.delete_confirmed_scheduled_video_call_success"
        ) as string,
        isScreenHasBottomNav: false,
      });
    } catch (error) {
      openErrorModal({
        title: t("error"),
        description: t("error_general_message"),
      });
    }
  };

  const handleEditScheduledVideoCallLink = async () => {
    setIsShowConfirmTimeModal(true);
  };

  useEffect(() => {
    getScheduledVideocall();
  }, [challengeId, currentChallengeState]);

  useEffect(() => {
    if (shouldScreenRefresh) {
      getScheduledVideocall();
    }
  }, [shouldScreenRefresh]);

  return (
    <ScrollView className="relative flex h-full flex-1 flex-col p-4">
      <CoachDateTimePicker
        selectedDate={new Date()}
        setSelectedDate={handleAddProposingOptions}
        setShowDateTimePicker={setIsShowDateTimePicker}
        showDateTimePicker={isShowDateTimePicker}
      />

      <ConfirmDialog
        title={t("dialog.proposing_time.title")}
        description={t("dialog.proposing_time.description")}
        isVisible={isShowConfirmDialog}
        confirmButtonLabel="Submit"
        onConfirm={handleSubmitProposingTime}
        onClosed={() => {
          setIsShowConfirmDialog(false);
        }}
      />

      <ErrorDialog
        title={erroModalTitle}
        description={errorModalDescription}
        isVisible={isErrorModalOpen}
        confirmButtonLabel="Okay"
        onConfirm={closeErrorModal}
        onClosed={closeErrorModal}
      />

      <ConfirmVideoCoachModal
        openErrorModal={openErrorModal}
        selectedOption={confirmedOption ? confirmedOption : selectedOption}
        setConfirmedOption={setConfirmedOption}
        modalVisible={isShowConfirmTimeModal}
        setModalVisible={setIsShowConfirmTimeModal}
      />

      <View className="flex flex-col rounded-lg py-2">
        <Text className="text-md font-semibold leading-tight text-zinc-500">
          {t("challenge_detail_screen_tab.coach_calendar.request_video_call")}
        </Text>
        {confirmedOption ? (
          <ConfirmedRequestedCall
            translate={t}
            confirmedOption={confirmedOption}
            handleDeleteConfirmedScheduledVideoCall={
              handleDeleteConfirmedScheduledVideoCall
            }
            handleEditScheduledVideoCallLink={handleEditScheduledVideoCallLink}
          />
        ) : (
          <EmptyVideoCall translate={t} />
        )}
      </View>
      {!confirmedOption && (
        <View className="flex flex-1">
          <View className="flex flex-row justify-between pb-2">
            <Text className="text-md font-semibold leading-tight text-zinc-500">
              {t("challenge_detail_screen.proposing_time")}
            </Text>
            {isChallengeInProgress && !isCoachProposed && (
              <TouchableOpacity
                className="flex flex-row items-center"
                onPress={handleAddTime}
              >
                <Text className="text-md font-semibold leading-tight text-primary-default">
                  + {t("challenge_detail_screen.add")}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {!isCoachProposed && (
            <View>
              {proposingOptions.length > 0 ? (
                proposingOptions.map((item) => (
                  <ProposingTimeTag
                    translate={t}
                    key={item.index}
                    index={item.index}
                    dateTime={item.proposal}
                    onDelete={handleDeleteProposingOptions}
                  />
                ))
              ) : (
                <EmptyProposingTime translate={t} />
              )}
              {proposingOptions.length > 0 && (
                <Button
                  title={t("challenge_detail_screen.propose")}
                  containerClassName="flex-1 bg-primary-default my-5 "
                  textClassName="text-white text-md leading-6"
                  onPress={handleSubmitProposeTime}
                />
              )}
            </View>
          )}

          {isCoachProposed && proposedOptions && (
            <View>
              {proposedOptions?.map((item, index) => (
                <View key={item?.id}>
                  <ProposedTimeTag
                    translate={t}
                    key={item?.id}
                    index={index + 1}
                    item={item}
                    isSelected={selectedOption?.id === item.id}
                    setSelectedOption={setSelectedOption}
                  />
                </View>
              ))}
              {proposedOptions.length > 0 && (
                <Button
                  title={t("challenge_detail_screen.confirm")}
                  containerClassName="flex-1 bg-primary-default my-5 "
                  textClassName="text-white text-md leading-6"
                  onPress={() => setIsShowConfirmTimeModal(true)}
                  isDisabled={!selectedOption?.id}
                  disabledContainerClassName="flex-1 bg-gray-300 my-5 "
                  disabledTextClassName="text-white text-md leading-6"
                />
              )}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default CompanyCoachCalendarTabCoachView;
