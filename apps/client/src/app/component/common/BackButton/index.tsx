import React, { useMemo } from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import IconBack from './asset/backIcon.svg';
interface IBackButtonProps {
  onPress?: any;
}
export const BackButton: React.FC<IBackButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="flex-row ">
        <IconBack />

        <Text className="text-h5 text-primary-default ml-2">Back</Text>
      </View>
    </TouchableOpacity>
  );
};

export default BackButton;
