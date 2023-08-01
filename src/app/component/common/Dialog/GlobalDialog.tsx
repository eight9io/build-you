import { View } from "react-native";
import React, {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import Dialog from "react-native-dialog";
import GlobalDialogController, {
  GlobalDialogRef,
} from "./GlobalDialogController";
import { IGlobalDialogProps } from "../../../types/globalDialog";
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

  return (
    <View className="items-center justify-center bg-white">
      <Dialog.Container visible={modalVisible}>
        <Dialog.Title>{customTitle || t("dialog.alert_title")}</Dialog.Title>
        <Dialog.Description>{customMessage}</Dialog.Description>
        <Dialog.Button
          label={customButton || t("dialog.ok")}
          onPress={() => {
            modalRef.current?.hide();
          }}
        />
      </Dialog.Container>
    </View>
  );
};

export default forwardRef(GlobalDialog);
