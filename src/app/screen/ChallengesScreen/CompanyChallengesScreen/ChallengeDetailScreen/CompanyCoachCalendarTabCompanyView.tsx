import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

import { openUrlInApp } from "../../../../utils/inAppBrowser";
import { IProposingTime } from "../../../../types/challenge";

import LinkSvg from "./assets/link.svg";
import EmptySvg from "./assets/emptyFollow.svg";
import Button from "../../../../component/common/Buttons/Button";

interface IProposedTimeTag {
  translate: (key: string) => string;
  item: IProposingTime;
  isSelected: boolean;
  setSelectedOption: (item: IProposingTime) => void;
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
  confirmedOption: IProposingTime;
}) => {
  const url = "https://meet.google.com/abc-defg-hij";

  const handleOpenLink = async () => {
    openUrlInApp(url);
  };

  const dateTimeObject = new Date(confirmedOption.dateTime);

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
  isSelected,
  setSelectedOption,
}) => {
  const dateTimeObject = new Date(item?.dateTime);

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
          {translate("challenge_detail_screen.option")} {item?.index}
        </Text>
        <Text className="text-md font-semibold leading-snug text-zinc-500">
          {translate("challenge_detail_screen.number_of_vote")}:
          {item?.numberOfVotes}
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

const mock_proposingOptions = [
  {
    dateTime: "2023-10-18T09:49:26.000Z",
    id: "1",
    index: 1,
    numberOfVotes: 2,
    isConfirmed: false,
  },
  {
    dateTime: "2023-10-19T04:49:34.000Z",
    id: "2",
    index: 2,
    numberOfVotes: 10,
    isConfirmed: true,
  },
];

const CompanyCoachCalendarTabCoachView = () => {
  const [proposingOptions, setProposingOptions] = useState<IProposingTime[]>(
    mock_proposingOptions as IProposingTime[]
  );
  const [selectedOption, setSelectedOption] = useState<IProposingTime>(null);
  const [confirmedOption, setConfirmedOption] = useState<IProposingTime>(null);

  const { t } = useTranslation();

  const handleVote = () => {
    // call api
  };

  useEffect(() => {
    if (proposingOptions.length > 0) {
      const confirmedOption = proposingOptions.find(
        (item) => item.isConfirmed === true
      );
      if (!confirmedOption) {
        setConfirmedOption(confirmedOption);
      }
    }
  }),
    [proposingOptions];

  return (
    <ScrollView className="relative flex h-full flex-1 flex-col p-4">
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
      <View className="flex flex-1">
        <View className="flex flex-row justify-between pb-2">
          <Text className="text-md font-semibold leading-tight text-zinc-500">
            {t("challenge_detail_screen.coach_proposing_time")}
          </Text>
        </View>
        {proposingOptions.length > 0 ? (
          proposingOptions.map((item) => (
            <ProposedTimeTag
              translate={t}
              key={item.index}
              item={item}
              isSelected={selectedOption?.id === item.id}
              setSelectedOption={setSelectedOption}
            />
          ))
        ) : (
          <EmptyProposingTime translate={t} />
        )}
      </View>
      {proposingOptions.length > 0 && (
        <Button
          title={t("challenge_detail_screen.vote")}
          containerClassName="flex-1 bg-primary-default my-5 "
          textClassName="text-white text-md leading-6"
          onPress={handleVote}
        />
      )}
    </ScrollView>
  );
};

export default CompanyCoachCalendarTabCoachView;
