import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import React, { FC, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface IBottomSheet2Props {
  onClose: () => void;
  snapPoints?: Array<string | number>;
  children?: React.ReactNode;
}

const BottomSheet2: FC<IBottomSheet2Props> = ({
  onClose,
  snapPoints,
  children,
}) => {
  const snapPointsDefault = useMemo(() => ['50%'], []);
  snapPoints = snapPoints || snapPointsDefault;

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={1}
        appearsOnIndex={2}
        pressBehavior={0}
        opacity={0}
      />
    ),
    []
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheet
        index={0}
        snapPoints={snapPoints}
        onClose={onClose}
        backdropComponent={renderBackdrop}
      >
        {children}
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

export default BottomSheet2;
