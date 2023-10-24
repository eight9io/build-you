import React from "react";
import { View, Text } from "react-native";
import clsx from "clsx";

interface ISkillCompetenceProcessProps {
  skillName?: string;
  skillCompetence?: number;
  skillGaugeClassName?: string;
  color?: "bg-gray-medium" | "bg-success-default";
}

const skillCompetenceProcess = (skillCompetence: number | undefined) => {
  switch (skillCompetence) {
    case 1:
      return "w-1/5";
    case 2:
      return "w-2/5";
    case 3:
      return "w-3/5";
    case 4:
      return "w-4/5";
    case 5:
      return "w-full";
    default:
      return "w-0";
  }
};

const SkillCompetenceProcess: React.FC<ISkillCompetenceProcessProps> = ({
  skillName,
  skillCompetence,
  skillGaugeClassName,
  color = "bg-gray-medium",
}) => {
  const skillCompetenceWidth = skillCompetenceProcess(skillCompetence);
  return (
    <View className="mb-2 flex flex-col justify-start rounded-xl bg-white py-4">
      <View className="px-4">
        <Text className="text-black pb-2 text-md font-medium leading-4">
          {skillName}
        </Text>
        <View className="h-2.5 w-full rounded-full bg-gray-light">
          <View
            className={clsx(
              `h-2.5 rounded-full`,
              skillCompetenceWidth,
              skillGaugeClassName,
              color
            )}
          ></View>
        </View>
      </View>
    </View>
  );
};

export default SkillCompetenceProcess;
