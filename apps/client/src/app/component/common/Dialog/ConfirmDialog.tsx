import clsx from 'clsx';
import { FC, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import Dialog from 'react-native-dialog';

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
    <View className={clsx('flex-1 items-center justify-center bg-white')}>
      <Dialog.Container visible={isVisible}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>{description}</Dialog.Description>
        {onClosed && (
          <Dialog.Button
            label={closeButtonLabel ?? 'Cancel'}
            onPress={handleCancel}
          />
        )}
        {onConfirm && (
          <Dialog.Button
            label={confirmButtonLabel ?? 'Confirm'}
            onPress={handleConfirm}
          />
        )}
      </Dialog.Container>
    </View>
  );
};

export default ConfirmDialog;
