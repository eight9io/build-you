import { FC } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import clsx from 'clsx';

interface IAppTitleProps {
  title: string;
  textClassName?: string;
}

export const AppTitle: FC<IAppTitleProps> = ({ title, textClassName }) => {
  return (
    <Text className={clsx('text-lg font-semibold', textClassName)}>
      {title}
    </Text>
  );
};

export default AppTitle;
