// TODO: Implement dialog for web since react-native-dialog is not working on web
import { FC } from "react";
import { Text, Appearance, View, Dimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { Dialog } from "@rneui/themed";

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

  const handleCancel = () => {
    onClosed && onClosed();
  };

  const handleConfirm = () => {
    onConfirm && onConfirm();
  };
  return (
    <Dialog
      isVisible={isVisible}
      onBackdropPress={handleCancel}
      overlayStyle={{
        borderRadius: 20,
        backgroundColor: "#F2F2F2",
        alignItems: "center",
        ...(Dimensions.get("window").width <= 768 ? {} : { maxWidth: 600 }),
      }}
    >
      <Dialog.Title
        title={title}
        titleStyle={{
          color: "black",
        }}
      />
      <Text className="text-center text-sm">{description}</Text>
      <View className="mt-4 flex w-full flex-row">
        {onClosed ? (
          <Dialog.Button
            title={closeButtonLabel ?? t("dialog.cancel")}
            onPress={handleCancel}
            titleStyle={{
              fontSize: 17,
              lineHeight: 22,
              color: "#007AFF",
            }}
            containerStyle={{
              flex: 1,
            }}
          />
        ) : null}
        {onConfirm ? (
          <Dialog.Button
            title={confirmButtonLabel ?? t("dialog.ok")}
            className="font-bold"
            color={confirmButtonColor}
            onPress={handleConfirm}
            testID={confirmButtonTestID}
            titleStyle={{
              fontWeight: "600",
              fontSize: 17,
              lineHeight: 22,
              color: confirmButtonColor || "#007AFF",
            }}
            containerStyle={{
              flex: 1,
            }}
          />
        ) : null}
      </View>
    </Dialog>
  );
};

export default ConfirmDialog;
