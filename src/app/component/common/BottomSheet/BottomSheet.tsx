import { forwardRef, useImperativeHandle } from "react";
import { Modalize, ModalizeProps } from "react-native-modalize";
import { useModalize } from "react-native-modalize/lib/utils/use-modalize";

interface IBottomSheetProps extends ModalizeProps {}

const BottomSheet = forwardRef<any, IBottomSheetProps>(
  (
    { children, HeaderComponent, FloatingComponent, modalHeight, onClose },
    ref
  ) => {
    const { ref: bottomSheetRef, open, close } = useModalize();
    useImperativeHandle(
      ref,
      () => ({
        open: () => {
          open();
        },
        close: () => {
          close();
        },
      }),
      []
    );

    return (
      <Modalize
        ref={bottomSheetRef}
        withReactModal
        onClose={onClose}
        HeaderComponent={HeaderComponent}
        FloatingComponent={FloatingComponent}
        adjustToContentHeight={false}
        modalHeight={modalHeight}
      >
        {children}
      </Modalize>
    );
  }
);

export default BottomSheet;
