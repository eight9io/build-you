import { FC } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import clsx from 'clsx';
import BackIcon from './asset/backIcon.svg';

interface INavButtonProps {
  icon?: any;
  withIcon?: boolean;
  text?: string;
  onPress?: () => void;
}

export const NavButton: FC<INavButtonProps> = ({
  icon,
  withIcon,
  text,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={clsx('flex flex-row items-center')}
      onPress={onPress}
    >
      {!withIcon && !icon && <BackIcon />}
      {withIcon && icon && icon}
      <Text
        className={clsx(
          'text-primary-default text-h5 pl-[5px] text-center font-normal'
        )}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default NavButton;
