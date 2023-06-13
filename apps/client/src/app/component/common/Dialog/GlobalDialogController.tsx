import { MutableRefObject } from 'react';

export type GlobalDialogRef = {
  show: (message?: string) => void;
  hide: () => void;
};

export default class GlobalDialogController {
  static modalRef: MutableRefObject<GlobalDialogRef>;
  static setModalRef = (ref: any) => {
    this.modalRef = ref;
  };

  static showModal = (message?: string) => {
    this.modalRef.current?.show(message);
  };
  static hideModal = () => {
    console.log('hide modal');
    this.modalRef.current?.hide();
  };
}
