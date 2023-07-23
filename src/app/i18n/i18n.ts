import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { buildYou } from "./sources";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    compatibilityJSON: "v3",
    debug: false,
    resources: buildYou,
    lng: "en",
    ns: ["index", "errorMessage"],
    react: {
      useSuspense: false,
    },
    defaultNS: "index",
    fallbackLng: false,
    initImmediate: false,
    // nsSeparator: false,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
