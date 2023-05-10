import { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import clsx from 'clsx';

interface IHeaderProps {
  title: string;
  textClassName?: string;
  leftBtnText?: string;
  rightBtnText?: string;
  onLeftBtnPress?: () => void;
  onRightBtnPress?: () => void;
}

export const Header: FC<IHeaderProps> = ({
  title,
  textClassName,
  leftBtnText,
  rightBtnText,
  onLeftBtnPress,
  onRightBtnPress,
}) => {
  return (
    <View className="relative flex w-full items-center justify-center ">
      {leftBtnText ? (
        <TouchableOpacity
          className="absolute left-5 top-0"
          onPress={onLeftBtnPress}
        >
          <Text className="text-h5 text-primary-default font-normal">
            {leftBtnText}
          </Text>
        </TouchableOpacity>
      ) : null}

      <Text className={clsx('text-h5 font-semibold', textClassName)}>
        {title}
      </Text>
      {rightBtnText ? (
        <TouchableOpacity
          className="absolute right-5 top-0"
          onPress={onRightBtnPress}
        >
          <Text className="text-h5 text-primary-default font-normal">
            {rightBtnText}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default Header;
