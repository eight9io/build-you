import { MutableRefObject } from 'react';

export type GlobalDialogRef = {
  show: (notification: IGlobalDialogProps) => void;
  hide: () => void;
};

export interface IGlobalDialogProps {
  title?: 'Success' | 'Error' | 'Alert';
  message?: string;
  button?: string;
}

export default class GlobalDialogController {
  static modalRef: MutableRefObject<GlobalDialogRef>;
  static setModalRef = (ref: any) => {
    this.modalRef = ref;
  };

  static showModal = (notification: IGlobalDialogProps) => {
    this.modalRef.current?.show(notification);
  };
  static hideModal = () => {
    this.modalRef.current?.hide();
  };
}
