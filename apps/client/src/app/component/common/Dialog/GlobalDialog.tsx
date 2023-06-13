import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import React, {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import Dialog from 'react-native-dialog';
import GlobalDialogController, {
  GlobalDialogRef,
} from './GlobalDialogController';

const GlobalDialog = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  const modalRef = useRef<GlobalDialogRef>();

  useLayoutEffect(() => {
    GlobalDialogController.setModalRef(modalRef);
  }, []);

  useImperativeHandle(
    modalRef,
    () => ({
      show: (message?: string) => {
        setModalVisible(true);
        if (message) {
          setCustomMessage(message);
        }
      },
      hide: () => {
        setModalVisible(false);
        setCustomMessage('');
      },
    }),
    []
  );

  return (
    <View className='items-center justify-center bg-white'>
      <Dialog.Container visible={modalVisible}>
        <Dialog.Title>Alert</Dialog.Title>
        <Dialog.Description>{customMessage}</Dialog.Description>
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            modalRef.current?.hide();
          }}
        />
      </Dialog.Container>
    </View>
  );
};

export default forwardRef(GlobalDialog);
