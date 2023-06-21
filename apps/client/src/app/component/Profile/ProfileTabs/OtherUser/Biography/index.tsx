import React from 'react';
import { View, Text } from 'react-native';
import clsx from 'clsx';

const Biography = ({ bio }: { bio: string | undefined }) => {
  return (
    <View className="justify-content: space-between ">
      <Text className={clsx('text-h6 text-gray-dark')}>
        {bio ? bio : 'No biography yet'}
      </Text>
    </View>
  );
};

export default Biography;
