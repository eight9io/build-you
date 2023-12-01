import AsyncStorage from "@react-native-async-storage/async-storage";

export const getLanguageLocalStorage = async () => {
  const language = await AsyncStorage.getItem("language");
  if (language) {
    return language;
  }
  return "it";
};

export const setLanguageLocalStorage = async (language: "en" | "it") => {
  await AsyncStorage.setItem("language", language);
};
