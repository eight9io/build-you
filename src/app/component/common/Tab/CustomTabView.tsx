import { FC, ReactNode, useState } from "react";
import { Dimensions } from "react-native";
import {
  TabView,
  Route,
  SceneRendererProps,
  TabBar,
  TabBarItem,
  TabBarIndicator,
} from "react-native-tab-view";
const TAB_MARGIN = 24;
interface ITabViewProps {
  routes: Route[];
  renderScene: (
    props: SceneRendererProps & {
      route: Route;
    }
  ) => ReactNode;
  index: number;
  setIndex: (index: number) => void;
}

export const CustomTabView: FC<ITabViewProps> = ({
  routes,
  renderScene,
  index,
  setIndex,
}) => {
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{
        width: Dimensions.get("window").width,
      }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          scrollEnabled={true}
          indicatorStyle={{
            backgroundColor: "#FF7B1C",
          }}
          tabStyle={{
            width: "auto",
          }}
          style={{ backgroundColor: "#FFFFFF" }}
          renderTabBarItem={(props) => (
            <TabBarItem
              {...props}
              style={{
                paddingVertical: 2.5,
                marginHorizontal: 4,
              }}
              inactiveColor="#000000"
              activeColor="#000000"
            />
          )}
        />
      )}
    />
  );
};

export default CustomTabView;
