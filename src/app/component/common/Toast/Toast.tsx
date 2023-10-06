import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Text, Animated, TouchableOpacity, Platform, View } from "react-native";
import IconClose from "../../../component/asset/icon-close.svg";
import GlobalToastController, {
  GlobalToastRef,
  IGlobalToastProps,
} from "./GlobalToastController";
import clsx from "clsx";

const duration = 2000;
const Toast = () => {
  const fadeAnim = new Animated.Value(0);
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [message, setMessage] = useState("");
  const toastRef = useRef<GlobalToastRef>();
  useLayoutEffect(() => {
    GlobalToastController.setModalRef(toastRef);
  }, []);

  useImperativeHandle(
    toastRef,
    () => ({
      show: (notification: IGlobalToastProps) => {
        setToastVisible(true);
        if (notification.message) {
          setMessage(notification.message);
        }
      },
    }),
    []
  );

  const handleHideToast = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setToastVisible(false);
    });
  };

  useEffect(() => {
    if (toastVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        handleHideToast();
      }, duration);
    }
  }, [fadeAnim, duration, toastVisible]);
  if (!toastVisible) return null;

  return (
    <Animated.View
      style={[{ opacity: fadeAnim }]}
      className={clsx(
        "absolute  left-[20px] right-[20px]  z-[2000]  flex-row justify-between rounded-xl bg-[#24252B] pb-[22px] pl-[16px] pr-[10px] pt-[10px] ",
        Platform.OS === "ios" ? "bottom-[120px] " : "bottom-[100px] "
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

export default forwardRef(Toast);
