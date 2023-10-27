import { MutableRefObject } from "react";

export type GlobalToastRef = {
  show: (notification: IGlobalToastProps) => void;
};

export interface IGlobalToastProps {
  message?: string;
  isScreenHasBottomNav?: boolean;
}

export default class GlobalToastController {
  static modalRef: MutableRefObject<GlobalToastRef>;
  static setModalRef = (ref: any) => {
    this.modalRef = ref;
  };

  static showModal = (notification: IGlobalToastProps) => {
    this.modalRef.current?.show(notification);
  };
}
