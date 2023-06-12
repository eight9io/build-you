import {
  FC,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useLayoutEffect,
} from 'react';
import { View, Text } from 'react-native';
import Dialog from 'react-native-dialog';
import GlobalDialogController from './GlobalDialogController';

export interface GlobalDialogRef {
  openGlobalDialog: (
    title: string,
    description: string,
    closeButtonLabel: string,
    confirmButtonLabel: string
  ) => void;
  closeGlobalDialog: () => void;
}

const GlobalDialog = () => {
  const [isGlobalDialogVisible, setIsGlobalDialogVisible] =
    useState<boolean>(false);
  const [globalDialogTitle, setGlobalDialogTitle] = useState<string>('');
  const [globalDialogDescription, setGlobalDialogDescription] =
    useState<string>('');
  const [globalDialogCloseButtonLabel, setGlobalDialogCloseButtonLabel] =
    useState<string>('');
  const [globalDialogConfirmButtonLabel, setGlobalDialogConfirmButtonLabel] =
    useState<string>('');

  const modalRef = useRef<GlobalDialogRef>(null);

  useLayoutEffect(() => {
    GlobalDialogController(modalRef);
  }, []);

  useImperativeHandle(
    modalRef,
    () => ({
      openGlobalDialog: (
        title,
        description,
        closeButtonLabel,
        confirmButtonLabel
      ) => {
        setGlobalDialogTitle(title);
        setGlobalDialogDescription(description);
        setGlobalDialogCloseButtonLabel(closeButtonLabel);
        setGlobalDialogConfirmButtonLabel(confirmButtonLabel);
        setIsGlobalDialogVisible(true);
      },
      closeGlobalDialog: () => {
        setIsGlobalDialogVisible(false);
      },
    }),
    []
  );

  return (
    <View>
      <Dialog.Container visible={isGlobalDialogVisible}>
        <Dialog.Title>{globalDialogTitle}</Dialog.Title>
        <Dialog.Description>{globalDialogDescription}</Dialog.Description>
        {globalDialogCloseButtonLabel && (
          <Dialog.Button
            label={globalDialogCloseButtonLabel}
            onPress={() => setIsGlobalDialogVisible(false)}
          />
        )}
        {globalDialogConfirmButtonLabel && (
          <Dialog.Button
            label={globalDialogConfirmButtonLabel}
            onPress={() => setIsGlobalDialogVisible(false)}
          />
        )}
      </Dialog.Container>
    </View>
  );
};

export default forwardRef(GlobalDialog);
