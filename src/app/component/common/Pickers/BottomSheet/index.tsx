import { FC, ReactNode, useMemo } from "react";
import { FillButton } from "../../Buttons/Button";
import { Text, TouchableOpacity, View } from "react-native";
// import RNBottomSheet, {
//   BottomSheetFooter,
//   BottomSheetView,
// } from '@gorhom/bottom-sheet';
import CloseIcon from "../asset/close-icon.svg";

interface IBottomSheetProps {
  show: boolean;
  title: string;
  children: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}
const BottomSheet: FC<IBottomSheetProps> = ({
  show,
  title,
  children,
  onConfirm,
  onCancel,
}) => {
  const snapPoints = useMemo(() => ["70%"], []);
  return (
    <>
      {/* {show && (
        <RNBottomSheet
          index={0}
          snapPoints={snapPoints}
          backgroundStyle={{ flex: 1 }}
          animateOnMount={false} // Reduce render time when children are complex components
          backdropComponent={({ style: backdropStyle }) => {
            return (
              <View
                style={backdropStyle}
                className="bg-black-light opacity-60"
              ></View>
            );
          }}
          footerComponent={(props) => (
            <BottomSheetFooter {...props}>
              <View {...props} className="mx-6 mb-10">
                <FillButton title="Save" onPress={onConfirm} />
              </View>
            </BottomSheetFooter>
          )}
        >
          <BottomSheetView
            style={{
              flex: 1,
              paddingBottom: 40,
            }}
            enableFooterMarginAdjustment
          >
            <View className="relative mt-3 items-center justify-center">
              <Text className="text-base font-semibold">{title}</Text>
              <TouchableOpacity className="absolute right-4" onPress={onCancel}>
                <CloseIcon />
              </TouchableOpacity>
            </View>
            <View className=" flex-1">{children}</View>
          </BottomSheetView>
        </RNBottomSheet>
      )} */}
    </>
  );
};

export default BottomSheet;
