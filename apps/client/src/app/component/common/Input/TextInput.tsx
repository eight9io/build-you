import { FC, ReactNode } from 'react';
import { Text, TextInputProps, View, TextInput as Base } from 'react-native';

interface ITextInputProps extends TextInputProps {
  label?: string;
  rightIcon?: ReactNode;
}
export const TextInput: FC<ITextInputProps> = (props) => {
  const { label, rightIcon, ...inputProps } = props;

  return (
    <View className="flex flex-col gap-1">
      {label ? (
        <Text className="text-primary-dark text-sm font-semibold">{label}</Text>
      ) : null}
      <View className="relative ">
        <Base {...inputProps} />
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
