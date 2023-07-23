import React, { useEffect } from "react";
import { StyleSheet, View, Dimensions, Animated } from "react-native";

const { width } = Dimensions.get("window");

const SkeletonLoadingChallengesScreen = () => {
  const circleAnimatedValue = new Animated.Value(0);

  const circleAnimated = () => {
    Animated.loop(
      Animated.timing(circleAnimatedValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  };

  useEffect(() => {
    circleAnimated();
  }, []);

  const translateX = circleAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, width],
  });

  // TODO use tailwind
  return (
    <View style={styles.container}>
      <View className="flex flex-col justify-between p-4">
        <View
          style={{
            flex: 1,
            padding: 16,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              width: "100%",
              height: 250,
              backgroundColor: "#85868C",
              overflow: "hidden",
              opacity: 0.1,
              borderRadius: 10,
            }}
          >
            <Animated.View
              style={{
                width: "20%",
                height: "100%",
                backgroundColor: "#E8E9F1",
                opacity: 0.5,
                transform: [{ translateX: translateX }],
              }}
            />
          </View>
          <View
            style={{
              width: "100%",
              height: 35,
              marginTop: 10,
              backgroundColor: "#85868C",
              overflow: "hidden",
              opacity: 0.1,
              borderRadius: 10,
            }}
          >
            <Animated.View
              style={{
                width: "20%",
                height: "100%",
                backgroundColor: "#E8E9F1",
                opacity: 0.5,
                transform: [{ translateX }],
              }}
            />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            padding: 16,
            marginTop: 290,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              width: "100%",
              height: 250,
              backgroundColor: "#85868C",
              overflow: "hidden",
              opacity: 0.1,
              borderRadius: 10,
            }}
          >
            <Animated.View
              style={{
                width: "20%",
                height: "100%",
                backgroundColor: "#E8E9F1",
                opacity: 0.5,
                transform: [{ translateX }],
              }}
            />
          </View>
          <View
            style={{
              width: "100%",
              height: 35,
              marginTop: 10,
              backgroundColor: "#85868C",
              overflow: "hidden",
              opacity: 0.1,
              borderRadius: 10,
            }}
          >
            <Animated.View
              style={{
                width: "20%",
                height: "100%",
                backgroundColor: "#E8E9F1",
                opacity: 0.5,
                transform: [{ translateX }],
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default SkeletonLoadingChallengesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECEFF1",
  },
});
