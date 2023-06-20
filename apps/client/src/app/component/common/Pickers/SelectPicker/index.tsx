import { FC, useEffect, useState, useRef } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import clsx from 'clsx';
import Modal from 'react-native-modal';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';

import Button from '../../Buttons/Button';
import BottomSheet2 from '../../BottomSheet/BottomSheet';
import {
  FlatList,
  ScrollView,
  NativeViewGestureHandler,
} from 'react-native-gesture-handler';

interface ISelectPickerProps {
  show: boolean;
  data: Array<any> | null | undefined;
  selectedIndex?: number;
  onSelect: (index: number) => void;
  onCancel: () => void;
}
const SelectPicker: FC<ISelectPickerProps> = ({
  show,
  data,
  selectedIndex,
  onSelect,
  onCancel,
}) => {
  const [selected, setSelected] = useState<number>(0);
  // const flatListRef = useRef<FlatList>(null);
  // useEffect(() => {
  //   if (selectedIndex) {
  //     flatListRef.current?.scrollToIndex({
  //       index: selectedIndex || 0,
  //       animated: true,
  //     });
  //   }
  // }, []);

  return (
    <Modal
      isVisible={show}
      onBackdropPress={onCancel}
      // onSwipeComplete={onCancel}
      // swipeDirection={'down'}
      hasBackdrop
      onBackButtonPress={onCancel}
      backdropColor={'#85868C'}
      backdropOpacity={0.3}
      style={{ margin: 0, justifyContent: 'flex-end' }}
    >
      <TouchableOpacity
        style={{ height: '30%', backgroundColor: 'transperent' }}
        activeOpacity={0}
        onPressOut={onCancel}
      ></TouchableOpacity>
      <View className="flex-1">
        <BottomSheet2 onClose={onCancel} snapPoints={['100%']}>
          <View className="relative">
            <View className="flex w-full flex-row items-center justify-center pb-8">
              <Text className="text-base font-semibold">Occupation</Text>
            </View>
            <ScrollView className="h-4/5">
              <View className="flex h-full w-full flex-col pb-10 ">
                {data?.map((item, index) => {
                  return (
                    <View className="px-4" key={`${item?.name + index}`}>
                      <Button
                        onPress={() => setSelected(index)}
                        title={item.name}
                        containerClassName={clsx(
                          'focus:bg-gray-light',
                          index === selected && 'bg-gray-light'
                        )}
                        textClassName={clsx(
                          'text-base font-normal',
                          index === selected && 'font-semibold'
                        )}
                      />
                    </View>
                  );
                })}
              </View>
            </ScrollView>

            {/* TODO: if we want to use FlatList instead of ScrollView for scrolling to the selected item, we need to fix the height of the FlatList */}
            {/* <FlatList
              data={data}
              keyExtractor={(item, index) => `${item?.name + index}`}
              renderItem={({ item, index }) => {
                return (
                  <View className="px-4" key={`${item?.name + index}`}>
                    <Button
                      onPress={() => onSelect(index)}
                      title={item.name}
                      containerClassName={clsx(
                        'focus:bg-gray-light',
                        index === selectedIndex && 'bg-gray-light'
                      )}
                      textClassName={clsx(
                        'text-base font-normal',
                        index === selectedIndex && 'font-semibold'
                      )}
                    />
                  </View>
                );
              }
              }
            /> */}
            <View className="absolute bottom-[-40px] h-12 w-full px-4">
              <Button
                title={'Save'}
                onPress={() => onSelect(selected)}
                containerClassName="bg-primary-default flex-1"
                textClassName="text-white"
              />
            </View>
          </View>
        </BottomSheet2>
      </View>
    </Modal>
  );
};

export default SelectPicker;
