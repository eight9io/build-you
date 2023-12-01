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
        "relative flex h-9 w-full flex-row items-center justify-between",
        Platform.OS === "ios" ? "mt-5" : "mt-0",
        containerStyle
      )}
    >
      {leftBtn ? (
        <TouchableOpacity
          // className="absolute left-0 top-2"
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

      {title && (
        <View
        //  className={clsx("absolute top-2")}
        >
          <Text className={clsx("text-base font-semibold", textClassName)}>
            {title}
          </Text>
        </View>
      )}
      {rightBtn && typeof rightBtn == "string" && (
        <TouchableOpacity
          // className="absolute right-0 top-2"
          onPress={(event) => {
            event.persist();
            debounce(onRightBtnPress, 300)();
          }}
        >
          <Text className="text-base font-normal text-primary-default">
            {rightBtn.toUpperCase()}
          </Text>
        </TouchableOpacity>
      )}

      {rightBtn && typeof rightBtn === "object" && (
        <View
        // className="absolute right-5 top-2"
        >
          {rightBtn}
        </View>
      )}
      {!rightBtn && <View />}
    </View>
  );
};

export default Header;
