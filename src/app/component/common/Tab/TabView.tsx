import clsx from "clsx";
import { FC, ReactNode } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

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
  activeTabIndex: number;
  setActiveTabIndex: (index: number) => void;
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

export const TabView: FC<ITabViewProps> = ({
  titles,
  children,
  activeTabClassName,
  defaultTabClassName,
  activeTabIndex,
  setActiveTabIndex,
}) => {
  // remove falsey values from children
  children = children.filter(Boolean);

  return (
    <View className="flex h-full flex-1 flex-col">
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="mx-4 flex flex-row">
            {titles.map((title, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => setActiveTabIndex(index)}
                >
                  <TabTitle
                    title={title}
                    isActive={index === activeTabIndex}
                    activeTabClassName={activeTabClassName}
                    defaultTabClassName={defaultTabClassName}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
      <View className="flex-1 bg-gray-veryLight">
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

export default TabView;
