import { FC } from "react";
import { View, Text } from "react-native";
import Dialog from "react-native-dialog";
import { useTranslation } from "react-i18next";

interface IComfirmDialogProps {
  title?: string;
  description?: string;
  isVisible?: boolean;
  closeButtonLabel?: string;
  confirmButtonLabel?: string;
  confirmButtonColor?: string;
  onClosed?: () => void;
  onConfirm?: () => void;
  confirmButtonTestID?: string;
}

const ConfirmDialog: FC<IComfirmDialogProps> = ({
  title,
  description,
  isVisible,
  onClosed,
  closeButtonLabel,
  onConfirm,
  confirmButtonLabel,
  confirmButtonColor,
  confirmButtonTestID,
}) => {
  const { t } = useTranslation();
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
          <Dialog.Title>
            <Text className="text-black-default">{title}</Text>
          </Dialog.Title>
          <Dialog.Description>{description}</Dialog.Description>
          {onClosed && (
            <Dialog.Button
              label={closeButtonLabel ?? t("dialog.cancel")}
              onPress={handleCancel}
            />
          )}
          {onConfirm && (
            <Dialog.Button
              bold
              label={confirmButtonLabel ?? t("dialog.ok")}
              color={confirmButtonColor}
              onPress={handleConfirm}
              testID={confirmButtonTestID}
            />
          )}
        </Dialog.Container>
      )}
    </View>
  );
};

export default ConfirmDialog;
