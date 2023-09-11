import { MutableRefObject } from "react";
import { IGlobalDialogProps } from "../../../types/globalDialog";

export type GlobalDialogRef = {
  show: (notification: IGlobalDialogProps) => void;
  hide: () => void;
};

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
