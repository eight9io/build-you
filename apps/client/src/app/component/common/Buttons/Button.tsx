import { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import clsx from 'clsx';

interface IButtonProps {
  title?: string | null;
  containerClassName?: string;
  textClassName?: string;
  onPress?: () => void;
  Icon?: React.ReactNode;
  isDisabled?: boolean;
  disabledContainerClassName?: string;
  disabledTextClassName?: string;
}

const Button: FC<IButtonProps> = ({
  Icon,
  title,
  onPress,
  isDisabled,
  textClassName,
  containerClassName,
  disabledTextClassName,
  disabledContainerClassName,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={clsx(
        'h-12 flex-1 rounded-full',
        isDisabled ? disabledContainerClassName : containerClassName
      )}
      onPress={onPress}
      disabled={isDisabled}
    >
      <View className="flex-1 flex-row items-center justify-center">
        {Icon && Icon}
        {title && (
          <Text
            className={clsx(isDisabled ? disabledTextClassName : textClassName)}
          >
            {title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export const OutlineButton: FC<IButtonProps> = ({
  title,
  containerClassName,
  textClassName,
  onPress,
  Icon,
}) => {
  return (
    <Button
      title={title}
      containerClassName={clsx(
        'bg-white border-primary-default border-[1px]',
        containerClassName
      )}
      textClassName={clsx('text-primary-default', textClassName)}
      onPress={onPress}
      Icon={Icon}
    />
  );
};

export const FillButton: FC<IButtonProps> = ({
  title,
  containerClassName,
  textClassName,
  onPress,
  Icon,
}) => {
  return (
    <Button
      title={title}
      containerClassName={clsx(
        'bg-primary-default border-primary-default border-[1px]',
        containerClassName
      )}
      textClassName={clsx('text-basic-white', textClassName)}
      onPress={onPress}
      Icon={Icon}
    />
  );
};
export default Button;
