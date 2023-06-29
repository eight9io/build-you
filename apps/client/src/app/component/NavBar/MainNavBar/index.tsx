import { FC } from 'react';
import { View, Text } from 'react-native';

import clsx from 'clsx';

import ButtonsWithIcon from '../../common/Buttons/ButtonWithIcon';

interface IMainNavBarProps {
  title: string;
  navigation: any;
  withSearch?: boolean;
  withSetting?: boolean;
}

const MainNavBar: FC<IMainNavBarProps> = ({
  title,
  navigation,
  withSearch,
  withSetting,
}) => {
  return (
    <View
      className={clsx(
        'relative mx-6 mb-2 flex flex-row items-center justify-center'
      )}
    >
      <Text className="text-lg font-semibold">{title}</Text>
      <View className="absolute right-0 top-1 flex items-center">
        {withSearch && <ButtonsWithIcon icon="search" />}
        {withSetting && (
          <ButtonsWithIcon
            icon="setting"
            onPress={() => navigation.push('SettingsScreen')}
          />
        )}
      </View>
    </View>
  );
};

export default MainNavBar;
