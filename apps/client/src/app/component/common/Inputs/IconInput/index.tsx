import React from 'react';
import { Controller } from 'react-hook-form';
import { View, Text } from 'react-native';

import clsx from 'clsx';
import TextInput from '../TextInput';

interface IIconInputProps {
  title: string;
  placeholder: string;
  control?: any;
}

const IconInput: React.FC<IIconInputProps> = ({
  title,
  control,
  placeholder,
}) => {
  // get dimensions of screen
  // const screen = Dimensions.get('window');

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
            <View className="flex-1 pl-4">
              <TextInput
                placeholder={placeholder}
                placeholderTextColor={'#C5C8D2'}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                className={clsx(
                  'border-gray-medium bg-gray-veryLight flex h-12 rounded-[10px] border-[1px] px-3 pb-3 pt-2 text-base font-normal'
                )}
              />
            </View>
          </View>
        )}
        name={title}
      />
    </View>
  );
};

export default IconInput;
