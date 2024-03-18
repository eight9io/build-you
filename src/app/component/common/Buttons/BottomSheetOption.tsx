import { FC } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import clsx from "clsx";

interface IBottomSheetOptionProps {
  title?: string | null;
  containerClassName?: string;
  textClassName?: string;
  onPress?: () => void;
  Icon?: React.ReactNode;
  isDisabled?: boolean;
  disabledContainerClassName?: string;
  disabledTextClassName?: string;
  autoHeight?: boolean;
}

const BottomSheetOption: FC<IBottomSheetOptionProps> = ({
  Icon,
  title,
  onPress,
  isDisabled,
  textClassName,
  containerClassName,
  disabledTextClassName,
  disabledContainerClassName,
  autoHeight,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={clsx(
        "mr-1 flex items-center justify-center rounded-full",
        isDisabled ? disabledContainerClassName : containerClassName,
        autoHeight ? "" : "h-12"
      )}
      onPress={onPress}
      disabled={isDisabled}
    >
      <View className="flex-row items-center justify-center">
        {Icon && Icon}
        {title && (
          <Text
            className={clsx(
              "line-[30px] text-center text-sm font-medium",
              isDisabled ? disabledTextClassName : textClassName
            )}
          >
            {title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
export default BottomSheetOption;
