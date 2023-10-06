import clsx from "clsx";
import Modal from "react-native-modal";
import { useTranslation } from "react-i18next";
import { FC, useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { TouchableOpacity, View, Text } from "react-native";

import { ICompanyDataUser } from "../../../../types/company";

import Button from "../../Buttons/Button";
import BottomSheet2 from "../../BottomSheet/BottomSheet";
import BottomSheetOption from "../../Buttons/BottomSheetOption";

interface ISelectPickerProps {
  companyList: ICompanyDataUser[];
  show: boolean;
  title?: string;
  selectedIndex?: number;
  onSelect: (value: number | string) => void;
  onCancel: () => void;
  onLoadMore?: () => void;
}

const SelectPickerCompany: FC<ISelectPickerProps> = ({
  companyList,
  show,
  title,
  selectedIndex,
  onSelect,
  onCancel,
  onLoadMore,
}) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<number>(0);

  const hanldeSelectCompany = (index: number) => {
    setSelected(index);
    onSelect(index);
  };

  const handleClose = () => {
    onCancel();
  };

  useEffect(() => {
    setSelected(selectedIndex || 0);
  }, [selectedIndex]);

  return (
    <View>
      <Modal
        isVisible={show}
        onBackdropPress={handleClose}
        hasBackdrop
        onBackButtonPress={handleClose}
        backdropColor={"#85868C"}
        backdropOpacity={0.3}
        style={{ margin: 0, justifyContent: "flex-end" }}
      >
        <TouchableOpacity
          style={{ height: "30%", backgroundColor: "transparent" }}
          activeOpacity={0}
          onPressOut={handleClose}
        ></TouchableOpacity>
        <View className=" flex-1">
          <BottomSheet2 onClose={handleClose} snapPoints={["100%"]}>
            <View className="relative">
              <View className="flex w-full flex-row items-center justify-center pb-8">
                <Text className="text-base font-semibold">{title}</Text>
              </View>
              <FlatList
                data={companyList}
                keyExtractor={(item, index) => `${Math.random()}-${index}}`}
                renderItem={({ item, index }) => {
                  return (
                    <View className="px-4">
                      <BottomSheetOption
                        onPress={() => setSelected(index)}
                        title={item?.name}
                        containerClassName={clsx(
                          "focus:bg-gray-light",
                          index === selected && "bg-gray-light"
                        )}
                        textClassName={clsx(
                          "text-base font-normal",
                          index === selected && "font-semibold"
                        )}
                      />
                    </View>
                  );
                }}
                onEndReached={onLoadMore}
                ListFooterComponent={<View className="h-10" />}
                onEndReachedThreshold={0.5}
                className="h-4/5"
              />
              <View className="absolute bottom-[-20px] h-12 w-full bg-white px-4">
                <Button
                  title={t("save") || "Save"}
                  // onPress={() => onSelect(selected)}
                  onPress={() => hanldeSelectCompany(selected)}
                  containerClassName="bg-primary-default flex-1"
                  textClassName="text-white"
                />
              </View>
            </View>
          </BottomSheet2>
        </View>
      </Modal>
    </View>
  );
};

export default SelectPickerCompany;
