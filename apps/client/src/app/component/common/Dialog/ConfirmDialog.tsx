import clsx from 'clsx';
import  { FC,  useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import Dialog from 'react-native-dialog';

interface IComfirmDialogProps {
  title?: string;
  actions?: any;
  isVisible?: boolean;
  onClosed?: () => void;
}

const ConfirmDialog:FC<IComfirmDialogProps> = ({
  title,
  actions,
  isVisible,
  onClosed,
}) => {

  const handleCancel = () => {
    onClosed && onClosed();
  };

  const handleDelete = () => {
    onClosed && onClosed();
  };

  return (
    <View className={clsx('flex-1 bg-white items-center justify-center')}>
      <Dialog.Container visible={isVisible}>
        <Dialog.Title>Account delete</Dialog.Title>
        <Dialog.Description>
          Do you want to delete this account? You cannot undo this action.
        </Dialog.Description>
        <Dialog.Button label='Cancel' onPress={handleCancel} />
        <Dialog.Button label='Delete' onPress={handleDelete} />
      </Dialog.Container>
    </View>
  );
}

export default ConfirmDialog;
