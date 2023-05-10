import { FC } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';

import clsx from 'clsx';

import BackButton from '../../common/Buttons/BackButton';
import { SetingsScreenNavigationProp } from '../../../screen/SettingsScreen';

interface INavBarInnerScreenProps {
  title: string;
  navigation: SetingsScreenNavigationProp;
}

const NavBarInnerScreen: FC<INavBarInnerScreenProps> = ({
  title,
  navigation,
}) => {
  const backToPreviousScreen = () => {
    navigation.goBack();
  };
  return (
    <View
      className={clsx(
        'relative mx-6 flex flex-row items-center justify-center'
      )}
    >
      <View
        className={clsx('absolute left-0 top-1 flex items-center')}
      >
        <BackButton onPress={backToPreviousScreen} />
      </View>
      <Text className={clsx('text-lg font-semibold')}>{title}</Text>
    </View>
  );
};

export default NavBarInnerScreen;
