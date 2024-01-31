// TODO: Implement dialog for web since react-native-dialog is not working on web
import { FC } from "react";
import { View, Text, Appearance, Platform } from "react-native";
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
  const colorScheme = Appearance.getColorScheme();
  const isDarkMode = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";

  const handleCancel = () => {
    onClosed && onClosed();
  };

  const handleConfirm = () => {
    onConfirm && onConfirm();
  };
  return <View></View>;
};

export default ConfirmDialog;
