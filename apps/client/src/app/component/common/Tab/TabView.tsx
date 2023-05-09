import clsx from 'clsx';
import { FC, ReactNode, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface ITabTitleProps {
  title: string;
  isActive: boolean;
}

interface ITabViewProps {
  titles: string[];
  children: ReactNode[];
}

const TabTitle: FC<ITabTitleProps> = ({ title, isActive }) => {
  return (
    <View
      className={clsx(
        ' px-4 py-2.5',
        isActive && 'border-primary-default border-b-2'
      )}
    >
      <Text className="uppercase">{title}</Text>
    </View>
  );
};

export const TabView: FC<ITabViewProps> = ({ titles, children }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex flex-row">
          {titles.map((title, index) => {
            return (
              <TouchableOpacity key={index} onPress={() => setActiveTabIndex(index)}>
                <TabTitle title={title} isActive={index === activeTabIndex} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <View className="mt-4">{children[activeTabIndex]}</View>
    </View>
  );
};

export default TabView;
