import { FC, ReactNode, useEffect, useState } from "react";
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
  const [animationEnabled, setAnimationEnabled] = useState<boolean>(false);

  useEffect(() => {
    // This is a hack to fix tab indicator not sync with current active tab
    // due to tab indicator's animation delay when we change tab index immediately after tab view is rendered
    setTimeout(() => setAnimationEnabled(true), 1000); // 500ms is the delay time to wait for the tab indicator initialization => Increase this value when render logic is more complex or disable animation if the render process is too slow
  }, []);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{
        width: Dimensions.get("window").width,
      }}
      swipeEnabled={false}
      animationEnabled={animationEnabled}
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
