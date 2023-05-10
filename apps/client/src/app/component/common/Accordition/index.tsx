import React from 'react';
import { View, Text } from 'react-native';
import clsx from 'clsx';

import AccorditionItem from './AccorditionItem';

const Accordition = () => {
  return (
    <View>
      <View className={clsx('flex flex-col pt-7')}>
        <View className={clsx('py-4')}>
          <Text className={clsx('text-h4 font-medium')}>General Settings</Text>
        </View>
        <View>
          <Text className={clsx('text-h6 font-normal leading-6')}>
            Manage settings related to permissions, ads and other account
            information.
          </Text>
        </View>
        <AccorditionItem title='Cookie regulations' />
        <AccorditionItem title='Preferences' />
        <AccorditionItem title='Community Standards' />
        <AccorditionItem title='Notifications' />
      </View>
      <View className={clsx('flex flex-col pt-7')}>
        <View className={clsx('py-4')}>
          <Text className={clsx('text-h4 font-medium')}>Accounts</Text>
        </View>
        <View>
          <Text className={clsx('text-h6 font-normal leading-6')}>
            Manage settings related to permissions, ads and other account
            information.
          </Text>
        </View>
        <AccorditionItem title='Personal informations' />
        <AccorditionItem title='Security and access' />
        <AccorditionItem title='Condition of use' />
      </View>
    </View>
  );
};

export default Accordition;
