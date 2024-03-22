import { FC, useEffect, useRef, useState } from "react";
import { View, Text } from "react-native";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { FlatList } from "react-native-gesture-handler";

import Button from "../../Buttons/Button";
import BottomSheet from "../../BottomSheet/BottomSheet";
import BottomSheetOption from "../../Buttons/BottomSheetOption";

interface ISelectPickerProps {
  show: boolean;
  title?: string;
  data: Array<any> | null | undefined;
  selectedIndex?: number;
  onSelect: (index: number) => void;
  onCancel: () => void;
  onLoadMore?: () => void;
  optionContainerClassName?: string;
  optionTextClassName?: string;
  optionAutoHeight?: boolean;
}
const SelectPicker: FC<ISelectPickerProps> = ({
  show,
  title,
  data,
  selectedIndex,
  onSelect,
  onCancel,
  onLoadMore,
  optionContainerClassName,
  optionTextClassName,
  optionAutoHeight,
}) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<number>(0);
  const bottomSheetRef = useRef(null);

  useEffect(() => {
    setSelected(selectedIndex || 0);
  }, [selectedIndex]);

  useEffect(() => {
    if (show) {
      bottomSheetRef.current?.open();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [show]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      onClose={onCancel}
      HeaderComponent={
        <View className="mt-3 flex w-full flex-row items-center justify-center pb-8">
          <Text className="text-base font-semibold">{title}</Text>
        </View>
      }
      FooterComponent={
        <View className="mb-2 w-full bg-white px-4">
          <Button
            title={t("save") || "Save"}
            onPress={() => onSelect(selected)}
            containerClassName="bg-primary-default flex-1 py-[14px]"
            textClassName="text-white"
          />
        </View>
      }
      modalHeight={500}
    >
      <View className="h-full">
        <FlatList
          data={data}
          keyExtractor={(item, index) => `${Math.random()}-${index}}`}
          renderItem={({ item, index }) => {
            return (
              <View className="px-4">
                <BottomSheetOption
                  onPress={() => setSelected(index)}
                  title={item?.name || item?.label}
                  containerClassName={clsx(
                    "focus:bg-gray-light",
                    index === selected && "bg-gray-light",
                    optionContainerClassName
                  )}
                  textClassName={clsx(
                    "text-base font-normal",
                    index === selected && "font-semibold",
                    optionTextClassName
                  )}
                  autoHeight={optionAutoHeight}
                />
              </View>
            );
          }}
          onEndReached={onLoadMore}
          ListFooterComponent={<View className="h-10" />}
          onEndReachedThreshold={0.5}
        />
      </View>
    </BottomSheet>
  );
};

export default SelectPicker;
