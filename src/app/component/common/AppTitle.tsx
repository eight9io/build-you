<<<<<<< HEAD
import { Text } from "react-native";
import clsx from "clsx";
=======
import { FC } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import clsx from "clsx";
import NavButton from "./Buttons/NavButton";
>>>>>>> main
import { useTranslation } from "react-i18next";

interface IAppTitleProps {
  title: string;
  textClassName?: string;
}

export const AppTitle = (
  { title, textClassName }: IAppTitleProps,
  { navigation }: { navigation: any }
) => {
  const { t } = useTranslation();
  return (
    <Text className={clsx(" text-lg font-semibold", textClassName)}>
      {title}
    </Text>
  );
};

export default AppTitle;
