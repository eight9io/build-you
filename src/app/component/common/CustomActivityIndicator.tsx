import React, { PropsWithChildren } from "react";
import {
  View,
  StyleSheet,
  Platform,
  Pressable,
  Modal,
  ModalProps,
  ViewStyle,
  StyleProp,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";

import { PressableProps, GestureResponderEvent } from "react-native";

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export type Theme = {
  colors: string;
  spacing: ThemeSpacing;
};

export type ThemedProps<T> = T & {
  theme?: Theme;
};

export type ThemedPropsWithChildren<T> = PropsWithChildren<ThemedProps<T>>;

export type RneFunctionComponent<T> = React.FunctionComponent<
  ThemedPropsWithChildren<T>
>;

const getBehaviorType = Platform.OS === "ios" ? "padding" : "height";

export interface InlinePressableProps {
  /**
   * Called when a single tap gesture is detected.
   * @type GestureResponderEventHandler
   */
  onPress?: (event: GestureResponderEvent) => void;

  /**
   * Called when a touch is engaged before `onPress`.
   * @type GestureResponderEventHandler
   */
  onPressIn?: (event: GestureResponderEvent) => void;

  /**
   * Called when a touch is released before `onPress`.
   * @type GestureResponderEventHandler
   */
  onPressOut?: (event: GestureResponderEvent) => void;

  /**
   * Called when a long-tap gesture is detected.
   * @type GestureResponderEventHandler
   */
  onLongPress?: (event: GestureResponderEvent) => void;

  /**
   * @default None
   * @type PressableProps except click handlers
   */
  pressableProps?: Omit<
    PressableProps,
    "onPress" | "onLongPress" | "onPressIn" | "onPressOut"
  >;
}

export interface OverlayProps
  extends Omit<ModalProps, "visible">,
    Omit<InlinePressableProps, "onPress"> {
  /** If true, the overlay is visible. */
  isVisible: boolean;

  /** Style of the backdrop container. */
  backdropStyle?: StyleProp<ViewStyle>;

  /** Style of the actual overlay. */
  overlayStyle?: StyleProp<ViewStyle>;

  /** Handler for backdrop press (only works when `fullscreen` is false). */
  onBackdropPress?(): void;

  /** If set to true, the modal will take up the entire screen width and height. */
  fullScreen?: boolean;

  /** Override React Native `Modal` component (usable for web-platform). */
  ModalComponent?: typeof React.Component;
}

/** The Overlay is a view that floats above an app’s content.
 * Overlays are an easy way to inform or request information from the user. */
export const CustomActivityIndicator: RneFunctionComponent<OverlayProps> = ({
  children,
  backdropStyle,
  overlayStyle,
  onBackdropPress = () => null,
  fullScreen = true,
  ModalComponent = Modal,
  isVisible,
  pressableProps,
  onPressOut,
  onPressIn,
  onLongPress,
  theme,
  ...rest
}) => (
  <ModalComponent
    visible={isVisible}
    onRequestClose={onBackdropPress}
    transparent
    {...rest}
  >
    <Pressable
      style={StyleSheet.flatten([styles.backdrop, backdropStyle])}
      onPress={onBackdropPress}
      testID="RNE__Overlay__backdrop"
      {...pressableProps}
      {...{ onPressOut, onPressIn, onLongPress }}
    />

    <KeyboardAvoidingView
      testID="RNE__Overlay__Container"
      style={styles.container}
      pointerEvents="box-none"
      behavior={getBehaviorType}
    >
      <View
        testID="RNE__Overlay"
        style={StyleSheet.flatten([
          styles.overlay,
          fullScreen && styles.fullscreen,
          {
            backgroundColor: `rgb(156, 163, 175, 0.5)`,
          },
          overlayStyle,
        ])}
      >
        <ActivityIndicator size="large" color="#E7E9F1" />
      </View>
    </KeyboardAvoidingView>
  </ModalComponent>
);

export default CustomActivityIndicator;

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, .2)",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  fullscreen: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    backgroundColor: "white",
    borderRadius: 3,
    padding: 10,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      default: {
        shadowColor: "rgba(0, 0, 0, .3)",
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 4,
      },
    }),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

CustomActivityIndicator.displayName = "CustomActivityIndicator";
