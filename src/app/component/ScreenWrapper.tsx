import clsx from "clsx";
import { FC, ReactNode } from "react";
import { View } from "react-native";

interface IScreenWrapperProps {
  children: ReactNode;
  containerClassName?: string;
}

export const ScreenWithDrawerWrapper = ({ children }) => {
  return (
    <View className="flex-1">
      <View className="mx-auto w-[630px] max-w-[630px] flex-1">{children}</View>
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
        className={clsx(
          "mx-auto w-full max-w-[768px] flex-1",
          containerClassName
        )}
      >
        {children}
      </View>
    </View>
  );
};
