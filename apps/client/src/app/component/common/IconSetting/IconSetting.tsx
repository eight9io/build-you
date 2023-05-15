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

import SettingIcon from './asset/setting.svg';
interface ISettingIcon {
  onPress?: any;
}
export const IconSetting: React.FC<ISettingIcon> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="flex-row ">
        <SettingIcon />
      </View>
    </TouchableOpacity>
  );
};

export default IconSetting;
