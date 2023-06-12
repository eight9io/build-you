import { MutableRefObject } from 'react';
import { GlobalDialogRef } from './GlobalDialog';

export default function GlobalDialogController(
  ref: MutableRefObject<GlobalDialogRef> | undefined
) {
  const openGlobalDialog = (
    title: string,
    description: string,
    closeButtonLabel: string,
    confirmButtonLabel: string
  ) => {
    if (!ref) return;
    ref.current?.openGlobalDialog(
      title,
      description,
      closeButtonLabel,
      confirmButtonLabel
    );
  };

  const closeGlobalDialog = () => {
    if (!ref) return;
    ref.current?.closeGlobalDialog();
  };

  return {
    openGlobalDialog,
    closeGlobalDialog,
  };
}
