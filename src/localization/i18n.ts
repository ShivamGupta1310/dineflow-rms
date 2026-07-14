import i18next, { ModuleType } from "i18next";
import { initReactI18next } from "react-i18next";
import * as RNLocalize from "react-native-localize";
import en from "@localization/en.json";
import ar from "@localization/ar.json";
import { LanguagesTypes } from "@appTypes";
import { getItem } from "@utils/storage";
import { StorageKeys } from "@utils/constants";

// Language detector for i18next
const languageDetector = {
  type: 'languageDetector' as ModuleType,
  async: true,
  detect: (callback: (language: string) => void) => {
    const data = getItem(StorageKeys.GLOBAL_CONTEXT) as any;
    if (data) {
      const language = data?.language;
      if (language) {
        callback(language);
      } else {
        const locales = RNLocalize.getLocales();
        callback(locales[0]?.languageCode || LanguagesTypes.en);
      }
    } else {
      const locales = RNLocalize.getLocales();
      callback(locales[0]?.languageCode || LanguagesTypes.en);
    }
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    fallbackLng: LanguagesTypes.en,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;
