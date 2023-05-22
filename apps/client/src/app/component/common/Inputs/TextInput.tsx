import { FC, ReactNode } from 'react';
import { Text, TextInputProps, View, TextInput as Base, TouchableOpacity } from 'react-native';

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
        <Text className="text-primary-dark text-base font-semibold">
          {label}
        </Text>
      ) : null}
      <View className="relative">
        <TouchableOpacity onPress={onPress}>
          <View pointerEvents={onPress ? 'none' : 'auto'}>
            <Base className={inputProps?.className}  {...inputProps} />
          </View>
        </TouchableOpacity>
        {rightIcon ? (
          <View className="absolute bottom-0 right-4 top-0 flex justify-center">
            {rightIcon}
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default TextInput;
