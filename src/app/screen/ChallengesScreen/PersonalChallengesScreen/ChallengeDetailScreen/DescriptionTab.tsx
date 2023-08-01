import { FC } from "react";
import clsx from "clsx";
import { Text, View, ScrollView } from "react-native";

import dayjs from "../../../../utils/date.util";
import { IChallenge } from "../../../../types/challenge";
import { useTranslation } from "react-i18next";

interface ISingleDescriptionProps {
  title: string;
  description: string;
}

interface IDescriptionTabProps {
  challengeData: IChallenge;
  maxPepleCanJoin?: number;
}

const SingleDescription: FC<ISingleDescriptionProps> = ({
  title,
  description,
}) => {
  return (
    <View className={clsx("mb-4 flex flex-col border-b border-gray-70 pb-4")}>
      <Text className="text-h6 font-semibold leading-6 text-black-light">
        {title}
      </Text>
      <Text className="text-h6 font-normal leading-6 text-gray-dark">
        {description}
      </Text>
    </View>
  );
};

export const DescriptionTab: FC<IDescriptionTabProps> = ({
  challengeData,
  maxPepleCanJoin,
}) => {
  const { t } = useTranslation();
  const { id, achievementTime, benefits, image, goal, reasons } = challengeData;
  const date = new Date(achievementTime);
  return (
    <ScrollView className="h-full px-4 pt-4">
      <SingleDescription
        title={t("challenge_description_tab.the_benefits") || "The benefits"}
        description={benefits}
      />
      <SingleDescription
        title={t("challenge_description_tab.the_reason") || "The reason"}
        description={reasons}
      />
      <SingleDescription
        title={
          t("challenge_description_tab.time_to_reach_goal") ||
          "Time to reach goal"
        }
        description={dayjs(date).format("DD/MM/YYYY")}
      />
      {maxPepleCanJoin && (
        <SingleDescription
          title={t("challenge_description_tab.participants") || "Participants"}
          description={`${
            challengeData?.participants?.length || 0
          }/${maxPepleCanJoin}`}
        />
      )}
    </ScrollView>
  );
};

export default DescriptionTab;
