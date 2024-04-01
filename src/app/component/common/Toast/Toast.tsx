import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Text,
  Animated,
  TouchableOpacity,
  Platform,
  View,
  Dimensions,
} from "react-native";
import IconClose from "../../../component/asset/icon-close.svg";
import GlobalToastController, {
  GlobalToastRef,
  IGlobalToastProps,
} from "./GlobalToastController";
import clsx from "clsx";
import {
  DRAWER_MAX_WIDTH,
  LAYOUT_THRESHOLD,
  MAIN_SCREEN_MAX_WIDTH,
} from "../../../common/constants";

const duration = 4000;
const Toast = () => {
  const fadeAnim = new Animated.Value(0);
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [message, setMessage] = useState("");
  const [isScreenHasBottomNav, setIsScreenHasBottomNav] =
    useState<boolean>(true);

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
        setIsScreenHasBottomNav(notification.isScreenHasBottomNav);
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
      style={[
        {
          opacity: fadeAnim,
          maxWidth:
            Dimensions.get("window").width <= LAYOUT_THRESHOLD ? "100%" : 500,
        },
      ]}
      className={clsx(
        Dimensions.get("window").width <= LAYOUT_THRESHOLD
          ? "absolute left-[20px] right-[20px] z-[2000] flex-row justify-between rounded-xl bg-[#24252B] pb-[22px] pl-[16px] pr-[10px] pt-[10px] "
          : "absolute left-4 right-4 z-[2000] w-full flex-row justify-between rounded-xl bg-[#24252B] px-4 pb-[22px] pt-[10px]",
        isScreenHasBottomNav ? "bottom-[120px]" : "bottom-[24px]"
      )}
    >
      <Text className="mt-3 w-[90%] text-h6 text-white">{message}</Text>

      <TouchableOpacity onPress={handleHideToast}>
        <View>
          <IconClose />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default forwardRef(Toast);
