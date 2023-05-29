import { FC } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import clsx from 'clsx';
import BackIcon from './asset/backIcon.svg';

interface INavButtonProps {
  icon?: any;
  withIcon?: boolean;
  withBackIcon?: boolean;
  text?: string;
  textClassName?: string;
  onPress?: () => void;
}

export const NavButton: FC<INavButtonProps> = ({
  icon,
  withIcon,
  withBackIcon,
  text,
  textClassName,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={clsx('flex flex-row items-center')}
      onPress={onPress}
    >
      {withBackIcon && <BackIcon />}
      {withIcon && icon && icon}
      <Text
        className={clsx(
          'text-primary-default text-h6 pl-[5px] text-center font-normal',
          textClassName
        )}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default NavButton;
