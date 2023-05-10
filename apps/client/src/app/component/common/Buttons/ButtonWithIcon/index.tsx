import clsx from 'clsx';
import React from 'react'
import { TouchableOpacity, Image, View, Text } from 'react-native';

interface IButtonWithIconProps {
  icon: 'search' | 'setting';
  onPress?: () => void;
}

const ButtonWithIcon:React.FC<IButtonWithIconProps> = ({
  icon,
  onPress,
}) => {
  const imageSourceFromAssets = icon === 'search' ? require('./asset/search.png'): require('./asset/setting.png');

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View className='flex flex-row items-center'>
        <Image
          className='h-[26px] w-[26px]'
          source={imageSourceFromAssets}
        />
      </View>
    </TouchableOpacity>
  )
}

export default ButtonWithIcon;
