import clsx from 'clsx';
import { FC, ReactNode, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

interface ITabTitleProps {
  title: string;
  isActive: boolean;
  activeTabClassName?: string;
  defaultTabClassName?: string;
}

interface ITabViewProps {
  titles: string[];
  children: ReactNode[];
  activeTabClassName?: string;
  defaultTabClassName?: string;
}

const TabTitle: FC<ITabTitleProps> = ({
  title,
  isActive,
  activeTabClassName,
  defaultTabClassName,
}) => {
  const defaultActiveTabClassName =
    activeTabClassName || 'border-primary-default border-b-2';
  return (
    <View
      className={clsx('px-4 py-2.5', isActive && defaultActiveTabClassName)}
    >
      <Text className={clsx('uppercase', !isActive && defaultTabClassName)}>
        {title}
      </Text>
    </View>
  );
};

export const TabViewFlatlist: FC<ITabViewProps> = ({
  titles,
  children,
  activeTabClassName,
  defaultTabClassName,
}) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <View className="flex-1">
      <View className="bg-white">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={titles}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={index}
              onPress={() => setActiveTabIndex(index)}
            >
              <TabTitle
                title={item}
                isActive={index === activeTabIndex}
                activeTabClassName={activeTabClassName}
                defaultTabClassName={defaultTabClassName}
                key={index}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            paddingHorizontal: 10,
            backgroundColor: 'white',
          }}
        />
      </View>
      <View className="mt-4 flex-1 px-4"    >{children[activeTabIndex]}</View>
    </View>
  );
};

export default TabViewFlatlist;
