import { Text, View } from "react-native";
import React from "react";
import clsx from "clsx";
import Ionicons from "@expo/vector-icons/Ionicons";
import IconErr from "../asset/IconErr.svg";
interface Props {
  message: any;
  containerClassName?: string;
  testID?: string;
}
export default function ErrorText({
  message,
  containerClassName,
  testID,
}: Props) {
  return (
    <View
      className={clsx(
        "mt-4  flex-row content-center items-center",
        containerClassName
      )}
    >
      <Ionicons name="alert-circle-outline" size={14} color="#FF4949" />

      <Text className={clsx(" ml-1  text-sm text-red-500")} testID={testID}>
        {message}
      </Text>
    </View>
  );
}
