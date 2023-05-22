import React from 'react';
import clsx from 'clsx';
import { Controller } from 'react-hook-form';
import { View, Text, TextInput } from 'react-native';

import { useTranslation } from 'react-i18next';

import LocationSvg from './assets/location.svg';

interface ILocationInputProps {
  control?: any;
}

const LocationInput: React.FC<ILocationInputProps> = ({ control }) => {
  const { t } = useTranslation();
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
              {t('new_challenge_screen.location')}
            </Text>

            <View
              className={clsx(
                'border-gray-medium bg-gray-veryLight relative flex h-12 w-full flex-row rounded-[10px] border-[1px] px-3 py-2 text-base font-normal'
              )}
            >
              <TextInput
                placeholder={
                  t('new_challenge_screen.enter_your_location') as string
                }
                placeholderTextColor={'#C5C8D2'}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                multiline
              />
              <View className='absolute top-2.5 right-2 pl-3'>
                <LocationSvg />
              </View>
            </View>
          </View>
        )}
        name='location'
      />
    </View>
  );
};

export default LocationInput;
