import { FC } from "react";
import { View } from "react-native";
import Dialog from "react-native-dialog";
import i18n from "../../../i18n/i18n";
interface IComfirmDialogProps {
  title?: string;
  description?: string;
  isVisible?: boolean;
  closeButtonLabel?: string;
  confirmButtonLabel?: string;
  onClosed?: () => void;

  onConfirm?: () => void;
}

const ConfirmDialog: FC<IComfirmDialogProps> = ({
  title,
  description,
  isVisible,
  onClosed,
  closeButtonLabel,
  onConfirm,
  confirmButtonLabel,
}) => {
  const handleCancel = () => {
    onClosed && onClosed();
  };

  const handleConfirm = () => {
    onConfirm && onConfirm();
  };

  return (
    <View>
      {isVisible && (
        <Dialog.Container visible={true}>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>{description}</Dialog.Description>
          {onClosed && (
            <Dialog.Button
              label={closeButtonLabel ?? i18n.t("dialog.cancel")}
              onPress={handleCancel}
            />
          )}
          {onConfirm && (
            <Dialog.Button
              bold
              label={confirmButtonLabel ?? i18n.t("dialog.ok")}
              onPress={handleConfirm}
            />
          )}
        </Dialog.Container>
      )}
    </View>
  );
};

export default ConfirmDialog;
