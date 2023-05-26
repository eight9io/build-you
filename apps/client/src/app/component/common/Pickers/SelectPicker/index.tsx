import { FC, useEffect, useRef } from 'react';
import { FlatList, TouchableOpacity, View, Text } from 'react-native';
import clsx from 'clsx';
import Modal from 'react-native-modal';

import Button from '../../Buttons/Button';
import BottomSheet2 from '../../BottomSheet/BottomSheet';

interface ISelectPickerProps {
  show: boolean;
  data: ArrayLike<any> | null | undefined;
  selectedIndex?: number;
  onSelect: (index?: number) => void;
  onCancel: () => void;
}
const SelectPicker: FC<ISelectPickerProps> = ({
  show,
  data,
  selectedIndex,
  onSelect,
  onCancel,
}) => {
  const flatListRef = useRef<FlatList>(null);
  useEffect(() => {
    if (selectedIndex) {
      flatListRef.current?.scrollToIndex({
        index: selectedIndex,
        animated: true,
      });
    }
  }, []);
  return (
    <Modal
      isVisible={show}
      onBackdropPress={onCancel}
      onSwipeComplete={onCancel}
      swipeDirection={'down'}
      hasBackdrop
      onBackButtonPress={onCancel}
      backdropColor={'gray'}
      backdropOpacity={0.2}
      style={{ margin: 0, justifyContent: 'flex-end' }}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1}
        onPressOut={onCancel}
      >
        <View className="flex-1">
          <BottomSheet2 onClose={onCancel} snapPoints={['70%']}>
            <View className="relative flex h-full w-full flex-col">
              <View className="pb-44">
                <View className="flex w-full flex-row items-center justify-center pb-10">
                  <Text className="text-base font-semibold">Occupation</Text>
                </View>
                <FlatList
                  data={data}
                  keyExtractor={(item, index) => index.toString()}
                  initialNumToRender={30}
                  showsVerticalScrollIndicator={true}
                  ref={flatListRef}
                  renderItem={({ item, index }) => {
                    return (
                      <View className="px-4">
                        <Button
                          onPress={() => onSelect(index)}
                          title={item.label}
                          containerClassName={clsx(
                            index === selectedIndex && 'bg-gray-light'
                          )}
                          textClassName={clsx(
                            'text-base font-normal',
                            index === selectedIndex && 'font-semibold'
                          )}
                        />
                      </View>
                    );
                  }}
                />
              </View>
              <View className="absolute bottom-10 h-12 w-full px-4">
                <Button
                  title={'Save'}
                  onPress={onSelect}
                  containerClassName="bg-primary-default flex-1"
                  textClassName="text-white"
                />
              </View>
            </View>
          </BottomSheet2>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default SelectPicker;
