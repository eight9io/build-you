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
  multiline?: boolean;
}

export const TextInput: FC<ITextInputProps> = (props) => {
  const { label, rightIcon, onPress, multiline, ...inputProps } = props;
  return (
    <View className="flex flex-col gap-1">
      {label ? (
        <Text className="text-primary-default text-md mb-1 font-semibold">
          {label}
        </Text>
      ) : null}
      <View className="relative">
        {onPress ? (
          <TouchableOpacity onPress={onPress}>
            <View pointerEvents={'none'}>
              <Base
                {...inputProps}
                className={clsx(
                  'border-gray-medium bg-gray-veryLight w-full rounded-[10px] border-[1px]',
                  inputProps?.className,
                  Platform.OS === 'ios' ? 'p-3' : 'p-2.5'
                )}
                textAlignVertical={multiline ? 'top' : 'center'}
                multiline={multiline}
                autoCapitalize="none"
              />
            </View>
            {rightIcon ? (
              <View className="absolute bottom-0 right-4 top-0 flex h-full justify-center">
                {rightIcon}
              </View>
            ) : null}
          </TouchableOpacity>
        ) : (
          <>
            <View pointerEvents={'auto'}>
              <Base
                {...inputProps}
                className={clsx(
                  'border-gray-medium bg-gray-veryLight w-full rounded-[10px] border-[1px]',
                  inputProps?.className,
                  Platform.OS === 'ios' ? 'p-3' : 'p-2.5'
                )}
                textAlignVertical={multiline ? 'top' : 'center'}
                autoCapitalize="none"
                multiline={multiline}
              />
            </View>
            {rightIcon ? (
              <View className="absolute bottom-0 right-4 top-0 flex h-full justify-center">
                {rightIcon}
              </View>
            ) : null}
          </>
        )}
      </View>
    </View>
  );
};

export default TextInput;
