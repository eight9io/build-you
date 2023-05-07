import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    lng: 'it',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    // debug: true,
    fallbackLng: false,
    initImmediate: false,
    keySeparator: false,
    nsSeparator: false,
    resources: {
      it: { translation: require('./translations/it.json') },
      //   vi: { translation: require('./translations/vi.json') },
    },
  });

export default i18n;
