import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import IconClose from '../../../component/asset/icon-close.svg';
import GlobalToastController, {
  GlobalToastRef,
  IGlobalToastProps,
} from './GlobalToastController';

const duration = 2000;
const Toast = () => {
  const fadeAnim = new Animated.Value(0);
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [message, setMessage] = useState('');
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
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setToastVisible(false);
    });
  };

  useEffect(() => {
    if (toastVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        handleHideToast();
      }, duration);
    }
  }, [fadeAnim, duration, toastVisible]);
  if (!toastVisible) return null;

  return (
    <View style={[styles.toastContainer]}>
      <Text className="text-h6  mt-3 text-white">{message}</Text>
      <TouchableOpacity onPress={handleHideToast}>
        <IconClose />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: '#24252B',
    paddingTop: 10,
    paddingBottom: 22,
    paddingRight: 10,
    paddingLeft: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 2000,
  },
  toastText: {
    color: '#fff',
    // textAlign: 'center',
  },
});

export default forwardRef(Toast);
