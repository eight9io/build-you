import clsx from "clsx";
import { FC, ReactNode } from "react";
import { View } from "react-native";
import {
  MAIN_SCREEN_MAX_WIDTH,
  SCREEN_WITHOUT_DRAWER_MAX_WIDTH,
} from "../common/constants";

interface IScreenWrapperProps {
  children: ReactNode;
  containerClassName?: string;
}

export const ScreenWithDrawerWrapper = ({ children }) => {
  return (
    <View className="flex-1">
      <View
        className="mx-auto w-full flex-1"
        style={{
          maxWidth: MAIN_SCREEN_MAX_WIDTH,
        }}
      >
        {children}
      </View>
    </View>
  );
};

export const ScreenWrapper: FC<IScreenWrapperProps> = ({
  children,
  containerClassName,
}) => {
  return (
    <View className="flex-1">
      <View
        className={clsx("mx-auto w-full flex-1", containerClassName)}
        style={{
          maxWidth: SCREEN_WITHOUT_DRAWER_MAX_WIDTH,
        }}
      >
        {children}
      </View>
    </View>
  );
};
