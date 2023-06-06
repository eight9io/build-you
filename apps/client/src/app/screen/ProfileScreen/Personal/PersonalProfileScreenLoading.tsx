import React from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import Loading from '../../../component/common/Loading';

const PersonalProfileScreenLoading = () => {
  // TODO: add skeleton loading
  return (
    <SafeAreaView className="justify-content: space-between flex-1 bg-white pt-6">
      <View className="flex flex-row items-center justify-center px-6">
        <Text>Loading...</Text>
      </View>
    </SafeAreaView>
  );
};

export default PersonalProfileScreenLoading;
