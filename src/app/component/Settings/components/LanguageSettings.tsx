import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, TouchableOpacity } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import i18n from "../../../i18n/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LANGUAGE_OPTIONS = [
  {
    label: "English",
    value: "en",
  },
  {
    label: "Italian",
    value: "it",
  },
];

export const getLanguageLocalStorage = async () => {
  const language = await AsyncStorage.getItem("language");
  if (language) {
    return language;
  }
  return "it";
};

export const setLanguageLocalStorage = async (language: string) => {
  await AsyncStorage.setItem("language", language);
};

const LanguageSettings = () => {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(LANGUAGE_OPTIONS);
  const [placeholder, setPlaceholder] = useState<string>(null);

  const { t } = useTranslation();

  const handleSelectLanguage = (language: string) => {
    setOpenDropdown(false);
    if (language === "en") {
      i18n.changeLanguage("en");
      setLanguageLocalStorage("en");
    }
    if (language === "it") {
      i18n.changeLanguage("it");
      setLanguageLocalStorage("it");
    }
  };

  useEffect(() => {
    const getLanguage = async () => {
      const language = await getLanguageLocalStorage();
      if (language === "en") {
        setPlaceholder("English");
        return;
      }
      if (language === "it") {
        setPlaceholder("Italian");
        return;
      }
      setPlaceholder("Italian");
    };
    getLanguage();
  }, []);

  return (
    <View className={clsx("flex flex-col pt-4")}>
      <View className={clsx("py-4")}>
        <Text className={clsx("text-h4 font-medium")}>
          {t("user_settings_screen.account_settings_language.language")}
        </Text>
      </View>
      <View className="h-40">
        <View className="flex flex-row items-center justify-between">
          <Text className={clsx("text-h6 font-normal leading-6")}>
            {t(
              "user_settings_screen.account_settings_language.language_description"
            )}
          </Text>
          <DropDownPicker
            open={openDropdown}
            value={value}
            items={items}
            setOpen={setOpenDropdown}
            setValue={setValue}
            setItems={setItems}
            placeholder={placeholder}
            style={{
              backgroundColor: "#fafafa",
              borderColor: "#e2e8f0",
              borderWidth: 1,
              borderRadius: 8,
              height: 48,
              zIndex: 10,
            }}
            containerStyle={{
              width: 150,
              backgroundColor: "#fafafa",
              zIndex: 10,
            }}
            dropDownContainerStyle={{
              backgroundColor: "#fafafa",
              borderColor: "#e2e8f0",
              borderWidth: 1,
              borderRadius: 8,
              maxHeight: 300,
              overflow: "scroll",
              zIndex: 20,
            }}
            theme="LIGHT"
            multiple={true}
            mode="SIMPLE"
            badgeDotColors={["#e76f51"]}
            renderListItem={({ item, isSelected, onPress }) => {
              const randomIndex = Math.random().toString().replace(".", "");
              return (
                <View key={randomIndex}>
                  <TouchableOpacity
                    onPress={() => handleSelectLanguage(item.value)}
                    key={randomIndex}
                  >
                    <View
                      className={clsx(
                        "flex-row items-center justify-start px-4 py-3",
                        {
                          "bg-gray-light": isSelected,
                        }
                      )}
                    >
                      <Text
                        key={item.label}
                        className="pl-3 text-h6 font-medium leading-6 text-black-default"
                      >
                        {item.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default LanguageSettings;
