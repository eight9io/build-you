import clsx from "clsx";
import Modal from "react-native-modal";
import { useTranslation } from "react-i18next";
import { FC, useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { FlatList } from "react-native-gesture-handler";
import { TouchableOpacity, View, Text } from "react-native";

import Button from "../../Buttons/Button";
import BottomSheet2 from "../../BottomSheet/BottomSheet";
import BottomSheetOption from "../../Buttons/BottomSheetOption";
import { IOccupation } from "../../../../types/user";
import { serviceGetListOccupation } from "../../../../service/profile";
import TextInput from "../../Inputs/TextInput";
import Warning from "../../../../component/asset/warning.svg";

import { EditProfileOccupationValidators } from "../../../../Validators/EditProfile.validate";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface ISelectPickerProps {
  occupationList: IOccupation[];
  show: boolean;
  title?: string;
  selectedIndex?: number;
  onSelect: (value: number | string) => void;
  onCancel: () => void;
  onLoadMore?: () => void;
}

const SeletecPickerOccupation: FC<ISelectPickerProps> = ({
  occupationList,
  show,
  title,
  selectedIndex,
  onSelect,
  onCancel,
  onLoadMore,
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

  const hanldeSelectOccupation = (index: number) => {
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
    if (!data.occupation) {
      setCustomOccupationError(true);
      return;
    }
    onSelect(data.occupation);
    setShowCustomInput(false);
    handleClose();
  };

  useEffect(() => {
    setSelected(selectedIndex || 0);
  }, [selectedIndex]);

  return (
    <View>
      {!showCustomInput && (
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
                  className="h-4/5"
                />
                <View className="absolute bottom-[-20px] h-12 w-full bg-white px-4">
                  <Button
                    title={t("save") || "Save"}
                    // onPress={() => onSelect(selected)}
                    onPress={() => hanldeSelectOccupation(selected)}
                    containerClassName="bg-primary-default flex-1"
                    textClassName="text-white"
                    testID="complete_profile_step_1_occupation_picker_save_btn"
                  />
                </View>
              </View>
            </BottomSheet2>
          </View>
        </Modal>
      )}

      {showCustomInput && (
        <Modal
          isVisible={showCustomInput}
          hasBackdrop
          onBackButtonPress={handleCloseCustomInput}
          backdropColor={"#85868C"}
          backdropOpacity={0.3}
          style={{
            margin: 0,
            justifyContent: "flex-end",
            zIndex: 100,
            position: "relative",
          }}
        >
          <TouchableOpacity
            style={{ height: "40%", backgroundColor: "transparent" }}
            activeOpacity={0}
            onPressOut={handleCloseCustomInput}
          ></TouchableOpacity>
          <View className=" flex-1">
            <BottomSheet2
              onClose={handleCloseCustomInput}
              snapPoints={["100%"]}
            >
              <View className="relative">
                <View className="flex w-full flex-row items-center justify-center pb-8">
                  <Text className="text-base font-semibold">{title}</Text>
                </View>
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
                            {t(
                              "edit_personal_profile_screen.occupation_error"
                            ) || "Please enter your occupation"}
                          </Text>
                        </View>
                      ) : (
                        <View className="h-7" />
                      )}
                    </View>
                  )}
                />
              </View>
            </BottomSheet2>
          </View>
          <View className="absolute bottom-10 h-12 w-full bg-white px-4">
            <Button
              title={t("save") || "Save"}
              onPress={() => onSubmitCustomOccupation(getValues())}
              containerClassName="bg-primary-default flex-1"
              textClassName="text-white"
            />
          </View>
        </Modal>
      )}
    </View>
  );
};

export default SeletecPickerOccupation;
