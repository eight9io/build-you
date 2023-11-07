import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useImperativeHandle,
  FC,
} from "react";
import { Text, Animated, TouchableOpacity, Platform, View } from "react-native";
import IconClose from "../../../component/asset/icon-close.svg";
import GlobalToastController, { GlobalToastRef } from "./GlobalToastController";
import clsx from "clsx";

const duration = 2000;

interface IToastInModalProps {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  isScreenHasBottomNav?: boolean;
}

const ToastInModal: FC<IToastInModalProps> = ({
  isVisible,
  setIsVisible,
  message,
  isScreenHasBottomNav = false,
}) => {
  const fadeAnim = new Animated.Value(0);

  const handleHideToast = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false);
    });
  };

  useEffect(() => {
    if (isVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        handleHideToast();
      }, duration);
    }
  }, [fadeAnim, duration, isVisible]);
  if (!isVisible) return null;

  return (
    <Animated.View
      style={[{ opacity: fadeAnim }]}
      className={clsx(
        "absolute  left-[20px] right-[20px]  z-[2000]  flex-row justify-between rounded-xl bg-[#24252B] pb-[22px] pl-[16px] pr-[10px] pt-[10px] ",
        Platform.OS === "ios" && isScreenHasBottomNav
          ? "bottom-[120px] "
          : "bottom-[100px] ",
        !isScreenHasBottomNav && "bottom-[40px] "
      )}
    >
      <Text className="mt-3  w-[90%] text-h6 text-white">{message}</Text>

      <TouchableOpacity onPress={handleHideToast}>
        <View>
          <IconClose />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ToastInModal;
