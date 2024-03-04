import { FC } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import clsx from "clsx";
import debounce from "lodash.debounce";

interface IHeaderProps {
  title?: string;
  textClassName?: string;
  leftBtn?: any;
  rightBtn?: any;
  onLeftBtnPress?: () => void;
  onRightBtnPress?: () => void;
  containerStyle?: string;
}

export const Header: FC<IHeaderProps> = ({
  title,
  textClassName,
  leftBtn,
  rightBtn,
  onLeftBtnPress,
  onRightBtnPress,
  containerStyle,
}) => {
  return (
    <View
      className={clsx(
        "relative mt-6 flex w-full flex-row items-center justify-center",
        containerStyle
      )}
    >
      {leftBtn ? (
        <TouchableOpacity
          className="absolute left-0 top-0"
          onPress={onLeftBtnPress}
        >
          {typeof leftBtn === "string" && (
            <Text className="text-h5 font-normal text-primary-default">
              {leftBtn}
            </Text>
          )}
          {typeof leftBtn === "object" && leftBtn}
        </TouchableOpacity>
      ) : null}

      {title ? (
        <View
        //  className={clsx("absolute top-2")}
        >
          <Text className={clsx("text-base font-semibold", textClassName)}>
            {title}
          </Text>
        </View>
      ) : null}
      {rightBtn && typeof rightBtn == "string" ? (
        <TouchableOpacity
          className="absolute right-0 top-0"
          onPress={(event) => {
            event.persist();
            debounce(onRightBtnPress, 300)();
          }}
        >
          <Text className="text-base font-normal text-primary-default">
            {rightBtn.toUpperCase()}
          </Text>
        </TouchableOpacity>
      ) : null}

      {rightBtn && typeof rightBtn === "object" ? (
        <View
        // className="absolute right-5 top-2"
        >
          {rightBtn}
        </View>
      ) : null}
    </View>
  );
};

export default Header;
