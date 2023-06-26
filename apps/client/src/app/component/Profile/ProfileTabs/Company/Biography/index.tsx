import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import clsx from 'clsx';

const Biography = ({ bio }: { bio: string | undefined }) => {
  return (
    <ScrollView>
      <View className="justify-content: space-between pt-4">
        <View className={clsx(' flex flex-col pr-4')}>
          <Text className={clsx('text-h6 text-gray-dark')}>
            {bio ? bio : 'No biography yet'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Biography;
