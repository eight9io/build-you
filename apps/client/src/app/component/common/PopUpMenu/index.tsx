import { StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import clsx from 'clsx';

import EditIcon from './assets/edit-icon.svg';

type MenuOptionProp = {
  text: string;
  onPress: () => void;
};

interface IPopMenuProps {
  iconColor?: string;
  options?: MenuOptionProp[];
}

const ButtonIcon = ({iconColor} : {iconColor: string | undefined}) => {
  return (
    <View className={clsx('flex h-6 w-6 items-center justify-center ')}>
      <EditIcon fill={iconColor ? iconColor : 'black'}/>
    </View>
  );
};

const MenuItem = ({ text, onPress }: { text: string; onPress: any }) => {
  return (
    <MenuOption onSelect={onPress}>
      <View className={clsx('flex flex-row items-center')}>
        <Text className={clsx('text-md pl-3 font-normal leading-6')}>
          {text}
        </Text>
      </View>
    </MenuOption>
  );
};

const PopUpMenu: FC<IPopMenuProps> = ({ iconColor, options }) => {
  return (
    <Menu>
      <MenuTrigger
        children={<ButtonIcon iconColor={iconColor}/>}
        customStyles={{
          triggerWrapper: {
            width: 30,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
          },

          // touch effect on trigger
          triggerTouchable: {
            underlayColor: 'none',
            activeOpacity: 70,
            style: {
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            },
          },
        }}
      />
      {!options && (
        <MenuOptions
          optionsContainerStyle={{
            borderRadius: 4,
          }}
        >
          <MenuItem text="Edit" onPress={() => alert('pressed')} />
          <MenuItem text="Delete" onPress={() => alert('pressed')} />
          <MenuItem text="Share" onPress={() => alert('pressed')} />
          <MenuItem text="Mark as complete" onPress={() => alert('pressed')} />
        </MenuOptions>
      )}
      {options && (
        <MenuOptions
          optionsContainerStyle={{
            borderRadius: 4,
          }}
        >
          {options.map((option, id) => (
            <MenuItem key={id} text={option.text} onPress={option.onPress} />
          ))}
        </MenuOptions>
      )}
    </Menu>
  );
};

export default PopUpMenu;
