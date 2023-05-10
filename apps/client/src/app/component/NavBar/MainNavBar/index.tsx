import { FC } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';

import clsx from 'clsx';

import ButtonsWithIcon from '../../common/Buttons/ButtonWithIcon';

interface IMainNavBarProps {
  title: string;
  navigation: any;
}

const MainNavBar: FC<IMainNavBarProps> = ({ title, navigation }) => {
  return (
    <View className={clsx('mx-6 flex flex-row justify-between')}>
      <ButtonsWithIcon icon="search" />
      <Text className="text-lg font-semibold">{title}</Text>
      <ButtonsWithIcon
        icon="setting"
        onPress={() => navigation.push('Settings')}
      />
    </View>
  );
};

export default MainNavBar;
