import React from 'react';
import { Controller } from 'react-hook-form';
import { View, Text, TextInput } from 'react-native';

import clsx from 'clsx';

interface ICustomTextInputProps {
  title: string;
  placeholder: string;
  placeholderClassName?: string;
  control?: any;
  maxChar?: number;
}

const CustomTextInput: React.FC<ICustomTextInputProps> = ({
  title,
  control,
  placeholder,
  placeholderClassName,
  maxChar,
}) => {
  return (
    <View>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View className={clsx('flex flex-col gap-1')}>
            <Text
              className={clsx('text-primary-default text-sm font-semibold')}
            >
              {title}
            </Text>
            <View className='flex flex-col items-end'>
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
              />
              {maxChar && <Text className='text-gray-dark font-normal text-sm pt-1'>Max. {maxChar} characters</Text>}
            </View>
          </View>
        )}
        name={title}
      />
    </View>
  );
};

export default CustomTextInput;
