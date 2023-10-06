import { FC } from "react";
<<<<<<< HEAD
import { View, Text, Platform } from "react-native";
=======
import { View, Text, Appearance, Platform } from "react-native";
>>>>>>> main
import Dialog from "react-native-dialog";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

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
<<<<<<< HEAD
=======
  const colorScheme = Appearance.getColorScheme();
  const isDarkMode = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";

>>>>>>> main
  const handleCancel = () => {
    onClosed && onClosed();
  };

  const handleConfirm = () => {
    onConfirm && onConfirm();
  };
<<<<<<< HEAD
  const isAndroid = Platform.OS === "android";
=======

>>>>>>> main
  return (
    <View>
      {isVisible && (
        <Dialog.Container visible={true}>
          <Dialog.Title>
<<<<<<< HEAD
            <Text className={clsx(isAndroid && "text-black-default")}>
              {title}
            </Text>
=======
            <Text
              className={clsx(
                "text-black-default",
                isIOS && isDarkMode ? "text-white" : ""
              )}
            >
              {title}
            </Text>{" "}
>>>>>>> main
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
