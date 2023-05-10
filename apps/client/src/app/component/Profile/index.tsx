import clsx from 'clsx';
import React from 'react';

import { View, Text, Image } from 'react-native';

import ProfileAvartar from '../common/Avatar/ProfileAvartar';
import CoverImage from './CoverImage';

const ProfileComponent = () => {
  return (
    <View className={clsx('pt-2')}>
      <View className={clsx('relative')}>
        <CoverImage src="https://images.unsplash.com/photo-1522774607452-dac2ecc66330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" />

        <View className={clsx('absolute bottom-[-40px] left-0 ml-4')}>
          <ProfileAvartar src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80" />
        </View>
      </View>

    </View>
  );
};

export default ProfileComponent;
