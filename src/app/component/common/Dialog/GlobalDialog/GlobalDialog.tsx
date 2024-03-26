// TODO: Implement dialog for web since react-native-dialog is not working on web
import { Platform, View, Text, Dimensions } from "react-native";
import React, {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Dialog } from "@rneui/themed";
import GlobalDialogController, {
  GlobalDialogRef,
} from "./GlobalDialogController";
import { IGlobalDialogProps } from "../../../../types/globalDialog";

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

  const handleClose = () => {
    modalRef.current?.hide();
  };

  return (
    <Dialog
      isVisible={modalVisible}
      onBackdropPress={handleClose}
      overlayStyle={{
        borderRadius: 20,
        backgroundColor: "#F2F2F2",
        alignItems: "center",
        ...(Dimensions.get("window").width <= 768 ? {} : { maxWidth: 600 }),
      }}
    >
      <Dialog.Title
        title={customTitle || t("dialog.alert_title")}
        titleStyle={{
          color: "black",
        }}
      />
      <Text className="text-center text-sm">{customMessage}</Text>
      <Dialog.Actions>
        <Dialog.Button
          title={customButton || t("dialog.ok")}
          onPress={handleClose}
          titleStyle={{
            fontSize: 17,
            lineHeight: 22,
            color: "#007AFF",
          }}
        />
      </Dialog.Actions>
    </Dialog>
  );
};

export default forwardRef(GlobalDialog);
