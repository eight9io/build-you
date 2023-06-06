import clsx from 'clsx';
import { FC, ReactNode } from 'react';
import {
  Text,
  TextInputProps,
  View,
  TextInput as Base,
  TouchableOpacity,
  Platform,
} from 'react-native';

interface ITextInputProps extends TextInputProps {
  label?: string;
  rightIcon?: ReactNode;
  onPress?: () => void;
}

export const TextInput: FC<ITextInputProps> = (props) => {
  const { label, rightIcon, onPress, ...inputProps } = props;
  return (
    <View className="flex flex-col gap-1">
      {label ? (
        <Text className="text-primary-default text-md font-semibold">
          {label}
        </Text>
      ) : null}
      <View className="relative">
        <TouchableOpacity onPress={onPress}>
          <View pointerEvents={onPress ? 'none' : 'auto'}>
            <Base
              {...inputProps}
              className={clsx(
                'border-gray-medium bg-gray-veryLight w-full rounded-[10px] border-[1px]',
                inputProps?.className,
                Platform.OS === 'ios' ? 'p-3' : 'p-2.5'
              )}
              autoCapitalize="none"
            />
          </View>
        </TouchableOpacity>
        {rightIcon ? (
          <View className="absolute bottom-0 right-4 top-0 flex h-full justify-center">
            {rightIcon}
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default TextInput;
