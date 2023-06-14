import React from 'react';
import { Controller } from 'react-hook-form';
import { View, Text, TextInput } from 'react-native';

import clsx from 'clsx';
import ErrorText from '../../ErrorText';

interface ICustomTextInputProps {
  title: string;
  placeholder: string;
  placeholderClassName?: string;
  control?: any;
  maxChar?: number;
  errors?: any;
}

const CustomTextInput: React.FC<ICustomTextInputProps> = ({
  title,
  control,
  errors,
  placeholder,
  placeholderClassName,
  maxChar,
}) => {
  return (
    <View>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <View className={clsx('flex flex-col gap-1')}>
            <Text
              className={clsx('text-primary-default text-md font-semibold')}
            >
              {title}
            </Text>
            <View className="flex flex-col items-end">
              <TextInput
                placeholder={placeholder}
                placeholderTextColor={'#C5C8D2'}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                className={clsx(
                  'text-gray-dark border-gray-medium bg-gray-veryLight flex h-12 w-full rounded-[10px] border-[1px] px-3 py-2 text-base font-normal',
                  placeholderClassName
                )}
                multiline
                textAlignVertical='top'
              />
              {maxChar && (
                <Text className="text-gray-dark pt-1 text-sm font-normal">
                  Max. {maxChar} characters
                </Text>
              )}
            </View>
            {errors ? <ErrorText message={errors.message} /> : null}
          </View>
        )}
        name={title.toLowerCase()}
      />
    </View>
  );
};

export default CustomTextInput;
