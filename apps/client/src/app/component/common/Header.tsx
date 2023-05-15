import { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import clsx from 'clsx';

interface IHeaderProps {
  title?: string;
  textClassName?: string;
  leftBtn?: any;
  rightBtn?: any;
  onLeftBtnPress?: () => void;
  onRightBtnPress?: () => void;
}

export const Header: FC<IHeaderProps> = ({
  title,
  textClassName,
  leftBtn,
  rightBtn,
  onLeftBtnPress,
  onRightBtnPress,
}) => {
  return (
    <View className="relative flex h-9 w-full items-center justify-start">
      {leftBtn ? (
        <TouchableOpacity
          className="absolute left-5 top-0"
          onPress={onLeftBtnPress}
        >
          {typeof leftBtn === 'string' && (
            <Text className="text-h5 text-primary-default font-normal">
              {leftBtn}
            </Text>
          )}
          {typeof leftBtn === 'object' && leftBtn}
        </TouchableOpacity>
      ) : null}

      {title && (
        <Text className={clsx('text-h5 font-semibold', textClassName)}>
          {title}
        </Text>
      )}
      {rightBtn ? (
        <TouchableOpacity
          className="absolute right-5 top-0"
          onPress={onRightBtnPress}
        >
          {typeof rightBtn === 'string' && (
            <Text className="text-h5 text-primary-default font-normal">
              {rightBtn}
            </Text>
          )}
          {typeof rightBtn === 'object' && rightBtn}
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default Header;
