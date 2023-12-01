import { StyleProp, Text, View, ViewStyle } from "react-native";
import React, { FC } from "react";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

import clsx from "clsx";

import EditIcon from "./assets/edit-icon.svg";
import { useTranslation } from "react-i18next";
type MenuOptionProp = {
  text: string;
  onPress: () => void;
};

interface IPopMenuProps {
  iconColor?: string;
  options?: MenuOptionProp[];
  isDisabled?: boolean;
  optionsContainerStyle?: StyleProp<ViewStyle>;
}

const ButtonIcon = ({ iconColor }: { iconColor: string | undefined }) => {
  return (
    <View className={clsx("flex h-6 w-6 items-center justify-center ")}>
      <EditIcon fill={iconColor ? iconColor : "black"} />
    </View>
  );
};

const MenuItem = ({ text, onPress }: { text: string; onPress: any }) => {
  return (
    <MenuOption onSelect={onPress}>
      <View className={clsx("flex flex-row items-center  py-1")}>
        <Text className={clsx("pl-3 text-md font-normal leading-6")}>
          {text}
        </Text>
      </View>
    </MenuOption>
  );
};

const PopUpMenu: FC<IPopMenuProps> = ({
  iconColor,
  options,
  isDisabled,
  optionsContainerStyle,
}) => {
  const { t } = useTranslation();
  return (
    <Menu>
      <MenuTrigger
        disabled={isDisabled}
        children={<ButtonIcon iconColor={isDisabled ? "#C5C8D2" : iconColor} />}
        customStyles={{
          triggerWrapper: {
            width: 30,
            height: 30,
            justifyContent: "center",
            alignItems: "center",
          },

          // touch effect on trigger
          triggerTouchable: {
            underlayColor: "none",
            activeOpacity: 70,
            style: {
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            },
          },
        }}
      />
      {!options && (
        <MenuOptions
          optionsContainerStyle={[
            {
              borderRadius: 4,
            },
            optionsContainerStyle,
          ]}
        >
          <MenuItem
            text={t("pop_up_menu.edit") || "Edit"}
            onPress={() => alert("pressed")}
          />
          <MenuItem
            text={t("pop_up_menu.delete") || "Delete"}
            onPress={() => alert("pressed")}
          />
          <MenuItem
            text={t("pop_up_menu.share") || "Share"}
            onPress={() => alert("pressed")}
          />
          <MenuItem
            text={t("pop_up_menu.mark_as_completed") || "Mark as complete"}
            onPress={() => alert("pressed")}
          />
        </MenuOptions>
      )}
      {options && (
        <MenuOptions
          optionsContainerStyle={[
            {
              borderRadius: 4,
              width: 120,
            },
            optionsContainerStyle,
          ]}
        >
          {options.map((option, id) => (
            <MenuItem key={id} text={option.text} onPress={option.onPress} />
          ))}
        </MenuOptions>
      )}
    </Menu>
  );
};

export default PopUpMenu;
