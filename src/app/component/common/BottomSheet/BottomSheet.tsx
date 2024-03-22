import { forwardRef, useImperativeHandle } from "react";
import { Dimensions, View } from "react-native";
import { Modalize, ModalizeProps } from "react-native-modalize";
import { useModalize } from "react-native-modalize/lib/utils/use-modalize";

interface IBottomSheetProps extends ModalizeProps {}

const BottomSheet = forwardRef<any, IBottomSheetProps>(
  (
    { children, HeaderComponent, FooterComponent, modalHeight, onClose },
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
        FooterComponent={
          <View className="mb-3 h-14 w-full px-4">{FooterComponent}</View>
        }
        adjustToContentHeight={false}
        modalHeight={modalHeight}
        modalStyle={
          Dimensions.get("window").width > 768
            ? {
                width: 600,
                maxWidth: 600,
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                marginLeft: "auto",
                marginRight: "auto",
                paddingHorizontal: 24,
              }
            : {}
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
