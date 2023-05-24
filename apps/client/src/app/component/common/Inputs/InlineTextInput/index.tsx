import React from 'react';
import { Controller } from 'react-hook-form';
import { View, Text } from 'react-native';

import clsx from 'clsx';
import TextInput from '../TextInput';
import WarningSvg from './asset/warning.svg';

interface IInlineTextInputProps {
  title: string;
  placeholder: string;
  control?: any;
  errors?: any;
  showError?: boolean;
  containerClassName?: string;
  textInputClassName?: string;
}

const InlineTextInput: React.FC<IInlineTextInputProps> = ({
  title,
  control,
  errors,
  showError,
  placeholder,
  containerClassName,
  textInputClassName,
}) => {
  return (
    <View>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View className={clsx(' flex w-full flex-row items-center')}>
            <Text
              className={clsx('text-primary-default text-md font-semibold')}
            >
              {title}
            </Text>
            <View className={clsx('flex-1 pl-4', containerClassName)}>
              <TextInput
                placeholder={placeholder}
                placeholderTextColor={'#C5C8D2'}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                className={clsx(
                  'border-gray-medium bg-gray-veryLight flex h-12 rounded-[10px] border-[1px] px-3 pb-3 pt-2 text-base font-normal',
                  textInputClassName
                )}
              />
              {errors && showError && (
                <View className="absolute bottom-[-20px] left-6 flex flex-row items-center justify-center">
                  <WarningSvg />
                  <Text className="pl-1 text-sm text-red-500">
                    Please fill in the skill name.
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
        name={title}
      />
    </View>
  );
};

export default InlineTextInput;
