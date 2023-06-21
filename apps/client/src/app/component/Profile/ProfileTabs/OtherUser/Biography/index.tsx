import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import clsx from 'clsx';

const Biography = ({ bio }: { bio: string | undefined }) => {
  return (
    <ScrollView className="pt-4">
      <View className="justify-content: space-between ">
        <Text className={clsx('text-h6 text-gray-dark')}>
          {bio ? bio : 'No biography yet'}
        </Text>
      </View>
    </ScrollView>
  );
};

export default Biography;
