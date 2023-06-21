import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import clsx from 'clsx';
import { useUserProfileStore } from '../../../../../store/user-data';

const Biography = ({ bio }: { bio: string | undefined }) => {
  return (
    <View className="justify-content: space-between">
      <View className={clsx(' flex flex-col pr-4')}>
        <Text className={clsx('text-h6 text-gray-dark')}>
          {bio ? bio : 'No biography yet'}
        </Text>
      </View>
    </View>
  );
};

export default Biography;
