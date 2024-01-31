// TODO: Implement dialog for web since react-native-dialog is not working on web
import { Platform, View, Text } from "react-native";
import React, {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import GlobalDialogController, {
  GlobalDialogRef,
} from "./GlobalDialogController";
import { IGlobalDialogProps } from "../../../../types/globalDialog";
import { useTranslation } from "react-i18next";

const GlobalDialog = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string | undefined>(undefined);
  const [customMessage, setCustomMessage] = useState<string | undefined>(
    undefined
  );
  const [customButton, setCustomButton] = useState<string | undefined>(
    undefined
  );
  const { t } = useTranslation();

  const isIOS = Platform.OS === "ios";
  const modalRef = useRef<GlobalDialogRef>();

  useLayoutEffect(() => {
    GlobalDialogController.setModalRef(modalRef);
  }, []);

  useImperativeHandle(
    modalRef,
    () => ({
      show: (notification: IGlobalDialogProps) => {
        setModalVisible(true);
        if (notification.title) {
          setCustomTitle(notification.title);
        }
        if (notification.message) {
          setCustomMessage(notification.message);
        }
        if (notification.button) {
          setCustomButton(notification.button);
        }
      },
      hide: () => {
        setModalVisible(false);
      },
    }),
    []
  );

  return <View></View>;
};

export default forwardRef(GlobalDialog);
