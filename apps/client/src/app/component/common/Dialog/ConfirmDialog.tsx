import clsx from 'clsx';
import { FC, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import Dialog from 'react-native-dialog';

interface IComfirmDialogProps {
  title?: string;
  actions?: any;
  isVisible?: boolean;
  onClosed?: () => void;
  description?: string;
}

const ConfirmDialog: FC<IComfirmDialogProps> = ({
  title,
  actions,
  isVisible,
  onClosed,
  description,
}) => {
  const handleCancel = () => {
    onClosed && onClosed();
  };

  const handleDelete = () => {
    onClosed && onClosed();
  };

  return (
    <View
      className={clsx('h-full flex-1 items-center justify-center bg-white')}
    >
      <Dialog.Container visible={isVisible}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>{description}</Dialog.Description>
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Delete" onPress={handleDelete} />
      </Dialog.Container>
    </View>
  );
};

export default ConfirmDialog;
