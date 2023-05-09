import { FC } from 'react';
import { Text, View } from 'react-native';
import clsx from 'clsx';

interface IAppTitleProps {
  title: string;
  textClassName?: string;
}

export const AppTitle: FC<IAppTitleProps> = ({ title, textClassName }) => {
  return (
    <View className="flex items-center justify-center w-full">
      <Text className={clsx('text-lg font-semibold', textClassName)}>
        {title}
      </Text>
    </View>
  );
};

export default AppTitle;
