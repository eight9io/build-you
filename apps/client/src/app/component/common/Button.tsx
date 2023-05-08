import { FC } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import clsx from 'clsx';

interface IButtonProps {
  title: string;
  containerClassName?: string;
  textClassName?: string;
  onPress?: () => void;
}

export const Button: FC<IButtonProps> = ({
  title,
  containerClassName,
  textClassName,
  onPress,
}) => {
  return (
    <TouchableOpacity
      className={clsx(
        'flex-1 h-[48px] justify-center rounded-[24px] mr-1',
        containerClassName
      )}
      onPress={onPress}
    >
      <Text
        className={clsx(
          'line-[30px] text-center font-medium text-sm',
          textClassName
        )}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
