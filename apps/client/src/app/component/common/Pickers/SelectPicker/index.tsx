

import { FC, useEffect, useRef } from 'react';
import Button from '../../Buttons/Button';
import { FlatList, View } from 'react-native';
import BottomSheet from '../BottomSheet';
import clsx from 'clsx';

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
    <BottomSheet
      show={show}
      title="Occupation"
      onConfirm={() => {}}
      onCancel={onCancel}
    >
      <View style={{ flex: 1}}>
        <FlatList
          data={data}
          initialNumToRender={20}
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
    </BottomSheet>
  );
};

export default SelectPicker;
