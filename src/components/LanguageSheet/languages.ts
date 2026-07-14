import { LanguageLabel } from "@appTypes";
import { SVGS } from "@assets";
import { t } from "i18next";
import { FC } from "react";
import { SvgProps } from "react-native-svg";

const { UsFlag, ArFlag } = SVGS;

export const LANGUAGES: {
  id: number;
  title: string;
  label: LanguageLabel;
  value: string;
  flag: FC<SvgProps>;
}[] = [
  {
    id: 1,
    title: t("auth.language.english"),
    label: "EN",
    value: "en",
    flag: UsFlag,
  },
  {
    id: 2,
    title: t("auth.language.arabic"),
    label: "AR",
    value: "ar",
    flag: ArFlag,
  },
];
