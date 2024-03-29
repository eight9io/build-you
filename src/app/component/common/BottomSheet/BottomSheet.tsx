import { forwardRef, useImperativeHandle, useState } from "react";
import { Dimensions } from "react-native";
import { Modalize, ModalizeProps } from "react-native-modalize";
import { useModalize } from "react-native-modalize/lib/utils/use-modalize";
import {
  DRAWER_MAX_WIDTH,
  LAYOUT_THRESHOLD,
  MAIN_SCREEN_MAX_WIDTH,
  MODAL_MAX_WIDTH,
  SCREEN_WITHOUT_DRAWER_MAX_WIDTH,
} from "../../../common/constants";

interface IBottomSheetProps extends ModalizeProps {
  shouldOffsetDrawerWidth?: boolean;
}

const BottomSheet = forwardRef<any, IBottomSheetProps>(
  (
    { children, HeaderComponent, FooterComponent, modalHeight, onClose },
    ref
  ) => {
    const [shouldOffsetDrawerWidth, setShouldOffsetDrawerWidth] =
      useState(true);
    const { ref: bottomSheetRef, open, close } = useModalize();
    useImperativeHandle(
      ref,
      () => ({
        open: (props?: IBottomSheetProps) => {
          if (
            props?.shouldOffsetDrawerWidth !== undefined &&
            props?.shouldOffsetDrawerWidth !== null
          ) {
            setShouldOffsetDrawerWidth(props.shouldOffsetDrawerWidth);
          }
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
        FooterComponent={FooterComponent}
        adjustToContentHeight={false}
        modalHeight={modalHeight}
        modalStyle={
          Dimensions.get("window").width > LAYOUT_THRESHOLD
            ? {
                width: shouldOffsetDrawerWidth
                  ? MODAL_MAX_WIDTH
                  : SCREEN_WITHOUT_DRAWER_MAX_WIDTH,
                maxWidth: shouldOffsetDrawerWidth
                  ? MODAL_MAX_WIDTH
                  : SCREEN_WITHOUT_DRAWER_MAX_WIDTH,
                position: "absolute",
                left: `calc(50% - ${
                  shouldOffsetDrawerWidth
                    ? (MAIN_SCREEN_MAX_WIDTH - DRAWER_MAX_WIDTH) / 2
                    : SCREEN_WITHOUT_DRAWER_MAX_WIDTH / 2
                }px)`,
                bottom: 0,
                paddingHorizontal: 24,
              }
            : { paddingHorizontal: 24 }
        }
        overlayStyle={{
          height: "100vh",
        }}
      >
        {children}
      </Modalize>
    );
  }
);

export default BottomSheet;
