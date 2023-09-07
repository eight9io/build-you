import clsx from "clsx";
import { FC, ReactNode, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

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
  getCurrentTab?: (index: number) => void;
}

const TabTitle: FC<ITabTitleProps> = ({
  title,
  isActive,
  activeTabClassName,
  defaultTabClassName,
}) => {
  const defaultActiveTabClassName =
    activeTabClassName || "border-primary-default border-b-2";
  return (
    <View
      className={clsx("px-4 py-2.5", isActive && defaultActiveTabClassName)}
    >
      <Text className={clsx("uppercase", !isActive && defaultTabClassName)}>
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
  getCurrentTab,
}) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const onTabChange = (index: number) => {
    setActiveTabIndex(index);
    getCurrentTab && getCurrentTab(index);
  };

  return (
    <View className="h-full flex-1 ">
      <View className="bg-white">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={titles}
          renderItem={({ item, index }) => (
            <TouchableOpacity key={index} onPress={() => onTabChange(index)}>
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
            backgroundColor: "white",
          }}
        />
      </View>
      <View className="flex-1">
        {children.map((item, index) => {
          return (
            <View
              className={`${index == activeTabIndex ? "flex-1" : "hidden"}`}
              key={index}
            >
              {item}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default TabViewFlatlist;
