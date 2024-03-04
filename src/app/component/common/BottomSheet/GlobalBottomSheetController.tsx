import { MutableRefObject } from "react";

export type TGlobalBottomSheet = {
  open: () => void;
};

export default class GlobalBottomSheetController {
  static bottomSheetRef: MutableRefObject<TGlobalBottomSheet>;
  static setBottomSheetRef = (ref: any) => {
    this.bottomSheetRef = ref;
  };

  static open = () => {
    console.log("open bottom sheet in global controller");
    this.bottomSheetRef.current?.open();
  };
}
