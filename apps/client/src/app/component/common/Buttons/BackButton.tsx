import { FC } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import clsx from 'clsx';
import BackIcon from './asset/backIcon.svg';

interface IBackButtonProps {
  onPress?: () => void;
}

export const BackButton: FC<IBackButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={clsx('flex flex-row items-center')}
      onPress={onPress}
    >
      <BackIcon />
      <Text className={clsx('text-primary-default text-center text-h5 font-normal pl-[5px]')}>
        Back
      </Text>
    </TouchableOpacity>
  );
};

export default BackButton;
