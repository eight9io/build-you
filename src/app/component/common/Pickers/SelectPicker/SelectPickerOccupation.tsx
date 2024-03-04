import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { FC, useEffect, useRef, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { FlatList } from "react-native-gesture-handler";
import { View, Text } from "react-native";

import Button from "../../Buttons/Button";
import BottomSheet from "../../BottomSheet/BottomSheet";
import BottomSheetOption from "../../Buttons/BottomSheetOption";
import { IOccupation } from "../../../../types/user";
import TextInput from "../../Inputs/TextInput";
import Warning from "../../../../component/asset/warning.svg";

import { EditProfileOccupationValidators } from "../../../../Validators/EditProfile.validate";

interface ISelectPickerProps {
  occupationList: IOccupation[];
  show: boolean;
  title?: string;
  selectedIndex?: number;
  currentOccupation?: string;
  onSelect: (value: number | string) => void;
  onCancel: () => void;
  onLoadMore?: () => void;
}

const SelectPickerOccupation: FC<ISelectPickerProps> = ({
  occupationList,
  show,
  title,
  selectedIndex,
  onSelect,
  onCancel,
  onLoadMore,
  currentOccupation,
}) => {
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [customOccupationError, setCustomOccupationError] =
    useState<boolean>(false);

  const { t } = useTranslation();
  const [selected, setSelected] = useState<number>(0);

  const { control, getValues } = useForm<{
    occupation: string;
  }>({
    defaultValues: {
      occupation: "",
    },
    resolver: yupResolver(EditProfileOccupationValidators()),
  });
  const bottomSheetRef = useRef(null);

  useEffect(() => {
    setSelected(selectedIndex || 0);
  }, [selectedIndex, occupationList]);

  const handleSelectOccupation = (index: number) => {
    if (index === occupationList.length - 1) {
      setShowCustomInput(true);
      return;
    }
    setSelected(index);
    onSelect(index);
    setShowCustomInput(false);
  };

  const handleClose = () => {
    setShowCustomInput(false);
    onCancel();
  };

  const handleCloseCustomInput = () => {
    setShowCustomInput(false);
    setCustomOccupationError(false);
  };

  const onSubmitCustomOccupation = (data: any) => {
    if (!data.occupation || data?.occupation.trim() === "") {
      setCustomOccupationError(true);
      return;
    }
    onSelect(data.occupation);
    setShowCustomInput(false);
    handleClose();
  };

  useEffect(() => {
    if (show) {
      if (!showCustomInput) bottomSheetRef.current?.open();
    } else {
      if (!showCustomInput) bottomSheetRef.current?.close();
    }
  }, [show]);

  return (
    <View>
      <View className="flex-1">
        <BottomSheet
          ref={bottomSheetRef}
          onClose={() => {
            handleClose();
            showCustomInput && handleCloseCustomInput();
          }}
          HeaderComponent={
            <View className="mt-3 flex w-full flex-row items-center justify-center pb-8">
              <Text className="text-base font-semibold">{title}</Text>
            </View>
          }
          FloatingComponent={
            <View className="h-14 w-full bg-white px-4">
              <Button
                title={t("save") || "Save"}
                onPress={() => {
                  if (showCustomInput) {
                    onSubmitCustomOccupation(getValues());
                  } else {
                    handleSelectOccupation(selected);
                  }
                }}
                containerClassName="bg-primary-default flex-1 mb-2"
                textClassName="text-white"
                testID="complete_profile_step_1_occupation_picker_save_btn"
              />
            </View>
          }
          modalHeight={showCustomInput ? 200 : 500}
        >
          {!showCustomInput ? (
            <View className="h-full">
              <FlatList
                data={occupationList}
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
              />
            </View>
          ) : (
            <View className="relative">
              <Controller
                name="occupation"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="flex flex-col px-5">
                    <TextInput
                      label={
                        t("edit_personal_profile_screen.occupation") ||
                        "Occupation"
                      }
                      placeholder={
                        t("edit_personal_profile_screen.enter_occupation") ||
                        "Enter your occupation"
                      }
                      placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />

                    {customOccupationError ? (
                      <View className="flex flex-row pt-2">
                        <Warning />
                        <Text className="pl-1 text-sm font-normal text-red-500">
                          {t("edit_personal_profile_screen.occupation_error") ||
                            "Please enter your occupation"}
                        </Text>
                      </View>
                    ) : (
                      <View className="h-7" />
                    )}
                  </View>
                )}
              />
            </View>
          )}
        </BottomSheet>
      </View>
    </View>
  );
};

export default SelectPickerOccupation;
