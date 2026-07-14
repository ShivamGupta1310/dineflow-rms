import i18next from "i18next";

import { LanguagesTypes, LanguageLabel } from "@appTypes";
import { StorageKeys } from "@utils/constants";
import { getItem, setItem } from "@utils/storage";

type GlobalContextStorage = {
  language?: string;
};

export const changeAppLanguage = async (language: LanguageLabel) => {
  const selectedLanguage =
    language === "AR" ? LanguagesTypes.ar : LanguagesTypes.en;

  const globalContext =
    (getItem(StorageKeys.GLOBAL_CONTEXT) as GlobalContextStorage) ?? {};

  setItem(StorageKeys.GLOBAL_CONTEXT, {
    ...globalContext,
    language: selectedLanguage,
  });

  await i18next.changeLanguage(selectedLanguage);

};
