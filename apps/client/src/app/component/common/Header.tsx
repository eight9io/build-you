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
        'relative mt-5 flex h-9 w-full items-center justify-start',
        containerStyle
      )}
    >
      {leftBtn ? (
        <TouchableOpacity
          className="absolute left-5 top-2"
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
        <View className={clsx('absolute top-2')}>
          <Text className={clsx('text-h5 font-semibold', textClassName)}>
            {title}
          </Text>
        </View>
      )}
      {rightBtn && typeof rightBtn == 'string' && (
        <TouchableOpacity
          className="absolute right-5 top-2"
          onPress={onRightBtnPress}
        >
          <Text className="text-h5 text-primary-default font-normal">
            {rightBtn}
          </Text>
        </TouchableOpacity>
      )}

      {rightBtn && typeof rightBtn === 'object' && (
        <View className="absolute right-5 top-2">{rightBtn}</View>
      )}
    </View>
  );
};

export default Header;
